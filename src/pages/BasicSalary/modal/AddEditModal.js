import { Select as AntdSelect, Button } from "antd";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Table from "../../../components/common/dataTableNew/index";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import {
  createBasicSalary,
  fetchBasicSalaryById,
  updateBasicSalary,
} from "../../../redux/BasicSalary";
import { fetchbranch } from "../../../redux/branch";
import { fetchCurrencies } from "../../../redux/currency";
import { fetchdepartment } from "../../../redux/department";
import { fetchdesignation } from "../../../redux/designation";
import {
  componentOptionsFn,
  fetchpay_component,
} from "../../../redux/pay-component";
import { fetchWorkLifeEventLog } from "../../../redux/WorkLifeEventLog";
import DeleteAlert from "../alert/DeleteAlert";

export const allowanceGroupList = [
  { value: "1", label: "Standard Allowance" },
  { value: "2", label: "Executive Allowance" },
  { value: "3", label: "Managerial Allowance" },
  { value: "4", label: "Field Staff Allowance" },
  { value: "5", label: "Housing Allowance" },
  { value: "6", label: "Technical Staff Allowance" },
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

const AddEditModal = ({
  mode = "add",
  initialData = null,
  setSelected,
  employee_id = "",
  department_id = "",
  position_id = "",
}) => {
  const initialComponent = [
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
      cost_center1_name: "",
      cost_center2_name: "",
      cost_center3_name: "",
      cost_center4_name: "",
      cost_center5_name: "",
      project_name: "",
      tax_code_name: "",
      column_order: "",
    },
  ];
  const [basicSalaryData, setBasicSalaryData] = useState(initialComponent);
  const [employeeData, setEmployeeData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const dispatch = useDispatch();

  const { department } = useSelector((state) => state.department);
  const { branch } = useSelector((state) => state.branch);
  const { designation } = useSelector((state) => state.designation);
  const { basicSalaryDetail, loading } = useSelector(
    (state) => state.basicSalary
  );
  const { workLifeEventLog } = useSelector((state) => state.workLifeEventLog);
  const { componentOptions } = useSelector((state) => state.payComponent);

  useEffect(() => {
    dispatch(componentOptionsFn({ is_advance: false }));
  }, [dispatch]);

  const { currencies } = useSelector((state) => state.currencies);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm();

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
      componentOptions
        ?.filter((item) => !usedPayComponentIds.includes(item.id))
        .map((item) => ({
          value: item.id,
          label: item.component_name,
        })) || []
    );
  }, [componentOptions, basicSalaryData]);

  useEffect(() => {
    dispatch(fetchdepartment({ is_active: true }));
    dispatch(fetchbranch({ is_active: true }));
    dispatch(fetchdesignation({ is_active: true }));
    dispatch(fetchpay_component({ is_active: true }));
    dispatch(fetchWorkLifeEventLog({ is_active: true }));
    dispatch(fetchCurrencies({ is_active: true }));
  }, []);

  useEffect(() => {
    if (mode === "edit" && initialData?.id) {
      dispatch(fetchBasicSalaryById(initialData.id));
    }
  }, [mode, initialData?.id, dispatch]);

  const assignmentLine =
    basicSalaryDetail?.hrms_d_employee_pay_component_assignment_line;

  const components = useMemo(() => {
    return componentOptions
      ?.filter((item) => item.auto_fill === "Y")
      .map((item) => ({
        ...item,
        pay_component_id: item.id,
        cost_center1_name: item.pay_component_cost_center1?.name || "",
        cost_center2_name: item.pay_component_cost_center2?.name || "",
        cost_center3_name: item.pay_component_cost_center3?.name || "",
        cost_center4_name: item.pay_component_cost_center4?.name || "",
        cost_center5_name: item.pay_component_cost_center5?.name || "",
        project_name: item.pay_component_project?.name || "",
        tax_code_name: item.pay_component_tax?.rule_type || "",
        component_type: "O",
      }));
  }, [componentOptions]);

  useEffect(() => {
    if (mode === "edit" && assignmentLine) {
      const data = assignmentLine?.map((item) => ({
        ...item,
        pay_component_id: item.pay_component_id,
        cost_center1_name: item.pay_component_line_cost_center1?.name,
        cost_center2_name: item.pay_component_line_cost_center2?.name,
        cost_center3_name: item.pay_component_line_cost_center3?.name,
        cost_center4_name: item.pay_component_line_cost_center4?.name,
        cost_center5_name: item.pay_component_line_cost_center5?.name,
        project_name: item.pay_component_line_project?.name,
        tax_code_name: item.pay_component_line_tax_slab?.rule_type,
        component_type: "O",
      }));
      setBasicSalaryData(data || initialComponent);
    } else if (mode === "add") {
      setBasicSalaryData(components || initialComponent);
    }
  }, [mode, assignmentLine, components]);

  useEffect(() => {
    reset({
      employee_id: employee_id || initialData?.employee_id || "",
      branch_id: initialData?.branch_id || "",
      position_id: position_id || initialData?.position_id || "",
      department_id: department_id || initialData?.department_id || "",
      pay_grade_id: initialData?.pay_grade_id || "",
      pay_grade_level: initialData?.pay_grade_level || "",
      allowance_group: initialData?.allowance_group || "",
      work_life_entry: initialData?.work_life_entry || "",
      effective_from: initialData?.effective_from || new Date().toISOString(),
      effective_to: initialData?.effective_to || new Date().toISOString(),
      status: initialData?.status || "Active",
      remarks: initialData?.remarks || "",
    });
    setBasicSalaryData(initialComponent);
  }, [initialData, reset, employee_id, department_id, position_id]);

  const handleModalClose = useCallback(() => {
    reset();
    setSelected(null);
    setBasicSalaryData(initialComponent);
    setEmployeeData(null);
  }, [reset, setSelected]);

  const handleAddBasicSalary = useCallback(() => {
    setBasicSalaryData((prev) => [...prev, ...initialComponent]);
  }, []);

  const handleChangeBasicSalary = useCallback(
    (identifier, field, value) => {
      setBasicSalaryData((prevData) => {
        return prevData.map((item, index) => {
          const shouldUpdate = item.pay_component_id
            ? item.pay_component_id === Number(identifier)
            : index === identifier;

          if (shouldUpdate) {
            let updatedItem = { ...item };
            const payComponent = componentOptions?.find(
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
                  updatedItem.component_type = "O";
                  updatedItem.amount = payComponent.amount || 0;
                  updatedItem.auto_fill = payComponent.auto_fill;
                  updatedItem.is_taxable = payComponent.is_taxable;
                  updatedItem.is_statutory = payComponent.is_statutory;
                  updatedItem.is_recurring = payComponent.is_recurring;
                  updatedItem.is_advance = payComponent.is_advance;
                  updatedItem.is_grossable = payComponent.is_grossable;
                  updatedItem.type_value = payComponent.type_value;
                  updatedItem.is_overtime_related =
                    payComponent.is_overtime_related;
                  updatedItem.is_worklife_related =
                    payComponent.is_worklife_related;
                  updatedItem.unpaid_leave = payComponent.unpaid_leave;
                  updatedItem.contributes_to_nssf =
                    payComponent.contributes_to_nssf;
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
                  updatedItem.cost_center1_name =
                    payComponent.pay_component_cost_center1?.name;
                  updatedItem.cost_center2_name =
                    payComponent.pay_component_cost_center2?.name;
                  updatedItem.cost_center3_name =
                    payComponent.pay_component_cost_center3?.name;
                  updatedItem.cost_center4_name =
                    payComponent.pay_component_cost_center4?.name;
                  updatedItem.cost_center5_name =
                    payComponent.pay_component_cost_center5?.name;
                  updatedItem.project_name =
                    payComponent.pay_component_project?.name;
                  updatedItem.tax_code_name =
                    payComponent.pay_component_tax?.name;
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
    [componentOptions]
  );

  const handleDeleteBasicSalary = useCallback(() => {
    setBasicSalaryData((prev) =>
      prev.filter((item, index) =>
        item.pay_component_id
          ? item.pay_component_id !== showDeleteModal
          : index !== showDeleteModal
      )
    );
    setShowDeleteModal(null);
    toast.success("Pay Component deleted successfully");
  }, [showDeleteModal]);

  const columns = useMemo(
    () => [
      {
        title: "Pay Component",
        dataIndex: "component_name",
        key: "component_name",
        render: (_, record, index) => (
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
            style={{ width: "250px" }}
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
        width: "250px",
      },
      {
        title: "Currency",
        dataIndex: "currency_id",
        key: "currency_id",
        render: (_, record, index) => (
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
        render: (_, record, index) => (
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
      // {
      //   title: "Code",
      //   dataIndex: "component_code",
      //   key: "component_code",
      //   render: (text) => text || "-",
      // },

      {
        title: "Taxable",
        dataIndex: "is_taxable",
        key: "is_taxable",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      // {
      //   title: "Is Statutory?",
      //   dataIndex: "is_statutory",
      //   key: "is_statutory",
      //   render: (text) => (text === "Y" ? "Yes" : "No"),
      // },
      // {
      //   title: "Is Recurring?",
      //   dataIndex: "is_recurring",
      //   key: "is_recurring",
      //   render: (text) => (text === "Y" ? "Yes" : "No"),
      // },
      // {
      //   title: "Is Advance?",
      //   dataIndex: "is_advance",
      //   key: "is_advance",
      //   render: (text) => (text === "Y" ? "Yes" : "No"),
      // },
      {
        title: "Grossable",
        dataIndex: "is_grossable",
        key: "is_grossable",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      // {
      //   title: "Is Overtime Related?",
      //   dataIndex: "is_overtime_related",
      //   key: "is_overtime_related",
      //   render: (text) => (text === "Y" ? "Yes" : "No"),
      // },
      {
        title: "Type",
        dataIndex: "component_type",
        key: "component_type",
        render: (text) => text || "-",
      },
      {
        title: "Type Value",
        dataIndex: "type_value",
        key: "type_value",
        render: (text) => text || "-",
      },
      // {
      //   title: "Is Worklife Related?",
      //   dataIndex: "is_worklife_related",
      //   key: "is_worklife_related",
      //   render: (text) => (text === "Y" ? "Yes" : "No"),
      // },
      // {
      //   title: "Is Unpaid Leave?",
      //   dataIndex: "unpaid_leave",
      //   key: "unpaid_leave",
      //   render: (text) => (text === "Y" ? "Yes" : "No"),
      // },
      {
        title: "NSSF",
        dataIndex: "contributes_to_nssf",
        key: "contributes_to_nssf",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      // {
      //   title: "Is Contributes to PayE?",
      //   dataIndex: "contributes_to_paye",
      //   key: "contributes_to_paye",
      //   render: (text) => (text === "Y" ? "Yes" : "No"),
      // },
      {
        title: "GL Account",
        dataIndex: "gl_account_id",
        key: "gl_account_id",
        render: (text) => text || "-",
      },
      {
        title: "Payable GL Account",
        dataIndex: "payable_glaccount_id",
        key: "payable_glaccount_id",
        render: (text) => text || "-",
      },
      {
        title: "Project",
        dataIndex: "project_name",
        key: "project_name",
        render: (text) => text || "-",
      },
      {
        title: "Tax Code",
        dataIndex: "tax_code_name",
        key: "tax_code_name",
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
        title: "Cost Center 1",
        dataIndex: "cost_center1_name",
        key: "cost_center1_name",
        render: (text) => text || "-",
      },
      {
        title: "Cost Center 2",
        dataIndex: "cost_center2_name",
        key: "cost_center2_name",
        render: (text) => text || "-",
      },
      {
        title: "Cost Center 3",
        dataIndex: "cost_center3_name",
        key: "cost_center3_name",
        render: (text) => text || "-",
      },
      {
        title: "Cost Center 4",
        dataIndex: "cost_center4_name",
        key: "cost_center4_name",
        render: (text) => text || "-",
      },
      {
        title: "Cost Center 5",
        dataIndex: "cost_center5_name",
        key: "cost_center5_name",
        render: (text) => text || "-",
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (_, record, index) => (
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => {
              setShowDeleteModal(record.pay_component_id || index);
            }}
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

  const onSubmit = useCallback(
    (data) => {
      const closeButton = document.getElementById(
        "close_btn_add_edit_basic_salary"
      );

      try {
        const submitData = {
          ...data,
          payLineData: JSON.stringify(
            basicSalaryData.filter((item) => item.pay_component_id)
          ),
        };
        console.log("submitData", submitData);

        if (!initialData) {
          console.log("hello");
          dispatch(createBasicSalary(submitData));
        } else if (initialData) {
          console.log("hii");
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
        console.log("Form submission error:", error);
      }
    },
    [basicSalaryData, dispatch, initialData, mode, handleModalClose]
  );

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
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">
          {!initialData ? "Add" : "Edit"} Component Assignment
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

      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row mb-4">
            {!employee_id && (
              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Employee <span className="text-danger">*</span>
                </label>
                <Controller
                  name="employee_id"
                  control={control}
                  rules={{ required: "Employee is required" }}
                  render={({ field }) => (
                    <EmployeeSelect
                      {...field}
                      value={field.value}
                      onChange={(i) => {
                        field.onChange(i?.value);
                        setEmployeeData(i?.meta);
                      }}
                    />
                  )}
                />
                {errors.employee_id && (
                  <div className="invalid-feedback d-block">
                    {errors.employee_id.message}
                  </div>
                )}
              </div>
            )}

            <div className="col-md-4 mb-3">
              <label className="form-label">Department</label>
              <Controller
                name="department_id"
                control={control}
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
                        option.value ===
                        (department_id || employeeData?.department_id)
                    )}
                  />
                )}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Position</label>
              <Controller
                name="position_id"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      {...field}
                      className="select"
                      options={designationList}
                      placeholder="Select Position"
                      isDisabled={true}
                      classNamePrefix="react-select"
                      value={designationList.find(
                        (option) =>
                          Number(option.value) ===
                          Number(position_id || employeeData?.designation_id)
                      )}
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
              {errors.work_life_entry && (
                <div className="invalid-feedback d-block">
                  {errors.work_life_entry.message}
                </div>
              )}
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
                    value={
                      statusList.find(
                        (option) => String(option.value) === String(field.va)
                      )?.label
                    }
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
              {!initialData ? "Create" : "Update"}
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
      <DeleteAlert
        showModal={showDeleteModal !== null}
        setShowModal={setShowDeleteModal}
        onDelete={handleDeleteBasicSalary}
        label="Pay Component"
      />

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
