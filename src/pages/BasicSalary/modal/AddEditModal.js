import { Select as AntdSelect, Button } from "antd";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Table from "../../../components/common/dataTableNew";
import DepartmentSelect from "../../../components/common/DepartmentSelect";
import DesignationSelect from "../../../components/common/DesignationSelect";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import {
  createBasicSalary,
  fetchBasicSalaryById,
  updateBasicSalary,
} from "../../../redux/BasicSalary";
import { fetchbranch } from "../../../redux/branch";
import { fetchCurrencies } from "../../../redux/currency";
import {
  componentOptionsFn,
  fetchpay_component,
} from "../../../redux/pay-component";
import { fetchWorkLifeEventLog } from "../../../redux/WorkLifeEventLog";
import DeleteAlert from "../alert/DeleteAlert";
import {
  allowanceGroupList,
  payGradeLevelList,
  payGradeList,
} from "../../../mock/componentAssignment";
import { LogarithmicScale } from "chart.js";

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

const AddEditModal = ({
  mode = "add",
  initialData = null,
  setSelected,
  employee_id = "",
  department_id = "",
  position_id = "",
  setMode,
}) => {
  const [basicSalaryData, setBasicSalaryData] = useState([]);
  const [employeeData, setEmployeeData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const dispatch = useDispatch();

  const { branch } = useSelector((state) => state.branch);
  const { basicSalaryDetail, loading } = useSelector(
    (state) => state.basicSalary
  );
  const { workLifeEventLog } = useSelector((state) => state.workLifeEventLog);
  const { componentOptions } = useSelector((state) => state.payComponent);
  const { currencies } = useSelector((state) => state.currencies);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm();

  // Memoized lists
  const currencyList = useMemo(
    () =>
      currencies?.data?.map((item) => ({
        value: item.id,
        label: `${item.currency_name} (${item.currency_code})`,
      })) || [],
    [currencies]
  );
  const branchList = useMemo(
    () =>
      branch?.data?.map((item) => ({
        value: item.id,
        label: item.branch_name,
      })) || [],
    [branch]
  );
  const statusList = useMemo(
    () => [
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
    ],
    []
  );
  const workLifeEventLogList = useMemo(
    () =>
      workLifeEventLog?.data?.map((item) => ({
        value: item.id,
        label: item?.work_life_event_type?.event_type_name,
      })) || [],
    [workLifeEventLog]
  );
  const paycomponentList = useMemo(() => {
    const usedIds = basicSalaryData
      .filter((i) => i.pay_component_id)
      .map((i) => i.pay_component_id);
    return (
      componentOptions
        ?.filter((i) => !usedIds.includes(i.id))
        .map((i) => ({
          value: i.id,
          label: i.component_name,
        })) || []
    );
  }, [componentOptions, basicSalaryData]);

  // Fetch all required data on mount
  useEffect(() => {
    dispatch(componentOptionsFn({ is_advance: false }));
    dispatch(fetchbranch({ is_active: true }));
    dispatch(fetchpay_component({ is_active: true }));
    dispatch(fetchWorkLifeEventLog({ is_active: true }));
    dispatch(fetchCurrencies({ is_active: true }));
  }, [dispatch]);

  // Fetch salary detail for edit
  useEffect(() => {
    if (mode === "edit" && initialData?.id) {
      dispatch(fetchBasicSalaryById(initialData.id));
    }
  }, [mode, initialData?.id, dispatch]);

  // Set up form and salary data on initialData change
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
  }, [initialData, reset]);

  useEffect(() => {
    if (initialData) {
      setEmployeeData({
        designation_id: initialData?.position_id,
        department_id: initialData?.department_id,
      });
    }
  }, [initialData]);

  // Set salary data for edit/add
  useEffect(() => {
    const assignmentLine =
      basicSalaryDetail?.hrms_d_employee_pay_component_assignment_line;
    if (mode === "edit" && assignmentLine) {
      setBasicSalaryData(
        assignmentLine.map((item) => ({
          ...item,
          cost_center1_name: item.pay_component_line_cost_center1?.name,
          cost_center2_name: item.pay_component_line_cost_center2?.name,
          cost_center3_name: item.pay_component_line_cost_center3?.name,
          cost_center4_name: item.pay_component_line_cost_center4?.name,
          cost_center5_name: item.pay_component_line_cost_center5?.name,
          project_name: item.pay_component_line_project?.name,
          tax_code_name: item.pay_component_line_tax_slab?.rule_type,
          component_name: item.pay_component_for_line?.component_name,
          pay_or_deduct: item.pay_component_for_line?.pay_or_deduct,
          component_type:
            typeof item?.component_type === "string"
              ? item?.component_type?.slice(0, 1)
              : "O",
        })) || initialComponent
      );
    } else if (mode === "add") {
      const components = componentOptions
        ?.filter((i) => i.auto_fill === "Y")
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
          component_type:
            typeof item?.component_type === "string"
              ? item?.component_type?.slice(0, 1)
              : "O",
        }));
      setBasicSalaryData(
        components?.length > 0 ? components : initialComponent
      );
    }
  }, [mode, basicSalaryDetail, componentOptions]);

  console.log(basicSalaryData);

  // Modal close handler
  const handleModalClose = useCallback(() => {
    reset();
    setMode("");
    setSelected?.(null);
    setBasicSalaryData(initialComponent);
    setEmployeeData(null);
  }, [reset, setSelected]);

  // Add new row
  const handleAddBasicSalary = useCallback(() => {
    setBasicSalaryData((prev) => [...prev, { ...initialComponent[0] }]);
  }, []);

  // Change handler for table fields
  const handleChangeBasicSalary = useCallback(
    (identifier, field, value) => {
      setBasicSalaryData((prevData) =>
        prevData.map((item, idx) => {
          const match = item.pay_component_id
            ? item.pay_component_id === Number(identifier)
            : idx === identifier;
          if (!match) return item;
          let updated = { ...item };
          if (
            field === "amount" ||
            field === "currency_id" ||
            field === "pay_component_id"
          ) {
            updated[field] = Number(value);
          } else {
            updated[field] = value;
          }
          if (field === "pay_component_id") {
            const comp = componentOptions?.find((c) => c.id === Number(value));
            if (comp) {
              Object.assign(updated, {
                component_name: comp.component_name,
                component_code: comp.component_code,
                component_type:
                  typeof comp.component_type === "string"
                    ? comp.component_type
                    : "O",
                amount: comp.amount || 0,
                auto_fill: comp.auto_fill,
                is_taxable: comp.is_taxable,
                is_statutory: comp.is_statutory,
                is_recurring: comp.is_recurring,
                is_advance: comp.is_advance,
                is_grossable: comp.is_grossable,
                type_value: comp.type_value,
                is_overtime_related: comp.is_overtime_related,
                is_worklife_related: comp.is_worklife_related,
                unpaid_leave: comp.unpaid_leave,
                contributes_to_nssf: comp.contributes_to_nssf,
                contributes_to_paye: comp.contributes_to_paye,
                gl_account_id: comp.gl_account_id,
                project_id: comp.project_id,
                tax_code_id: comp.tax_code_id,
                payable_glaccount_id: comp.payable_glaccount_id,
                factor: comp.factor,
                execution_order: comp.execution_order,
                formula_editable: comp.formula_editable,
                default_formula: comp.default_formula,
                cost_center1_id: comp.cost_center1_id,
                cost_center2_id: comp.cost_center2_id,
                cost_center3_id: comp.cost_center3_id,
                cost_center4_id: comp.cost_center4_id,
                cost_center5_id: comp.cost_center5_id,
                cost_center1_name: comp.pay_component_cost_center1?.name,
                cost_center2_name: comp.pay_component_cost_center2?.name,
                cost_center3_name: comp.pay_component_cost_center3?.name,
                cost_center4_name: comp.pay_component_cost_center4?.name,
                cost_center5_name: comp.pay_component_cost_center5?.name,
                project_name: comp.pay_component_project?.name,
                tax_code_name: comp.pay_component_tax?.name,
                column_order: comp.column_order,
                pay_or_deduct: comp?.pay_or_deduct,
              });
            }
          }
          return updated;
        })
      );
    },
    [componentOptions]
  );

  // Delete row
  const handleDeleteBasicSalary = useCallback(() => {
    setBasicSalaryData((prev) =>
      prev.filter((item, idx) =>
        item.pay_component_id
          ? item.pay_component_id !== showDeleteModal
          : idx !== showDeleteModal
      )
    );
    setShowDeleteModal(null);
    toast.success("Pay Component deleted successfully");
  }, [showDeleteModal]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        title: "Pay Component",
        dataIndex: "component_name",
        key: "component_name",
        render: (_, record, idx) => (
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
            style={{ width: 250 }}
            value={
              record.pay_component_id
                ? {
                    value: record.pay_component_id,
                    label: record.component_name,
                  }
                : undefined
            }
            placeholder="Select Component"
            onChange={(val) =>
              handleChangeBasicSalary(
                record.pay_component_id || idx,
                "pay_component_id",
                val
              )
            }
          />
        ),
        width: 250,
      },
      {
        title: "Currency",
        dataIndex: "currency_id",
        key: "currency_id",
        render: (_, record, idx) => (
          <AntdSelect
            options={currencyList}
            style={{ width: 200 }}
            value={record.currency_id || undefined}
            placeholder="Select Currency"
            onChange={(val) =>
              handleChangeBasicSalary(
                record.pay_component_id || idx,
                "currency_id",
                val
              )
            }
          />
        ),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: (_, record, idx) => (
          <input
            type="number"
            className="form-control form-control-sm"
            style={{ width: 150 }}
            placeholder="0.00"
            value={record.amount || ""}
            onChange={(e) =>
              handleChangeBasicSalary(
                record.pay_component_id || idx,
                "amount",
                e.target.value
              )
            }
          />
        ),
      },
      {
        title: "Taxable",
        dataIndex: "is_taxable",
        key: "is_taxable",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "Grossable",
        dataIndex: "is_grossable",
        key: "is_grossable",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
      {
        title: "Type",
        dataIndex: "component_type",
        key: "component_type",
        render: (text) =>
          text?.slice(0, 1) === "E"
            ? "EARNING"
            : text?.slice(0, 1) === "D"
              ? "DEDUCTION"
              : text?.slice(0, 1) === "A"
                ? "ALLOWANCE"
                : text?.slice(0, 1) === "B"
                  ? "BONUS"
                  : text?.slice(0, 1) === "O"
                    ? "OVERTIME"
                    : "-",
      },
      {
        title: "Type Value",
        dataIndex: "type_value",
        key: "type_value",
        render: (text) => text || "-",
      },
      {
        title: "NSSF",
        dataIndex: "contributes_to_nssf",
        key: "contributes_to_nssf",
        render: (text) => (text === "Y" ? "Yes" : "No"),
      },
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
        render: (text) =>
          text === "P" ? "Pay" : text === "D" ? "Deduct" : "-",
      },
      {
        title: "Factor",
        dataIndex: "factor",
        key: "factor",
        render: (text) => text || "-",
      },
      ...[1, 2, 3, 4, 5].map((n) => ({
        title: `Cost Center ${n}`,
        dataIndex: `cost_center${n}_name`,
        key: `cost_center${n}_name`,
        render: (text) => text || "-",
      })),
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render: (_, record, idx) => (
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => setShowDeleteModal(record.pay_component_id || idx)}
          >
            Delete
          </button>
        ),
      },
    ],
    [paycomponentList, currencyList, handleChangeBasicSalary]
  );

  // Form submit
  const onSubmit = useCallback(
    async (data) => {
      if (basicSalaryData.length === 0) {
        toast.error("Please add at least one pay component");
        return;
      }

      if (basicSalaryData.every((i) => !i.pay_component_id)) {
        toast.error("Please select a pay component");
        return;
      }

      if (basicSalaryData.every((i) => !i.currency_id)) {
        toast.error("Please select a currency");
        return;
      }

      if (basicSalaryData.every((i) => !i.amount)) {
        toast.error("Please enter an amount");
        return;
      }

      const closeBtn = document.getElementById(
        "close_btn_add_edit_basic_salary"
      );
      try {
        const submitData = {
          ...data,
          payLineData: JSON.stringify(
            basicSalaryData.filter((i) => i.pay_component_id)
          ),
          department_id:
            employeeData?.department_id ||
            department_id ||
            initialData?.department_id,
          position_id:
            employeeData?.designation_id ||
            position_id ||
            initialData?.position_id,
        };
        let result;
        if (!initialData) {
          result = await dispatch(createBasicSalary(submitData));
        } else {
          result = await dispatch(
            updateBasicSalary({
              id: initialData.id,
              basicSalaryData: submitData,
            })
          );
        }
        if (result?.meta?.requestStatus === "fulfilled") {
          closeBtn?.click();
          handleModalClose();
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
    [basicSalaryData, dispatch, initialData, handleModalClose]
  );

  // Offcanvas close event
  useEffect(() => {
    const el = document.getElementById("offcanvas_add_edit_basic_salary");
    if (!el) return;
    const handler = handleModalClose;
    el.addEventListener("hidden.bs.offcanvas", handler);
    return () => el.removeEventListener("hidden.bs.offcanvas", handler);
  }, [handleModalClose]);

  console.log(initialData?.position_id, "mkx");

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
                  <DepartmentSelect
                    {...field}
                    isDisabled
                    value={Number(
                      employeeData?.department_id ||
                        initialData?.department_id ||
                        department_id
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
                render={({ field }) => (
                  <DesignationSelect
                    {...field}
                    isDisabled
                    value={Number(
                      employeeData?.designation_id ||
                        initialData?.position_id ||
                        position_id
                    )}
                  />
                )}
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
                    options={[
                      { value: "", label: "-- Select --" },
                      ...branchList,
                    ]}
                    placeholder="-- Select --"
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
                    placeholder="-- Select --"
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
                    placeholder="-- Select --"
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
                    placeholder="-- Select --"
                    isDisabled={!allowanceGroupList.length}
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => field.onChange(option?.value || "")}
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
                    options={[
                      { value: "", label: "-- Select --" },
                      ...workLifeEventLogList,
                    ]}
                    placeholder="-- Select --"
                    isDisabled={!workLifeEventLogList.length}
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => field.onChange(option?.value || "")}
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
            {/* <div className="col-md-4 mb-3">
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
                    value={
                      field.value
                        ? moment(field.value).format("DD-MM-YYYY")
                        : null
                    }
                    onChange={field.onChange}
                    minDate={
                      watch("effective_from")
                        ? new Date(watch("effective_from"))
                        : null
                    }
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
                    value={
                      field.value
                        ? moment(field.value).format("DD-MM-YYYY")
                        : null
                    }
                    onChange={field.onChange}
                    minDate={
                      watch("effective_from")
                        ? new Date(watch("effective_from"))
                        : null
                    }
                  />
                )}
              />
              {errors.effective_to && (
                <div className="invalid-feedback d-block">
                  {errors.effective_to.message}
                </div>
              )}
            </div> */}
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
                    onChange={(option) => field.onChange(option?.value || "")}
                    value={
                      statusList.find(
                        (option) => String(option.value) === String(field.value)
                      ) || null
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
                dataSource={basicSalaryData}
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
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        .custom-table .ant-table-cell { padding: 8px 12px !important; }
        .custom-table .ant-table-thead > tr > th { background-color: #f8f9fa; font-weight: 600; }
        .react-select__control { min-height: 38px; border-color: #ced4da; }
        .react-select__control:hover { border-color: #86b7fe; }
        .react-select__control--is-focused {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
};

export default AddEditModal;
