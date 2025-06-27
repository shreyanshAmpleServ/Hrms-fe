import { Select as AntdSelect, Button, Table } from "antd";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  createBasicSalary,
  fetchBasicSalaryById,
  updateBasicSalary,
} from "../../../redux/BasicSalary";
import { fetchbranch } from "../../../redux/branch";
import { fetchdepartment } from "../../../redux/department";
import { fetchdesignation } from "../../../redux/designation";
import { fetchEmployee } from "../../../redux/Employee";
import { fetchpay_component } from "../../../redux/pay-component";

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

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const [basicSalaryData, setBasicSalaryData] = useState(initialBasicSalary);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
  const dispatch = useDispatch();

  // Redux selectors
  const { department } = useSelector((state) => state.department);
  const { branch } = useSelector((state) => state.branch);
  const { designation } = useSelector((state) => state.designation);
  const { loading, basicSalaryDetail } = useSelector(
    (state) => state.basicSalary
  );
  const { pay_component } = useSelector((state) => state.payComponent);
  const employee = useSelector((state) => state.employee.employee);

  // Form hook
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm();

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchdepartment());
    dispatch(fetchbranch());
    dispatch(fetchdesignation());
    dispatch(fetchEmployee());
    dispatch(fetchpay_component());
  }, [dispatch]);

  // Fetch detail data for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      dispatch(fetchBasicSalaryById(initialData.id));
    }
  }, [mode, initialData, dispatch]);

  // Memoized options lists
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

  const payGradeList = useMemo(() => {
    return [
      { value: "", label: "Select Pay Grade" },
      { value: "1", label: "A" },
      { value: "2", label: "B" },
      { value: "3", label: "C" },
      { value: "4", label: "D" },
      { value: "5", label: "E" },
    ];
  }, []);

  const payGradeLevelList = useMemo(() => {
    return [
      { value: "", label: "Select Pay Grade Level" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
    ];
  }, []);

  const allowanceGroupList = useMemo(() => {
    return [
      { value: "", label: "Select Allowance Group" },
      { value: "1", label: "A" },
      { value: "2", label: "B" },
      { value: "3", label: "C" },
      { value: "4", label: "D" },
      { value: "5", label: "E" },
    ];
  }, []);

  const workLifeEntryList = useMemo(() => {
    return [
      { value: "", label: "Select Work Life Entry" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
    ];
  }, []);

  const paycomponentList = useMemo(() => {
    const usedPayComponentIds = basicSalaryData.map(
      (item) => item.pay_component_id
    );
    return (
      pay_component?.data
        ?.filter((item) => !usedPayComponentIds.includes(item.id))
        .map((item) => ({
          value: item.id,
          label: item.component_name,
        })) || []
    );
  }, [pay_component, basicSalaryData]);

  // Handle employee selection
  useEffect(() => {
    const empId = watch("employee_id");
    if (empId) {
      const found = employee?.data?.find(
        (item) => Number(item.id) === Number(empId)
      );
      setSelectedEmployeeData(found || null);
    } else {
      setSelectedEmployeeData(null);
    }
  }, [watch, employee]);

  // Set basic salary data from API response
  useEffect(() => {
    if (basicSalaryDetail?.data?.basicSalarys) {
      setBasicSalaryData(
        basicSalaryDetail?.data?.basicSalarys?.map((item) => ({
          ...item,
          used_leaves: item.no_of_leaves - item.balance,
        })) || []
      );
    }
  }, [basicSalaryDetail?.data?.basicSalarys]);

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
        effective_from: initialData.effective_from || new Date().toISOString(),
        effective_to: initialData.effective_to || new Date().toISOString(),
        status: initialData.status || "Y",
        remarks: initialData.remarks || "",
      });
    } else {
      reset({
        employee_id: "",
        department_id: "",
        branch_id: "",
        position_id: "",
        pay_grade_id: "",
        pay_grade_level: "",
        allowance_group: "",
        work_life_entry: "",
        effective_from: new Date().toISOString(),
        effective_to: new Date().toISOString(),
        status: "Y",
        remarks: "",
      });
    }
  }, [mode, initialData, reset]);

  // Modal close handler
  const handleModalClose = () => {
    reset();
    setSelected(null);
    setBasicSalaryData([]);
  };

  // Add new basic salary row
  const handleAddBasicSalary = () => {
    setBasicSalaryData([...basicSalaryData, ...initialBasicSalary]);
  };

  // Handle basic salary data changes
  const handleChangeBasicSalary = (pay_component_id, field, value) => {
    const newData = basicSalaryData.map((item) => {
      if ((item.pay_component_id || value) === Number(pay_component_id)) {
        let updatedItem = { ...item };
        const payComponent = pay_component?.data?.find(
          (item) => item.id === Number(pay_component_id)
        );
        switch (field) {
          case "no_of_leaves":
            updatedItem.no_of_leaves = Number(value);
            updatedItem.balance =
              updatedItem.no_of_leaves - (updatedItem.used_leaves || 0);
            break;
          case "used_leaves":
            updatedItem.used_leaves = Number(value);
            updatedItem.balance =
              (updatedItem.no_of_leaves || 0) - updatedItem.used_leaves;
            break;
          case "balance":
            updatedItem.balance = Number(value);
            updatedItem.used_leaves =
              (updatedItem.no_of_leaves || 0) - updatedItem.balance;
            break;
          case "pay_component_id":
            updatedItem.pay_component_id = Number(value);
            updatedItem.component_name = payComponent?.component_name;
            updatedItem.component_code = payComponent?.component_code;
            updatedItem.component_type = payComponent?.component_type;
            updatedItem.amount = payComponent?.amount;
            updatedItem.auto_fill = payComponent?.auto_fill;
            updatedItem.is_taxable = payComponent?.is_taxable;
            updatedItem.is_statutory = payComponent?.is_statutory;
            updatedItem.is_recurring = payComponent?.is_recurring;
            updatedItem.is_advance = payComponent?.is_advance;
            updatedItem.is_grossable = payComponent?.is_grossable;
            updatedItem.is_overtime_related = payComponent?.is_overtime_related;
            updatedItem.is_worklife_related = payComponent?.is_worklife_related;
            updatedItem.unpaid_leave = payComponent?.unpaid_leave;
            updatedItem.contributes_to_nssf = payComponent?.contributes_to_nssf;
            updatedItem.contributes_to_paye = payComponent?.contributes_to_paye;
            updatedItem.gl_account_id = payComponent?.gl_account_id;
            updatedItem.project_id = payComponent?.project_id;
            updatedItem.tax_code_id = payComponent?.tax_code_id;
            updatedItem.payable_glaccount_id =
              payComponent?.payable_glaccount_id;
            updatedItem.factor = payComponent?.factor;
            updatedItem.execution_order = payComponent?.execution_order;
            updatedItem.formula_editable = payComponent?.formula_editable;
            updatedItem.default_formula = payComponent?.default_formula;
            updatedItem.cost_center1_id = payComponent?.cost_center1_id;
            updatedItem.cost_center2_id = payComponent?.cost_center2_id;
            updatedItem.cost_center3_id = payComponent?.cost_center3_id;
            updatedItem.cost_center4_id = payComponent?.cost_center4_id;
            updatedItem.cost_center5_id = payComponent?.cost_center5_id;
            updatedItem.column_order = payComponent?.column_order;
            break;
          default:
            updatedItem[field] = Number(value);
        }
        return updatedItem;
      }
      return item;
    });
    setBasicSalaryData(newData);
  };

  const handleDeleteBasicSalary = (pay_component_id) => {
    setBasicSalaryData(
      basicSalaryData.filter(
        (item) => item.pay_component_id !== pay_component_id
      )
    );
  };

  // Table columns configuration
  const columns = [
    {
      title: "Pay Component",
      dataIndex: "component_name",
      render: (text, record) => (
        <AntdSelect
          options={paycomponentList}
          style={{ width: "200px" }}
          value={paycomponentList.find(
            (option) => option.value === record.pay_component_id
          )}
          onChange={(value) =>
            handleChangeBasicSalary(value, "pay_component_id", value)
          }
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) => (
        <input
          type="number"
          className="form-control form-control-sm"
          style={{ width: "150px" }}
          value={text}
          onChange={(e) =>
            handleChangeBasicSalary(
              record.pay_component_id,
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
      render: (text) => text || "-",
    },
    {
      title: "Type",
      dataIndex: "component_type",
      render: (text) => text || "-",
    },
    {
      title: "Auto Fill",
      dataIndex: "auto_fill",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
    },

    {
      title: "Is Taxable?",
      dataIndex: "is_taxable",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
    },
    {
      title: "Is Statutory?",
      dataIndex: "is_statutory",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
    },
    {
      title: "Is Recurring?",
      dataIndex: "is_recurring",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
    },
    {
      title: "Is Advance?",
      dataIndex: "is_advance",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
    },
    {
      title: "Is Grossable?",
      dataIndex: "is_grossable",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
    },
    {
      title: "Is Overtime Related?",
      dataIndex: "is_overtime_related",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
    },
    {
      title: "Is Worklife Related?",
      dataIndex: "is_worklife_related",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
    },
    {
      title: "Is Unpaid Leave?",
      dataIndex: "unpaid_leave",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
    },
    {
      title: "Is Contributes to NSSF?",
      dataIndex: "contributes_to_nssf",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
    },
    {
      title: "Is Contributes to PayE?",
      dataIndex: "contributes_to_paye",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
    },
    {
      title: "GL Account",
      dataIndex: "gl_account_id",
      render: (text) => text || "-",
    },
    {
      title: "Project",
      dataIndex: "project_id",
      render: (text) => text || "-",
    },
    {
      title: "Tax Code",
      dataIndex: "tax_code_id",
      render: (text) => text || "-",
    },
    {
      title: "Payable GL Account",
      dataIndex: "payable_glaccount_id",
      render: (text) => text || "-",
    },
    {
      title: "Pay or Deduct",
      dataIndex: "pay_or_deduct",
      render: (text) => (text === "P" ? "Pay" : "Deduct") || "-",
    },
    {
      title: "Factor",
      dataIndex: "factor",
      render: (text) => text || "-",
    },
    {
      title: "Execution Order",
      dataIndex: "execution_order",
      render: (text) => text || "-",
    },
    {
      title: "Formula Editable",
      dataIndex: "formula_editable",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
    },
    {
      title: "Default Formula",
      dataIndex: "default_formula",
      render: (text) => text || "-",
    },
    {
      title: "Cost Center 1",
      dataIndex: "cost_center1_id",
      render: (text) => text?.name || "-",
    },
    {
      title: "Cost Center 2",
      dataIndex: "cost_center2_id",
      render: (text) => text?.name || "-",
    },
    {
      title: "Cost Center 3",
      dataIndex: "cost_center3_id",
      render: (text) => text?.name || "-",
    },
    {
      title: "Cost Center 4",
      dataIndex: "cost_center4_id",
      render: (text) => text?.name || "-",
    },
    {
      title: "Cost Center 5",
      dataIndex: "cost_center5_id",
      render: (text) => text?.name || "-",
    },
    {
      title: "Column Order",
      dataIndex: "column_order",
      render: (text) => text || "-",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <button
          type="button"
          className="btn btn-sm btn-danger"
          onClick={() => handleDeleteBasicSalary(record.pay_component_id)}
        >
          Delete
        </button>
      ),
    },
  ];

  // Form submission handler
  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_add_edit_basic_salary"
    );
    try {
      const submitData = {
        ...data,
        payLineData: JSON.stringify(basicSalaryData),
      };

      if (mode === "add") {
        dispatch(createBasicSalary(submitData));
      } else if (mode === "edit" && initialData) {
        dispatch(
          updateBasicSalary({
            id: initialData.id,
            reqData: submitData,
          })
        );
      }

      // reset();
      // setSelected(null);
      // closeButton?.click();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

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
          {mode === "add" ? "Add New" : "Edit"} Basic Salary
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
            <div className="col-12">
              <h6 className="mb-3 text-primary fw-semibold">
                Employee Information
              </h6>
            </div>

            <div className="col-md-6 mb-3">
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
                      setSelectedEmployeeData(option?.data || null);
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

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Department <span className="text-danger">*</span>
              </label>
              <Controller
                name="department_id"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={departmentList}
                    placeholder="Choose Department"
                    isDisabled={!departmentList.length}
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => field.onChange(option?.value || "")}
                    value={departmentList.find(
                      (option) =>
                        String(option.value) === String(watch("department_id"))
                    )}
                  />
                )}
              />
              {errors.department_id && (
                <div className="invalid-feedback d-block">
                  {errors.department_id.message}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
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

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Designation <span className="text-danger">*</span>
              </label>
              <Controller
                name="designation_id"
                control={control}
                rules={{ required: "Designation is required" }}
                render={({ field }) => {
                  const selectedDesignation = designationList?.find(
                    (designation) => designation.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      className="select"
                      options={designationList}
                      placeholder="Select Designation"
                      classNamePrefix="react-select"
                      value={selectedDesignation || null}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption.value)
                      }
                    />
                  );
                }}
              />
              {errors.designation_id && (
                <div className="invalid-feedback d-block">
                  {errors.designation_id.message}
                </div>
              )}
            </div>
          </div>

          {/* Pay Grade & Allowance Section */}
          <div className="row mb-4">
            <div className="col-12">
              <h6 className="mb-3 text-primary fw-semibold">
                Pay Grade & Allowance Information
              </h6>
            </div>

            <div className="col-md-6 mb-3">
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
                    onChange={(option) => field.onChange(option?.value || "")}
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

            <div className="col-md-6 mb-3">
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
                    onChange={(option) => field.onChange(option?.value || "")}
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

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Allowance Group <span className="text-danger">*</span>
              </label>
              <Controller
                name="allowance_group_id"
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
                    onChange={(option) => field.onChange(option?.value || "")}
                    value={allowanceGroupList.find(
                      (option) =>
                        String(option.value) ===
                        String(watch("allowance_group_id"))
                    )}
                  />
                )}
              />
              {errors.allowance_group_id && (
                <div className="invalid-feedback d-block">
                  {errors.allowance_group_id.message}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Work Life Entry <span className="text-danger">*</span>
              </label>
              <Controller
                name="work_life_entry_id"
                control={control}
                rules={{ required: "Work Life Entry is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={workLifeEntryList}
                    placeholder="Choose Work Life Entry"
                    isDisabled={!workLifeEntryList.length}
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => field.onChange(option?.value || "")}
                    value={workLifeEntryList.find(
                      (option) =>
                        String(option.value) ===
                        String(watch("work_life_entry_id"))
                    )}
                  />
                )}
              />
            </div>
          </div>

          {/* Date & Status Section */}
          <div className="row mb-4">
            <div className="col-12">
              <h6 className="mb-3 text-primary fw-semibold">
                Date & Status Information
              </h6>
            </div>

            <div className="col-md-6 mb-3">
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

            <div className="col-md-6 mb-3">
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

            <div className="col-12 mb-3">
              <label className="form-label">
                Remarks <span className="text-danger">*</span>
              </label>
              <Controller
                name="remarks"
                control={control}
                rules={{ required: "Remarks is required!" }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="form-control"
                    placeholder="Enter Remarks"
                    rows={3}
                  />
                )}
              />
              {errors.remarks && (
                <div className="invalid-feedback d-block">
                  {errors.remarks.message}
                </div>
              )}
            </div>
          </div>

          {/* Leave Management Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 text-primary fw-semibold">
                  Leave Management
                </h6>
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
