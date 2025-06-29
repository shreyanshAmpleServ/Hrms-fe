import { Select as AntdSelect, Button } from "antd";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Table from "../../../components/common/dataTableNew/index";
import {
  createBasicSalary,
  fetchBasicSalaryById,
  updateBasicSalary,
} from "../../../redux/BasicSalary";
import { fetchbranch } from "../../../redux/branch";
import { fetchCurrencies } from "../../../redux/currency";
import { fetchdepartment } from "../../../redux/department";
import { fetchdesignation } from "../../../redux/designation";
import { fetchEmployee } from "../../../redux/Employee";
import { fetchpay_component } from "../../../redux/pay-component";
import { fetchWorkLifeEventLog } from "../../../redux/WorkLifeEventLog";

export const allowanceGroupList = [
  { value: "1", label: "Standard Allowance" },
  { value: "2", label: "Executive Allowance" },
  { value: "3", label: "Managerial Allowance" },
  { value: "4", label: "Field Staff Allowance" },
  { value: "5", label: "Technical Staff Allowance" },
];

export const payGradeLevelList = [
  { value: "1", label: "Level 1 - Entry" },
  { value: "2", label: "Level 2 - Junior" },
  { value: "3", label: "Level 3 - Mid" },
  { value: "4", label: "Level 4 - Senior" },
  { value: "5", label: "Level 5 - Executive" },
];

export const payGradeList = [
  { value: "1", label: "Grade A - ₹15,000 to ₹25,000" },
  { value: "2", label: "Grade B - ₹25,001 to ₹40,000" },
  { value: "3", label: "Grade C - ₹40,001 to ₹60,000" },
  { value: "4", label: "Grade D - ₹60,001 to ₹90,000" },
  { value: "5", label: "Grade E - ₹90,001 and above" },
];

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const initialBasicSalary = [
    {
      parent_id: "",
      line_num: "",
      pay_component_id: "",
      amount: "",
      type_value: "",
      currency_id: "",
      is_taxable: "",
      is_recurring: "",
      is_worklife_related: "",
      is_grossable: "",
      remarks: "",
      tax_code_id: "",
      gl_account_id: "",
      factor: "",
      payable_glaccount_id: "",
      component_type: "",
      project_id: "",
      cost_center1_id: "",
      cost_center2_id: "",
      cost_center3_id: "",
      cost_center4_id: "",
      cost_center5_id: "",
      column_order: "",
    },
  ];
  const [basicSalaryData, setBasicSalaryData] = useState(initialBasicSalary);
  const [employeeData, setEmployeeData] = useState(null);
  const dispatch = useDispatch();

  const { department } = useSelector((state) => state.department);
  const { branch } = useSelector((state) => state.branch);
  const { designation } = useSelector((state) => state.designation);
  const { loading, basicSalaryDetail } = useSelector(
    (state) => state.basicSalary
  );
  const { workLifeEventLog } = useSelector((state) => state.workLifeEventLog);
  const { pay_component } = useSelector((state) => state.payComponent);
  const employee = useSelector((state) => state.employee.employee);
  const { currencies } = useSelector((state) => state.currencies);

  // Form hook
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      employee_id: "",
      department_id: "",
      branch_id: "",
      position_id: "",
      pay_grade_id: "",
      pay_grade_level: "",
      allowance_group: "",
      work_life_entry: "",
      effective_from: new Date(),
      effective_to: new Date(),
      status: "Active",
      remarks: "",
    },
  });

  // Watch employee_id to trigger auto-population
  const watchedEmployeeId = watch("employee_id");

  // Memoized options lists
  const currencyList = useMemo(() => {
    return (
      currencies?.data?.map((item) => ({
        value: item.id,
        label: item.currency_name + " (" + item.currency_code + ")",
      })) || []
    );
  }, [currencies]);

  const departmentList = useMemo(() => {
    return (
      department?.data?.map((item) => ({
        value: item.id,
        label: item.department_name,
      })) || []
    );
  }, [department]);

  const branchList = useMemo(() => {
    return (
      branch?.data?.map((item) => ({
        value: item.id,
        label: item.branch_name,
      })) || []
    );
  }, [branch]);

  const designationList = useMemo(() => {
    return (
      designation?.data?.map((item) => ({
        value: item.id,
        label: item.designation_name,
      })) || []
    );
  }, [designation]);

  const employeeList = useMemo(
    () =>
      employee?.data?.map((item) => ({
        value: item.id,
        label: item.full_name,
        data: item,
      })) || [],
    [employee]
  );

  const statusList = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const workLifeEventLogList = useMemo(() => {
    return (
      workLifeEventLog?.data?.map((item) => ({
        value: item.id,
        label: item?.work_life_event_type?.event_type_name,
      })) || []
    );
  }, [workLifeEventLog]);

  const paycomponentList = useMemo(() => {
    const usedPayComponentIds = basicSalaryData
      .filter((item) => item.pay_component_id)
      .map((item) => item.pay_component_id);

    return (
      pay_component?.data
        ?.filter((item) => !usedPayComponentIds.includes(item.id))
        .map((item) => ({
          value: item.id,
          label: item.component_name,
        })) || []
    );
  }, [pay_component, basicSalaryData]);

  // Auto-populate department and designation when employee changes
  useEffect(() => {
    if (employee?.data && watchedEmployeeId) {
      const selectedEmployee = employee.data.find(
        (item) => item.id === watchedEmployeeId
      );
      if (selectedEmployee) {
        setEmployeeData(selectedEmployee);
        setValue("department_id", selectedEmployee.department_id || "");
        setValue("position_id", selectedEmployee.designation_id || "");
      }
    }
  }, [employee, watchedEmployeeId, setValue]);

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchdepartment());
    dispatch(fetchbranch());
    dispatch(fetchdesignation());
    dispatch(fetchEmployee());
    dispatch(fetchpay_component());
    dispatch(fetchWorkLifeEventLog());
    dispatch(fetchCurrencies());
  }, [dispatch]);

  // Fetch detail data for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData?.id) {
      dispatch(fetchBasicSalaryById(initialData.id));
    }
  }, [mode, initialData?.id, dispatch]);

  // Set basic salary data from API response
  useEffect(() => {
    if (
      mode === "edit" &&
      basicSalaryDetail?.hrms_d_employee_pay_component_assignment_line
    ) {
      setBasicSalaryData(
        basicSalaryDetail.hrms_d_employee_pay_component_assignment_line.length >
          0
          ? basicSalaryDetail.hrms_d_employee_pay_component_assignment_line
          : initialBasicSalary
      );
    }
  }, [mode, basicSalaryDetail?.hrms_d_employee_pay_component_assignment_line]);

  // Reset form based on mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        employee_id: initialData.employee_id || "",
        department_id: initialData.department_id || "",
        branch_id: initialData.branch_id || "",
        position_id: initialData.position_id || "",
        pay_grade_id: initialData.pay_grade_id || "",
        pay_grade_level: initialData.pay_grade_level || "",
        allowance_group: initialData.allowance_group || "",
        work_life_entry: initialData.work_life_entry || "",
        effective_from: initialData.effective_from
          ? new Date(initialData.effective_from)
          : new Date(),
        effective_to: initialData.effective_to
          ? new Date(initialData.effective_to)
          : new Date(),
        status: initialData.status || "Active",
        remarks: initialData.remarks || "",
      });
    } else if (mode === "add") {
      reset({
        employee_id: "",
        department_id: "",
        branch_id: "",
        position_id: "",
        pay_grade_id: "",
        pay_grade_level: "",
        allowance_group: "",
        work_life_entry: "",
        effective_from: new Date(),
        effective_to: new Date(),
        status: "Active",
        remarks: "",
      });
      setBasicSalaryData(initialBasicSalary);
    }
  }, [mode, initialData, reset]);

  // Modal close handler
  const handleModalClose = useCallback(() => {
    reset();
    setSelected(null);
    setBasicSalaryData(initialBasicSalary);
    setEmployeeData(null);
  }, [reset, setSelected]);

  // Add new basic salary row
  const handleAddBasicSalary = useCallback(() => {
    setBasicSalaryData((prev) => [...prev, ...initialBasicSalary]);
  }, []);

  // Handle basic salary data changes - Fixed the logic
  const handleChangeBasicSalary = useCallback(
    (identifier, field, value) => {
      setBasicSalaryData((prevData) => {
        return prevData.map((item, index) => {
          // Use index-based identification for new rows, pay_component_id for existing ones
          const shouldUpdate = item.pay_component_id
            ? item.pay_component_id === Number(identifier)
            : index === identifier;

          if (shouldUpdate) {
            let updatedItem = { ...item };
            const payComponent = pay_component?.data?.find(
              (comp) =>
                comp.id ===
                Number(field === "pay_component_id" ? value : identifier)
            );

            switch (field) {
              case "amount":
                updatedItem.amount = Number(value);
                break;
              case "currency_id":
                updatedItem.currency_id = Number(value);
                break;
              case "pay_component_id":
                updatedItem.pay_component_id = Number(value);
                if (payComponent) {
                  updatedItem.component_name = payComponent.component_name;
                  updatedItem.component_code = payComponent.component_code;
                  updatedItem.component_type =
                    payComponent.component_type || "O";
                  updatedItem.amount = payComponent.amount || 0;
                  updatedItem.auto_fill = payComponent.auto_fill;
                  updatedItem.is_taxable = payComponent.is_taxable;
                  updatedItem.is_statutory = payComponent.is_statutory;
                  updatedItem.is_recurring = payComponent.is_recurring;
                  updatedItem.is_advance = payComponent.is_advance;
                  updatedItem.is_grossable = payComponent.is_grossable;
                  updatedItem.is_overtime_related =
                    payComponent.is_overtime_related;
                  updatedItem.is_worklife_related =
                    payComponent.is_worklife_related;
                  updatedItem.unpaid_leave = payComponent.unpaid_leave;
                  updatedItem.contributes_to_nssf =
                    payComponent.contributes_to_nssf;
                  updatedItem.currency_id = payComponent.currency_id;
                  updatedItem.contributes_to_paye =
                    payComponent.contributes_to_paye;
                  updatedItem.gl_account_id = payComponent.gl_account_id;
                  updatedItem.project_id = payComponent.project_id;
                  updatedItem.tax_code_id = payComponent.tax_code_id;
                  updatedItem.payable_glaccount_id =
                    payComponent.payable_glaccount_id;
                  updatedItem.factor = payComponent.factor;
                  updatedItem.execution_order = payComponent.execution_order;
                  updatedItem.formula_editable = payComponent.formula_editable;
                  updatedItem.default_formula = payComponent.default_formula;
                  updatedItem.cost_center1_id = payComponent.cost_center1_id;
                  updatedItem.cost_center2_id = payComponent.cost_center2_id;
                  updatedItem.cost_center3_id = payComponent.cost_center3_id;
                  updatedItem.cost_center4_id = payComponent.cost_center4_id;
                  updatedItem.cost_center5_id = payComponent.cost_center5_id;
                  updatedItem.column_order = payComponent.column_order;
                }
                break;
              default:
                updatedItem[field] = value;
            }
            return updatedItem;
          }
          return item;
        });
      });
    },
    [pay_component?.data]
  );

  const handleDeleteBasicSalary = useCallback((identifier) => {
    setBasicSalaryData((prev) =>
      prev.filter((item, index) =>
        item.pay_component_id
          ? item.pay_component_id !== identifier
          : index !== identifier
      )
    );
  }, []);

  // Table columns configuration - Fixed the render functions
  const columns = useMemo(
    () => [
      {
        title: "Pay Component",
        dataIndex: "component_name",
        key: "component_name",
        render: (text, record, index) => (
          <AntdSelect
            options={[
              ...paycomponentList,
              ...(record.pay_component_id
                ? [
                    {
                      value: record.pay_component_id,
                      label: record.component_name,
                    },
                  ]
                : []),
            ]}
            style={{ width: "200px" }}
            value={record.pay_component_id || undefined}
            placeholder="Select Component"
            onChange={(value) =>
              handleChangeBasicSalary(
                record.pay_component_id || index,
                "pay_component_id",
                value
              )
            }
          />
        ),
      },
      {
        title: "Currency",
        dataIndex: "currency_id",
        key: "currency_id",
        render: (text, record, index) => (
          <AntdSelect
            options={currencyList}
            style={{ width: "200px" }}
            value={record.currency_id || undefined}
            placeholder="Select Currency"
            onChange={(value) =>
              handleChangeBasicSalary(
                record.pay_component_id || index,
                "currency_id",
                value
              )
            }
          />
        ),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: (text, record, index) => (
          <input
            type="number"
            className="form-control form-control-sm"
            style={{ width: "150px" }}
            placeholder="0.00"
            value={record.amount || ""}
            onChange={(e) =>
              handleChangeBasicSalary(
                record.pay_component_id || index,
                "amount",
                e.target.value
              )
            }
          />
        ),
      },
      {
        title: "Code",
        dataIndex: "component_code",
        key: "component_code",
        render: (text) => text || "-",
      },
      {
        title: "Type",
        dataIndex: "component_type",
        key: "component_type",
        render: (text) => text || "-",
      },
      {
        title: "Auto Fill",
        dataIndex: "auto_fill",
        key: "auto_fill",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "Is Taxable?",
        dataIndex: "is_taxable",
        key: "is_taxable",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "Is Statutory?",
        dataIndex: "is_statutory",
        key: "is_statutory",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "Is Recurring?",
        dataIndex: "is_recurring",
        key: "is_recurring",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "Is Advance?",
        dataIndex: "is_advance",
        key: "is_advance",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "Is Grossable?",
        dataIndex: "is_grossable",
        key: "is_grossable",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "Is Overtime Related?",
        dataIndex: "is_overtime_related",
        key: "is_overtime_related",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "Is Worklife Related?",
        dataIndex: "is_worklife_related",
        key: "is_worklife_related",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "Is Unpaid Leave?",
        dataIndex: "unpaid_leave",
        key: "unpaid_leave",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "Is Contributes to NSSF?",
        dataIndex: "contributes_to_nssf",
        key: "contributes_to_nssf",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "Is Contributes to PayE?",
        dataIndex: "contributes_to_paye",
        key: "contributes_to_paye",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "GL Account",
        dataIndex: "gl_account_id",
        key: "gl_account_id",
        render: (text) => text || "-",
      },
      {
        title: "Project",
        dataIndex: "project_id",
        key: "project_id",
        render: (text) => text || "-",
      },
      {
        title: "Tax Code",
        dataIndex: "tax_code_id",
        key: "tax_code_id",
        render: (text) => text || "-",
      },
      {
        title: "Payable GL Account",
        dataIndex: "payable_glaccount_id",
        key: "payable_glaccount_id",
        render: (text) => text || "-",
      },
      {
        title: "Pay or Deduct",
        dataIndex: "pay_or_deduct",
        key: "pay_or_deduct",
        render: (text) => (text === "P" ? "Pay" : "Deduct") || "-",
      },
      {
        title: "Factor",
        dataIndex: "factor",
        key: "factor",
        render: (text) => text || "-",
      },
      {
        title: "Execution Order",
        dataIndex: "execution_order",
        key: "execution_order",
        render: (text) => text || "-",
      },
      {
        title: "Formula Editable",
        dataIndex: "formula_editable",
        key: "formula_editable",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "Default Formula",
        dataIndex: "default_formula",
        key: "default_formula",
        render: (text) => text || "-",
      },
      {
        title: "Cost Center 1",
        dataIndex: "cost_center1_id",
        key: "cost_center1_id",
        render: (text) => text || "-",
      },
      {
        title: "Cost Center 2",
        dataIndex: "cost_center2_id",
        key: "cost_center2_id",
        render: (text) => text || "-",
      },
      {
        title: "Cost Center 3",
        dataIndex: "cost_center3_id",
        key: "cost_center3_id",
        render: (text) => text || "-",
      },
      {
        title: "Cost Center 4",
        dataIndex: "cost_center4_id",
        key: "cost_center4_id",
        render: (text) => text || "-",
      },
      {
        title: "Cost Center 5",
        dataIndex: "cost_center5_id",
        key: "cost_center5_id",
        render: (text) => text || "-",
      },
      {
        title: "Column Order",
        dataIndex: "column_order",
        key: "column_order",
        render: (text) => text || "-",
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (text, record, index) => (
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() =>
              handleDeleteBasicSalary(record.pay_component_id || index)
            }
          >
            Delete
          </button>
        ),
      },
    ],
    [
      paycomponentList,
      currencyList,
      handleChangeBasicSalary,
      handleDeleteBasicSalary,
    ]
  );

  // Form submission handler
  const onSubmit = useCallback(
    (data) => {
      const closeButton = document.getElementById(
        "close_btn_add_edit_basic_salary"
      );

      try {
        const submitData = {
          ...data,
          effective_from:
            data.effective_from?.toISOString() || new Date().toISOString(),
          effective_to:
            data.effective_to?.toISOString() || new Date().toISOString(),
          payLineData: JSON.stringify(
            basicSalaryData.filter((item) => item.pay_component_id)
          ),
        };

        if (mode === "add") {
          dispatch(createBasicSalary(submitData));
        } else if (mode === "edit" && initialData) {
          dispatch(
            updateBasicSalary({
              id: initialData.id,
              basicSalaryData: submitData,
            })
          );
        }

        closeButton?.click();
        handleModalClose();
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
    [basicSalaryData, dispatch, initialData, mode, handleModalClose]
  );

  // Cleanup event listener
  useEffect(() => {
    const offcanvasElement = document.getElementById(
      "offcanvas_add_edit_basic_salary"
    );
    if (offcanvasElement) {
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose
      );
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleModalClose
        );
      };
    }
  }, [handleModalClose]);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-larger"
      id="offcanvas_add_edit_basic_salary"
      tabIndex={-1}
    >
      {/* Header */}
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">
          {mode === "add" ? "Add" : "Edit"} Basic Salary
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          id="close_btn_add_edit_basic_salary"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>

      {/* Body */}
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Employee Information Section */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <label className="form-label">
                Employee <span className="text-danger">*</span>
              </label>
              <Controller
                name="employee_id"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={employeeList}
                    placeholder="Choose Employee"
                    isDisabled={!employeeList.length}
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => {
                      field.onChange(option?.value || "");
                    }}
                    value={employeeList.find(
                      (option) =>
                        String(option.value) === String(watch("employee_id"))
                    )}
                  />
                )}
              />
              {errors.employee_id && (
                <div className="invalid-feedback d-block">
                  {errors.employee_id.message}
                </div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Department</label>
              <Controller
                name="department_id"
                control={control}
                disabled={true}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={departmentList}
                    placeholder="Choose Department"
                    isDisabled={true}
                    classNamePrefix="react-select"
                    className="select2"
                    value={departmentList.find(
                      (option) =>
                        String(option.value) ===
                        String(employeeData?.department_id)
                    )}
                  />
                )}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Designation</label>
              <Controller
                name="designation_id"
                control={control}
                disabled={true}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      className="select"
                      options={designationList}
                      placeholder="Select Designation"
                      classNamePrefix="react-select"
                      value={designationList.find(
                        (option) =>
                          String(option.value) ===
                          String(employeeData?.designation_id)
                      )}
                      isDisabled={true}
                    />
                  );
                }}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">
                Branch <span className="text-danger">*</span>
              </label>
              <Controller
                name="branch_id"
                control={control}
                rules={{ required: "Branch is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={branchList}
                    placeholder="Choose Branch"
                    isDisabled={!branchList.length}
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => field.onChange(option?.value || "")}
                    value={branchList.find(
                      (option) =>
                        String(option.value) === String(watch("branch_id"))
                    )}
                  />
                )}
              />
              {errors.branch_id && (
                <div className="invalid-feedback d-block">
                  {errors.branch_id.message}
                </div>
              )}
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">
                Pay Grade <span className="text-danger">*</span>
              </label>
              <Controller
                name="pay_grade_id"
                control={control}
                rules={{ required: "Pay Grade is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={payGradeList}
                    placeholder="Choose Pay Grade"
                    isDisabled={!payGradeList.length}
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => {
                      field.onChange(option?.value || "");
                    }}
                    value={payGradeList.find(
                      (option) =>
                        String(option.value) === String(watch("pay_grade_id"))
                    )}
                  />
                )}
              />
              {errors.pay_grade_id && (
                <div className="invalid-feedback d-block">
                  {errors.pay_grade_id.message}
                </div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                Pay Grade Level <span className="text-danger">*</span>
              </label>
              <Controller
                name="pay_grade_level"
                control={control}
                rules={{ required: "Pay Grade Level is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={payGradeLevelList}
                    placeholder="Choose Pay Grade Level"
                    isDisabled={!payGradeLevelList.length}
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => {
                      field.onChange(option?.value || "");
                    }}
                    value={payGradeLevelList.find(
                      (option) =>
                        String(option.value) ===
                        String(watch("pay_grade_level"))
                    )}
                  />
                )}
              />
              {errors.pay_grade_level && (
                <div className="invalid-feedback d-block">
                  {errors.pay_grade_level.message}
                </div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                Allowance Group <span className="text-danger">*</span>
              </label>
              <Controller
                name="allowance_group"
                control={control}
                rules={{ required: "Allowance Group is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={allowanceGroupList}
                    placeholder="Choose Allowance Group"
                    isDisabled={!allowanceGroupList.length}
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => {
                      field.onChange(option?.value || "");
                    }}
                    value={allowanceGroupList.find(
                      (option) =>
                        String(option.value) ===
                        String(watch("allowance_group"))
                    )}
                  />
                )}
              />
              {errors.allowance_group && (
                <div className="invalid-feedback d-block">
                  {errors.allowance_group.message}
                </div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">
                Work Life Entry <span className="text-danger">*</span>
              </label>
              <Controller
                name="work_life_entry"
                control={control}
                rules={{ required: "Work Life Entry is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={workLifeEventLogList}
                    placeholder="Choose Work Life Entry"
                    isDisabled={!workLifeEventLogList.length}
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => {
                      field.onChange(option?.value || "");
                    }}
                    value={workLifeEventLogList.find(
                      (option) =>
                        String(option.value) ===
                        String(watch("work_life_entry"))
                    )}
                  />
                )}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">
                Effective From <span className="text-danger">*</span>
              </label>
              <Controller
                name="effective_from"
                control={control}
                rules={{ required: "Effective From is required!" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="form-control"
                    placeholderText="Select Effective From"
                    selected={field.value}
                    value={
                      field.value
                        ? moment(field.value).format("DD-MM-YYYY")
                        : ""
                    }
                    onChange={field.onChange}
                    minDate={watch("effective_from")}
                  />
                )}
              />
              {errors.effective_from && (
                <div className="invalid-feedback d-block">
                  {errors.effective_from.message}
                </div>
              )}
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">
                Effective To <span className="text-danger">*</span>
              </label>
              <Controller
                name="effective_to"
                control={control}
                rules={{ required: "Effective To is required!" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="form-control"
                    placeholderText="Select Effective To"
                    selected={field.value}
                    value={
                      field.value
                        ? moment(field.value).format("DD-MM-YYYY")
                        : ""
                    }
                    onChange={field.onChange}
                    minDate={watch("effective_from")}
                  />
                )}
              />
              {errors.effective_to && (
                <div className="invalid-feedback d-block">
                  {errors.effective_to.message}
                </div>
              )}
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">
                Status <span className="text-danger">*</span>
              </label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required!" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={statusList}
                    placeholder="Choose Status"
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => {
                      field.onChange(option?.value || "");
                    }}
                    value={statusList.find(
                      (option) =>
                        String(option.value) === String(watch("status")?.label)
                    )}
                  />
                )}
              />
              {errors.status && (
                <div className="invalid-feedback d-block">
                  {errors.status.message}
                </div>
              )}
            </div>
            <div className="col-12 mb-3">
              <label className="form-label">Remarks</label>
              <Controller
                name="remarks"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="form-control"
                    placeholder="Enter Remarks"
                    rows={3}
                  />
                )}
              />
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleAddBasicSalary}
                icon={<i className="ti ti-square-rounded-plus me-1" />}
              >
                New Row
              </Button>
            </div>
            <div className="table-responsive custom-table">
              <Table
                dataSource={basicSalaryData || []}
                columns={columns}
                loading={loading}
                className="table-bordered"
                pagination={false}
                scroll={{ x: "max-content" }}
                size="small"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="d-flex justify-content-end gap-2 pt-3 border-top">
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              className="btn btn-light"
              onClick={handleModalClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {mode === "add" ? "Create" : "Update"}
              {loading && (
                <div
                  className="spinner-border spinner-border-sm ms-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        .custom-table .ant-table-cell {
          padding: 8px 12px !important;
        }

        .custom-table .ant-table-thead > tr > th {
          background-color: #f8f9fa;
          font-weight: 600;
        }

        .react-select__control {
          min-height: 38px;
          border-color: #ced4da;
        }

        .react-select__control:hover {
          border-color: #86b7fe;
        }

        .react-select__control--is-focused {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
};

export default AddEditModal;
