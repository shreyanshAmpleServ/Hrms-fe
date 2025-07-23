import { Table } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TbArrowBigRightFilled } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import SharedDatePicker from "../../components/common/SharedDatePicker";
import SharedSelect from "../../components/common/SharedSelect";
import { fetchCurrencies } from "../../redux/currency";
import { fetchdepartment } from "../../redux/department";
import { fetchdesignation } from "../../redux/designation";
import { employeeOptionsFn } from "../../redux/Employee";
import {
  createMonthlyPayroll,
  fetchComponentsFn,
  fetchMonthlyPayrollPreview,
  fetchTaxAmountFn,
} from "../../redux/MonthlyPayroll";
import { fetchTaxSlab } from "../../redux/taxSlab";

export const DEFAULT_PAYROLL_MONTH = new Date().getMonth() + 1;
export const DEFAULT_PAYROLL_WEEK = 1;
export const DEFAULT_PAYROLL_YEAR = new Date().getFullYear();

export const payrollMonthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(0, i).toLocaleString("default", { month: "long" }),
}));
export const payrollWeekOptions = Array.from({ length: 4 }, (_, i) => ({
  value: i + 1,
  label: `Week ${i + 1}`,
}));

const MonthlyPayroll = () => {
  const [payroll, setPayroll] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const { loading, monthlyPayrollPreview, componentNames } = useSelector(
    (s) => s.monthlyPayroll || {}
  );
  const { employeeOptions } = useSelector((s) => s.employee);
  const { department } = useSelector((state) => state.department);
  const { designation } = useSelector((state) => state.designation);
  const { taxSlab } = useSelector((state) => state.taxSlab);

  const departmentOptions = department?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.department_name,
  }));

  const designationOptions = designation?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.designation_name,
  }));

  const getInputKey = (employeeId, componentCode) =>
    `${employeeId}-${componentCode}`;

  const handleComponentValueChange = useCallback(
    (employeeId, componentCode, newValue) => {
      const key = getInputKey(employeeId, componentCode);
      const numValue = parseFloat(newValue) || 0;

      setInputValues((prev) => ({
        ...prev,
        [key]: newValue,
      }));

      setPayroll((prev) =>
        prev.map((item) => {
          if (item.employee_id === employeeId) {
            const updatedComponents = item.components.map((comp) => {
              if (comp.component_code === componentCode) {
                // Instead of replacing, add to the value if already present
                return {
                  ...comp,
                  component_value: numValue,
                };
              }
              return comp;
            });
            return {
              ...item,
              components: updatedComponents,
            };
          }
          return item;
        })
      );

      setIsCalculated(false);
    },
    []
  );

  const location = useLocation();
  useEffect(() => {
    setPayroll([]);
    setInputValues({});
    setIsCalculated(false);
  }, [location.pathname]);

  useEffect(() => {
    if (monthlyPayrollPreview && componentNames?.length > 0) {
      const formattedPayroll = monthlyPayrollPreview.map((item) => {
        const components = [];
        const employeeDetails = {};

        for (const [key, value] of Object.entries(item)) {
          if (/^\d+$/.test(key)) {
            const compMeta = componentNames.find(
              (c) => String(c.component_code) === key
            );

            const component_value = parseFloat(value) || 0;
            const isPayable = compMeta?.pay_or_deduct === "P";
            const isTaxable = compMeta?.is_taxable === "Y";
            const isNSSF = compMeta?.contributes_to_nssf === "Y";
            const isEmployeeContribution =
              compMeta?.contribution_of_employee === "Y";
            const defaultFormula = compMeta?.default_formula;
            const employeeDefaultFormula = compMeta?.employer_default_formula;

            components.push({
              component_code: key,
              component_name: compMeta?.component_name,
              component_value: component_value,
              isPayable,
              isTaxable,
              defaultFormula,
              employeeDefaultFormula,
              isEmployeeContribution,
              isNSSF,
            });
          } else {
            employeeDetails[key] = item[key];
          }
        }

        return {
          ...employeeDetails,
          components,
          total_earnings: 0,
          total_deductions: 0,
          net_pay: 0,
          TaxableIncome: 0,
          TaxPayee: 0,
          is_selected: false,
        };
      });

      setPayroll(formattedPayroll);
      setIsCalculated(false);
      setInputValues({});
    }
  }, [monthlyPayrollPreview, componentNames]);

  const performCalculations = useCallback(
    (payrollData) => {
      return payrollData.map((item) => {
        let total_earnings = 0;
        let total_deductions = 0;
        let total_net_earnings = 0;
        let total_net_deductions = 0;
        let TaxableIncome = 0;

        const baseValues = {};

        item.components.forEach((comp) => {
          const val = parseFloat(comp.component_value) || 0;
          baseValues[comp.component_code] = val;

          if (comp.isPayable && comp.isTaxable) {
            total_earnings += val;
          } else if (!comp.isPayable && comp.isTaxable) {
            total_deductions += val;
          }

          if (comp.isPayable) {
            total_net_earnings += val;
          } else {
            total_net_deductions += val;
          }
        });

        TaxableIncome = total_earnings - total_deductions;
        const NetPay =
          total_net_earnings - total_net_deductions - item.TaxPayee;

        const calculatedValues = {
          "Taxable Income": TaxableIncome.toFixed(2),
          "Tax Payee": (item.TaxPayee || 0).toFixed(2),
          "Net Pay": NetPay.toFixed(2),
          "Total Earnings": total_net_earnings.toFixed(2),
          "Total Deductions": total_net_deductions.toFixed(2),
        };

        const updatedComponents = item.components.map((comp) => {
          let finalValue = parseFloat(comp.component_value) || 0;

          if (comp.defaultFormula) {
            try {
              let formula = componentNames.reduce((f, meta) => {
                const code = meta.component_code;
                const name = meta.component_name;
                const val = baseValues[code] ?? 0;
                return f.replaceAll(`[${name}]`, val);
              }, comp.defaultFormula);

              formula = Object.entries(calculatedValues).reduce(
                (f, [name, val]) => {
                  return f.replaceAll(`[${name}]`, val);
                },
                formula
              );

              const result = Function(
                '"use strict"; return (' + formula + ")"
              )();
              finalValue = isNaN(result) ? 0 : result;
            } catch (e) {
              console.error("Error evaluating default formula:", e);
              finalValue = 0;
            }
          } else if (
            comp.isEmployeeContribution &&
            comp.employeeDefaultFormula
          ) {
            try {
              let formula = componentNames.reduce((f, meta) => {
                const code = meta.component_code;
                const name = meta.component_name;
                const val = baseValues[code] ?? 0;
                return f.replaceAll(`[${name}]`, val);
              }, comp.employeeDefaultFormula);

              formula = Object.entries(calculatedValues).reduce(
                (f, [name, val]) => {
                  return f.replaceAll(`[${name}]`, val);
                },
                formula
              );

              const result = Function(
                '"use strict"; return (' + formula + ")"
              )();
              finalValue = isNaN(result) ? 0 : finalValue + result;
            } catch (e) {
              console.error("Error evaluating employee default formula:", e);
              finalValue = 0;
            }
          }

          return {
            ...comp,
            component_value: finalValue,
          };
        });

        return {
          ...item,
          components: updatedComponents,
          total_earnings: total_net_earnings.toFixed(2),
          total_deductions: total_net_deductions.toFixed(2),
          net_pay: NetPay.toFixed(2),
          TaxableIncome: TaxableIncome.toFixed(2),
        };
      });
    },
    [componentNames]
  );

  const fetchTaxSlabByComponent = useCallback(
    (component) => {
      const t = taxSlab?.data?.find((i) =>
        i.formula_text.includes(component?.component_name)
      );

      const componentHaveUpdated = t?.tax_slab_pay_component?.component_name;

      const taxSlabRule = t?.hrms_m_tax_slab_rule1?.find(
        (i) => i.slab_min <= component?.value && i.slab_max >= component?.value
      );
      const rate = parseFloat(taxSlabRule?.rate);
      const flat_amount = parseFloat(taxSlabRule?.flat_amount);

      if (rate) {
        return { rate, flat_amount: 0, componentHaveUpdated };
      }
      return { rate: 0, flat_amount: flat_amount || 0, componentHaveUpdated };
    },
    [taxSlab]
  );

  // Helper function to calculate default formula value for a component
  const calculateDefaultFormulaValue = useCallback(
    (targetComponent, baseValues, calculatedValues) => {
      let defaultFormulaValue = 0;

      if (
        targetComponent.defaultFormula ||
        (targetComponent.isEmployeeContribution &&
          targetComponent.employeeDefaultFormula)
      ) {
        try {
          const formulaToUse =
            targetComponent.defaultFormula ||
            targetComponent.employeeDefaultFormula;

          let formula = componentNames.reduce((f, meta) => {
            const code = meta.component_code;
            const name = meta.component_name;
            const val = baseValues[code] ?? 0;
            return f.replaceAll(`[${name}]`, val);
          }, formulaToUse);

          formula = Object.entries(calculatedValues).reduce(
            (f, [name, val]) => {
              return f.replaceAll(`[${name}]`, val);
            },
            formula
          );

          const result = Function('"use strict"; return (' + formula + ")")();
          defaultFormulaValue = isNaN(result) ? 0 : result;
        } catch (e) {
          console.error("Error evaluating formula:", e);
          defaultFormulaValue = 0;
        }
      }

      return defaultFormulaValue;
    },
    [componentNames]
  );

  // COMBINED CALCULATION FUNCTION - This replaces both handleCalculateNetWithTax and calculateAndUpdateTaxComponents
  const handleCompleteCalculation = async (payrollData) => {
    try {
      // Step 1: Filter selected employees
      const selectedRows = payrollData.filter((item) => item.is_selected);

      if (selectedRows.length === 0) {
        toast.error("Please select at least one employee to calculate.");
        return;
      }

      // Step 2: Perform initial calculations for selected employees
      let calculatedRows = performCalculations(selectedRows);

      // Step 3: Fetch tax amounts from API for each selected employee
      const taxResponses = await Promise.all(
        calculatedRows.map((row) =>
          fetchTaxAmountFn({
            employee_id: row.employee_id,
            taxable_amount: row.TaxableIncome,
          })
        )
      );

      // Step 4: Update calculatedRows with tax amounts from API
      calculatedRows = calculatedRows.map((row, idx) => ({
        ...row,
        TaxPayee: taxResponses[idx]?.tax_payee ?? 0,
      }));

      // Step 5: Recalculate with updated tax amounts
      calculatedRows = performCalculations(calculatedRows);

      // Step 6: For each selected employee, update tax-related components if needed
      calculatedRows = calculatedRows.map((payrollItem) => {
        if (!payrollItem.is_selected) return payrollItem;

        const updatedItem = { ...payrollItem };
        const updatedComponents = [...payrollItem.components];

        // Prepare base and calculated values for formula calculations
        const baseValues = {};
        updatedComponents.forEach((comp) => {
          baseValues[comp.component_code] = parseFloat(comp.component_value) || 0;
        });

        const calculatedValues = {
          "Taxable Income": parseFloat(payrollItem.TaxableIncome) || 0,
          "Tax Payee": parseFloat(payrollItem.TaxPayee) || 0,
          "Net Pay": parseFloat(payrollItem.net_pay) || 0,
          "Total Earnings": parseFloat(payrollItem.total_earnings) || 0,
          "Total Deductions": parseFloat(payrollItem.total_deductions) || 0,
        };

        updatedComponents.forEach((component) => {
          const taxCalculation = fetchTaxSlabByComponent({
            component_name: component.component_name,
            value: component.component_value,
          });

          if (taxCalculation.componentHaveUpdated) {
            const taxComponentIndex = updatedComponents.findIndex(
              (comp) => comp.component_name === taxCalculation.componentHaveUpdated
            );

            if (taxComponentIndex !== -1) {
              let taxAmount = 0;

              // Calculate tax amount based on rate or flat amount
              if (taxCalculation.rate > 0) {
                taxAmount = (component.component_value * taxCalculation.rate) / 100;
              } else if (taxCalculation.flat_amount > 0) {
                taxAmount = taxCalculation.flat_amount;
              }

              const targetComponent = updatedComponents[taxComponentIndex];

              // Calculate default formula value if exists
              const defaultFormulaValue = calculateDefaultFormulaValue(
                targetComponent,
                baseValues,
                calculatedValues
              );

              // Add tax amount + default formula value
              const finalValue = taxAmount + defaultFormulaValue;

              // Update the target component
              updatedComponents[taxComponentIndex] = {
                ...updatedComponents[taxComponentIndex],
                component_value: finalValue,
              };
            }
          }
        });

        return {
          ...updatedItem,
          components: updatedComponents,
        };
      });

      // Step 7: Update the main payroll state with the new calculated values
      setPayroll((prevPayroll) =>
        prevPayroll.map((item) => {
          if (item.is_selected) {
            const updated = calculatedRows.find(
              (calcRow) => calcRow.employee_id === item.employee_id
            );
            return updated || item;
          }
          return item;
        })
      );

      // Step 8: Update input values for UI
      const newInputValues = { ...inputValues };
      calculatedRows.forEach((item) => {
        item.components.forEach((comp) => {
          const key = getInputKey(item.employee_id, comp.component_code);
          newInputValues[key] = comp.component_value.toString();
        });
      });
      setInputValues(newInputValues);
      setIsCalculated(true);

      toast.success(
        `Complete calculations (including tax) completed successfully for ${selectedRows.length} selected employee(s)!`
      );
    } catch (error) {
      console.log("Error performing complete calculation:", error);
      toast.error("Error performing calculations");
    }
  };

  useEffect(() => {
    dispatch(fetchCurrencies({ is_active: true }));
    dispatch(employeeOptionsFn());
    dispatch(fetchdepartment({ is_active: true }));
    dispatch(fetchdesignation({ is_active: true }));
    dispatch(fetchComponentsFn());
    dispatch(fetchTaxSlab());
  }, [dispatch]);

  useEffect(() => {
    reset({
      payroll_month: DEFAULT_PAYROLL_MONTH,
      payroll_year: DEFAULT_PAYROLL_YEAR,
      employee_from: "",
      employee_to: "",
      department_from: "",
      department_to: "",
      position_from: "",
      position_to: "",
      component_id: "",
      doc_date: new Date(),
    });
    setPayroll([]);
    setInputValues({});
    setIsCalculated(false);
  }, [reset]);

  const handlePreviewFn = () => {
    dispatch(
      fetchMonthlyPayrollPreview({
        paymonth: watch("payroll_month") || 7,
        payyear: watch("payroll_year") || 2025,
        empidfrom: watch("employee_from") || 15,
        empidto: watch("employee_to") || 41,
        positionidfrom: watch("department_from") || 12,
        positionidto: watch("department_to") || 9,
        dptfrom: watch("position_from") || 3,
        dptto: watch("position_to") || 2,
        branchfrom: watch("branch_from") || 1,
        branchto: watch("branch_to") || 1,
        loanflag: watch("loanflag") || 1,
        grade: "",
      })
    );
  };

  const handleSelectAll = useCallback((e) => {
    setPayroll((prev) =>
      prev.map((item) => ({ ...item, is_selected: e.target.checked }))
    );
  }, []);

  const selectedEmployees = useMemo(() => {
    return payroll
      .filter((item) => item.is_selected)
      .map((item) => ({
        ...item,
        employee_id: item.employee_id,
        payroll_month: watch("payroll_month"),
        payroll_year: watch("payroll_year"),
        payroll_week: watch("payroll_week") || 1,
        status: "Pending",
        execution_date: new Date(watch("doc_date")).toISOString(),
        doc_date: new Date(watch("doc_date")).toISOString(),
        Currency: item.Currency === "TZS" ? 23 : item.Currency,
        employee_email: item.employee_email || "",
        ...item.components?.reduce((acc, comp) => {
          acc[comp.component_code] = comp.component_value;
          return acc;
        }, {}),
      }))
      .map(({ is_selected, components, ...item }) => item);
  }, [payroll, watch]);

  const handleChangeComponent = (e, r) => {
    setPayroll((prev) =>
      prev.map((item) =>
        item.employee_id === r.employee_id
          ? { ...item, is_selected: e.target.checked }
          : item
      )
    );
    setIsCalculated(false);
  };

  const components = useMemo(() => {
    return (
      componentNames?.map((component) => {
        const { component_code, component_name, pay_or_deduct } = component;
        const isPayable = pay_or_deduct === "P";

        return {
          title: component_name,
          dataIndex: component_code,
          isPayable: isPayable,
          render: (_, record) => {
            const comp = record.components?.find(
              (c) => c.component_code === String(component_code)
            );

            const inputKey = getInputKey(record.employee_id, component_code);
            const displayValue =
              inputValues[inputKey] !== undefined
                ? inputValues[inputKey]
                : comp?.component_value || 0;

            return (
              <div style={{ height: "30px", width: "120px" }}>
                {record.is_selected ? (
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={Number(displayValue)?.toFixed(2)}
                    onChange={(e) => {
                      setInputValues((prev) => ({
                        ...prev,
                        [inputKey]: e.target.value,
                      }));
                    }}
                    onBlur={(e) => {
                      handleComponentValueChange(
                        record.employee_id,
                        component_code,
                        e.target.value
                      );
                    }}
                    step="0.01"
                  />
                ) : (
                  <span>{comp?.component_value || 0}</span>
                )}
              </div>
            );
          },
        };
      }) || []
    );
  }, [componentNames, handleComponentValueChange, inputValues]);

  const columns = [
    {
      title: (
        <div className="d-flex align-items-center gap-2">
          <input
            type="checkbox"
            className="form-check-input"
            style={{ width: 20, height: 20 }}
            checked={payroll.length > 0 && payroll.every((r) => r.is_selected)}
            onChange={(e) => handleSelectAll(e)}
          />
        </div>
      ),
      dataIndex: "employee_id",
      render: (_, r) => (
        <input
          type="checkbox"
          className="form-check-input"
          style={{ width: 20, height: 20 }}
          checked={r.is_selected || false}
          onChange={(e) => handleChangeComponent(e, r)}
          aria-label={`Select employee ${r.employee_id}`}
        />
      ),
      width: 40,
    },
    {
      title: "RowNo",
      dataIndex: "RowNo",
    },
    {
      title: "Employee Code",
      dataIndex: "employee_code",
      render: (text, record) => (
        <Link
          className="d-flex gap-1 align-items-center"
          target="_blank"
          to={`/employee/${record.employee_id}`}
        >
          <TbArrowBigRightFilled color="#fdbe35" size={20} />
          {text}
        </Link>
      ),
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
    },
    {
      title: "Component Assit ID",
      dataIndex: "component_assit_id",
    },
    {
      title: "Currency",
      dataIndex: "Currency",
    },
    ...components,
    {
      title: "Tax Payee",
      dataIndex: "TaxPayee",
      render: (value) => value || 0,
    },
    {
      title: "Taxable Income",
      dataIndex: "TaxableIncome",
      render: (value) => value || 0,
    },
    {
      title: "Net Pay",
      dataIndex: "net_pay",
      render: (value) => value || 0,
    },
    {
      title: "Total Deductions",
      dataIndex: "total_deductions",
      render: (value) => value || 0,
    },
    {
      title: "Total Earnings",
      dataIndex: "total_earnings",
      render: (value) => value || 0,
    },
  ];

  const handleClose = () => {
    reset();
    setInputValues({});
    setIsCalculated(false);
  };

  const onSubmit = async () => {
    if (!isCalculated) {
      return toast.error(
        "Please calculate the payroll first before generating."
      );
    }

    if (!selectedEmployees.length) {
      return toast.error("Please select at least one employee.");
    }

    try {
      await dispatch(createMonthlyPayroll(selectedEmployees)).unwrap();
      handleClose();
      handlePreviewFn();
    } catch (e) {
      console.error("Error creating monthly payroll", e);
    }
  };

  const handlePreview = () => {
    setIsCalculated(false);
    setInputValues({});
    handlePreviewFn();
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12 pt-4">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-4 mb-3">
                  <h4 className="page-title">Monthly Payroll</h4>
                </div>
              </div>
            </div>
            <div>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                <div>
                  <div className="row">
                    <div className="col-md-3">
                      <SharedSelect
                        name="payroll_month"
                        label="Payroll Month"
                        control={control}
                        options={payrollMonthOptions}
                        required={true}
                        errors={errors}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="col-form-label">
                        Payroll Year <span className="text-danger">*</span>
                      </label>
                      <div className="mb-3">
                        <div className="icon-form">
                          <span className="form-icon">
                            <i className="ti ti-calendar-check" />
                          </span>
                          <Controller
                            name="payroll_year"
                            control={control}
                            rules={{ required: "Payroll Year is required!" }}
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                className="form-control"
                                placeholderText="Select Payroll Year"
                                showYearPicker
                                dateFormat="yyyy"
                                selected={
                                  field.value ? new Date(field.value, 0) : null
                                }
                                onChange={(date) =>
                                  field.onChange(
                                    date ? date.getFullYear() : null
                                  )
                                }
                              />
                            )}
                          />
                        </div>
                      </div>
                      {errors.payroll_year && (
                        <small className="text-danger">
                          {errors.payroll_year.message}
                        </small>
                      )}
                    </div>
                    <div className="col-md-3">
                      <SharedDatePicker
                        name="doc_date"
                        label="Document Date"
                        control={control}
                        errors={errors}
                        dateFormat="dd-MM-yyyy"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 d-flex gap-3 align-items-center">
                      <p className="fw-bold" style={{ width: "100px" }}>
                        Employee :{" "}
                      </p>
                      <SharedSelect
                        name="employee_from"
                        control={control}
                        placeholder="Select Employee From"
                        options={employeeOptions}
                        errors={errors}
                        className="col-md-3"
                      />
                      <SharedSelect
                        name="employee_to"
                        control={control}
                        placeholder="Select Employee To"
                        options={employeeOptions}
                        errors={errors}
                        className="col-md-3"
                      />
                    </div>
                    <div className="col-md-12 d-flex gap-3 align-items-center">
                      <p className="fw-bold" style={{ width: "100px" }}>
                        Department :{" "}
                      </p>
                      <SharedSelect
                        name="department_from"
                        control={control}
                        placeholder="Select Department From"
                        options={departmentOptions}
                        errors={errors}
                        className="col-md-3"
                      />
                      <SharedSelect
                        name="department_to"
                        control={control}
                        placeholder="Select Department To"
                        options={departmentOptions}
                        errors={errors}
                        className="col-md-3"
                      />
                    </div>
                    <div className="col-md-12 d-flex gap-3 align-items-center">
                      <p className="fw-bold" style={{ width: "100px" }}>
                        Position :{" "}
                      </p>
                      <SharedSelect
                        name="position_from"
                        control={control}
                        placeholder="Select Position From"
                        options={designationOptions}
                        errors={errors}
                        className="col-md-3"
                      />
                      <SharedSelect
                        name="position_to"
                        control={control}
                        placeholder="Select Position To"
                        options={designationOptions}
                        errors={errors}
                        className="col-md-3"
                      />
                      <div className="ms-auto">
                        <button
                          style={{ width: "100px" }}
                          type="button"
                          className="btn mb-3 btn-primary"
                          onClick={handlePreview}
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {payroll.length > 0 ? (
                    <>
                      <div
                        className="col-md-12 mb-3"
                        style={{ overflowX: "auto", maxHeight: "400px" }}
                      >
                        <Table
                          columns={columns}
                          dataSource={payroll}
                          loading={loading}
                          pagination={false}
                          rowKey="employee_id"
                          size="small"
                          className="table-bordered"
                          style={{ width: "100%" }}
                          scroll={{ x: "max-content" }}
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <div
                        className="col-md-12 mb-3 card"
                        style={{
                          height: "200px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <p className="text-center">
                          No data found, please select employee and preview
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {payroll.length > 0 && (
                  <div className="d-flex text-nowrap align-items-center gap-2 justify-content-end">
                    <button
                      type="button"
                      style={{ width: "150px" }}
                      onClick={() => handleCompleteCalculation(payroll)}
                      className="btn btn-success"
                      disabled={loading || isCalculated}
                    >
                      {isCalculated ? "Calculated" : "Calculate Net"}
                    </button>

                    <button
                      style={{ width: "100px" }}
                      type="submit"
                      className="btn btn-primary"
                      disabled={!isCalculated || loading}
                    >
                      Generate
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPayroll;
