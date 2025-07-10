import { Select as AntSelect, Table } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ComponentSelect from "../../components/common/ComponentSelect";
import SharedDatePicker from "../../components/common/SharedDatePicker";
import SharedSelect from "../../components/common/SharedSelect";
import { fetchCurrencies } from "../../redux/currency";
import { fetchdepartment } from "../../redux/department";
import { fetchdesignation } from "../../redux/designation";
import { employeeOptionsFn } from "../../redux/Employee";
import { createMonthlyPayroll } from "../../redux/MonthlyPayroll";

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
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const { payrollDetail, loading } = useSelector((s) => s.monthlyPayroll || {});
  const { currencies } = useSelector((s) => s.currencies);
  const { employeeOptions } = useSelector((s) => s.employee);

  const { department } = useSelector((state) => state.department);
  const { designation } = useSelector((state) => state.designation);

  const departmentOptions = department?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.department_name,
  }));

  const designationOptions = designation?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.designation_name,
  }));

  useEffect(() => {
    if (payrollDetail) {
      setPayroll(payrollDetail);
    }
  }, [payrollDetail]);

  console.log(payroll);
  const currencyList = useMemo(
    () =>
      currencies?.data?.map((item) => ({
        value: item.id,
        label: `${item.currency_name} (${item.currency_code})`,
        currency_name: item.currency_name,
        currency_code: item.currency_code,
      })) || [],
    [currencies]
  );
  const getCurrencyNameById = (id) => {
    const c = currencyList.find((c) => String(c.value) === String(id));
    return c ? `${c.currency_name} (${c.currency_code})` : "";
  };
  const getCurrencyCodeById = (id) => {
    const c = currencyList.find((c) => String(c.value) === String(id));
    return c ? `${c.currency_code} (${c.currency_name})` : "";
  };

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchCurrencies({ is_active: true }));
    dispatch(employeeOptionsFn());
    dispatch(fetchdepartment({ is_active: true }));
    dispatch(fetchdesignation({ is_active: true }));
  }, [dispatch]);

  // Set payroll list when employee options or currency changes
  // useEffect(() => {
  //   if (employeeOptions) {
  //     const pay_currency = watch("pay_currency") || "";
  //     setPayroll(
  //       // employeeOptions.map((item) => ({
  //       //   employee_id: item.value,
  //       //   employee_name: item.label,
  //       //   net_pay: 0,
  //       //   pay_currency,
  //       //   processed: "N",
  //       //   is_selected: false,
  //       //   employee_email: item?.meta?.email || "",
  //       //   currency_name: getCurrencyNameById(pay_currency),
  //       //   currency_code: getCurrencyCodeById(pay_currency),
  //       // }))
  //     );
  //   }
  //   // eslint-disable-next-line
  // }, [employeeOptions, currencyList]);

  // Update payroll currency if global currency changes
  // useEffect(() => {
  //   setPayroll((prev) =>
  //     prev.map((item) => ({
  //       ...item,
  //       pay_currency: watch("pay_currency") || "",
  //       currency_name: getCurrencyNameById(watch("pay_currency")) || "",
  //       currency_code: getCurrencyCodeById(watch("pay_currency")) || "",
  //     }))
  //   );
  //   // eslint-disable-next-line
  // }, [watch("pay_currency"), currencyList]);

  // Reset form on mount and when midMonthPayroll changes
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
    // eslint-disable-next-line
  }, [reset, currencyList]);

  // Handlers
  const handleSelectAll = useCallback((e) => {
    setPayroll((prev) =>
      prev.map((item) => ({ ...item, is_selected: e.target.checked }))
    );
  }, []);

  const handleChangeComponent = useCallback((e, a) => {
    setPayroll((prev) =>
      prev.map((item) =>
        item.id === a.id ? { ...item, is_selected: e.target.checked } : item
      )
    );
  }, []);
  const handleNetPayChange = useCallback((value, idx) => {
    setPayroll((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, advance_amount: value } : item
      )
    );
  }, []);
  const handleEmployeeCurrencyChange = useCallback(
    (currencyValue, idx) => {
      setPayroll((prev) =>
        prev.map((item, i) =>
          i === idx
            ? {
                ...item,
                pay_currency: currencyValue,
                currency_name: getCurrencyNameById(currencyValue),
                currency_code: getCurrencyCodeById(currencyValue),
              }
            : item
        )
      );
    },
    [currencyList]
  );

  // Prepare selected employees for submission
  /**
   * Memoized list of selected employees with only required keys for submission.
   *
   * Filters the payroll array for selected employees and maps each to an object
   * containing only the necessary keys for the API.
   *
   * @returns {Array<Object>} Array of selected employee objects with filtered keys.
   *
   * @example
   *  Returns:
   *
   *  {
   *    employee_id: 15,
   *    payroll_month: 7,
   *    payroll_year: 2025,
   *    payroll_week: 1,
   *    pay_currency: 2,
   *    component_id: 109,
   *    status: "Pending",
   *    execution_date: "2025-07-10",
   *    advance_amount: "1200",
   *    doc_date: "2025-07-01",
   *    employee_email: "emp1@example.com",
   *    remarks: "",
   *    currency_name: "USD",
   *    processed: "Y"
   *  }
   *  ]
   */
  const selectedEmployees = useMemo(() => {
    return payroll
      .filter((item) => item.is_selected)
      .map((item) => {
        const filtered = {
          employee_id: item.employee_id,
          payroll_month: watch("payroll_month"),
          payroll_year: watch("payroll_year"),
          payroll_week: watch("payroll_week") || 1,
          pay_currency: item.pay_currency,
          component_id: watch("component_id"),
          status: "Pending",
          execution_date: watch("doc_date"),
          advance_amount: item.advance_amount || 0,
          doc_date: watch("doc_date"),
          employee_email: item.employee_email || "",
          remarks: "",
          processed: "Y",
        };
        return filtered;
      });
  }, [payroll, watch]);

  // Table columns
  const columns = [
    {
      title: (
        <div className="d-flex align-items-center gap-2">
          <input
            type="checkbox"
            className="form-check-input"
            style={{ width: 20, height: 20 }}
            checked={payroll.every((r) => r.is_selected)}
            onChange={(e) => handleSelectAll(e)}
          />
        </div>
      ),
      dataIndex: "id",
      render: (_, r) => (
        <input
          type="checkbox"
          className="form-check-input"
          style={{ width: 20, height: 20 }}
          checked={r.is_selected}
          onChange={(e) => handleChangeComponent(e, r)}
          aria-label={`Select component ${r.component_id}`}
        />
      ),
      width: 80,
    },
    {
      title: "Row No",
      dataIndex: "row_no",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Ext Emp No",
      dataIndex: "ext_emp_no",
      render: (text) => <span>{text}</span>,
    },
    ...[
      // dynamic columns for payroll components like BASIC PAY, HOUSING, etc.
      "basic_pay",
      "housing_allowance",
      "lunch_allowance",
      "transport_allowance",
      "education_allowance",
      "medical_allowance",
      "directors_bonus",
      "entertainment_allowance",
      "exgratia_payment",
      "gratuity",
      "leave_compensation",
      "overtime_normal",
      "overtime_holiday",
      "watch_person_allowance",
      "reimbursement",
      "arrears",
      "payment_in_kind",
      "taxable_income",
      "napsa",
      "personal_levy",
      "salary_advance",
      "deduction",
      "nhima",
      "absenteeism_deduction",
      "sdl",
      "loan",
      "recovery",
    ].map((key) => ({
      title: key.replace(/_/g, " ").toUpperCase(),
      dataIndex: key,
      render: (text) => <span>{Number(text).toFixed(4)}</span>,
    })),
    {
      title: "Tax Payee",
      dataIndex: "tax_payee",
      render: (text) => <span>{Number(text).toFixed(4)}</span>,
    },
    {
      title: "Net Salary",
      dataIndex: "net_salary",
      render: (text) => <span>{Number(text).toFixed(4)}</span>,
    },
    {
      title: "Jet Transaction ID",
      dataIndex: "jet_transaction_id",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Series",
      dataIndex: "series",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Total Deduction",
      dataIndex: "total_deduction",
      render: (text) => <span>{Number(text).toFixed(4)}</span>,
    },
    {
      title: "Total Payment",
      dataIndex: "total_payment",
      render: (text) => <span>{Number(text).toFixed(4)}</span>,
    },
    {
      title: "Project",
      dataIndex: "project",
      render: (text) => <span>{text}</span>,
    },
  ];

  const handleClose = () => {
    reset();
    setPayroll((prev) =>
      prev.map((item) => ({
        ...item,
        is_selected: false,
        advance_amount: 0,
        pay_currency: watch("pay_currency") || "",
        currency_name: getCurrencyNameById(watch("pay_currency") || ""),
        currency_code: getCurrencyCodeById(watch("pay_currency") || ""),
      }))
    );
  };

  // onSubmit: validate and dispatch
  const onSubmit = async () => {
    if (!selectedEmployees.length)
      return toast.error(
        "Please select at least one employee and enter Amount."
      );
    if (
      selectedEmployees.some(
        (emp) =>
          !emp.advance_amount ||
          isNaN(emp.advance_amount) ||
          Number(emp.advance_amount) <= 0
      )
    )
      return toast.error(
        "Please enter a valid Amount (greater than 0) for all selected employees."
      );

    try {
      await dispatch(createMonthlyPayroll(selectedEmployees)).unwrap();
      handleClose();
    } catch (e) {
      console.error("Error creating mid month payroll", e);
    }
  };

  const handlePreview = () => {
    // dispatch(
    //   fetchMonthlyPayrollDetail({
    //     payroll_month: watch("payroll_month"),
    //     payroll_year: watch("payroll_year"),
    //     employee_from: watch("employee_from"),
    //     employee_to: watch("employee_to"),
    //     department_from: watch("department_from"),
    //     department_to: watch("department_to"),
    //     position_from: watch("position_from"),
    //     position_to: watch("position_to"),
    //     component_id: watch("component_id"),
    //   })
    // );
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
                    {/* <div className="col-md-3">
                      <SharedSelect
                        name="payroll_week"
                        label="Payroll Week"
                        control={control}
                        options={payrollWeekOptions}
                        required={true}
                        errors={errors}
                      />
                    </div> */}
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
                    <div className="col-md-3 mb-3">
                      <label className="col-form-label" htmlFor="component_id">
                        Pay Component <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="component_id"
                        rules={{ required: "Pay Component is required!" }}
                        control={control}
                        render={({ field }) => (
                          <ComponentSelect
                            {...field}
                            is_advance={true}
                            value={field.value}
                            onChange={(i) => {
                              field.onChange(i.value);
                              setValue("component_name", i.label);
                            }}
                          />
                        )}
                      />
                      {errors.component_id && (
                        <small className="text-danger">
                          {errors.component_id.message}
                        </small>
                      )}
                    </div>
                    {/* <div className="col-md-3">
                      <SharedSelect
                        name="pay_currency"
                        label="Currency"
                        control={control}
                        options={currencyList}
                        errors={errors}
                        onChange={(o) => {
                          setValue("currency_name", o?.currency_name || "");
                          setValue("currency_code", o?.currency_code || "");
                        }}
                      />
                    </div> */}
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

                      <button
                        type="button"
                        className="btn mb-3 btn-primary"
                        onClick={handlePreview}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col-md-12 mb-3"
                    style={{ overflowX: "auto", maxHeight: "400px" }}
                  >
                    <Table
                      columns={columns}
                      dataSource={payroll}
                      loading={loading}
                      pagination={false}
                      rowKey="id"
                      size="small"
                      className="table-bordered"
                      style={{ width: "100%" }}
                      scroll={{ x: "max-content" }}
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Generate
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPayroll;
