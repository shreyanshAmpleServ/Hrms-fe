import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  addpay_component,
  updatepay_component,
} from "../../../../../redux/pay-component";
import { fetchProjects } from "../../../../../redux/projects";
import { fetchTaxSlab } from "../../../../../redux/taxSlab";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.payComponent);

  const { taxSlab } = useSelector((state) => state.taxSlab);

  const { projects } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchTaxSlab());
    dispatch(fetchProjects());
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  const dispatch = useDispatch();

  const componentTypeOptions = [
    { value: "EARNING", label: "Earning" },
    { value: "DEDUCTION", label: "Deduction" },
    { value: "ALLOWANCE", label: "Allowance" },
    { value: "BONUS", label: "Bonus" },
    { value: "OVERTIME", label: "Overtime" },
  ];

  const payOrDeductOptions = [
    { value: "P", label: "Pay" },
    { value: "D", label: "Deduct" },
  ];

  const projectOptions = projects?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));

  const taxSlabOptions = taxSlab?.map((item) => ({
    value: item?.id,
    label: item?.rule_type,
  }));

  useEffect(() => {
    reset({
      auto_fill: initialData?.auto_fill || "N",
      column_order: initialData?.column_order || "",
      component_code: initialData?.component_code || "",
      component_name: initialData?.component_name || "",
      component_type: initialData?.component_type || "",
      contributes_to_nssf: initialData?.contributes_to_nssf || "",
      contributes_to_paye: initialData?.contributes_to_paye || "",
      default_formula: initialData?.default_formula || "",
      execution_order: initialData?.execution_order || "",
      factor: initialData?.factor || "",
      formula_editable: initialData?.formula_editable || "",
      gl_account_id: initialData?.gl_account_id || "",
      is_advance: initialData?.is_advance || "N",
      is_grossable: initialData?.is_grossable || "N",
      is_overtime_related: initialData?.is_overtime_related || "N",
      is_recurring: initialData?.is_recurring || "N",
      is_statutory: initialData?.is_statutory || "N",
      is_taxable: initialData?.is_taxable || "N",
      is_worklife_related: initialData?.is_worklife_related || "N",
      is_active: initialData?.is_active || "Y",
      pay_or_deduct: initialData?.pay_or_deduct || "P",
      payable_glaccount_id: initialData?.payable_glaccount_id || "",
      project_id: initialData?.project_id || "",
      tax_code_id: initialData?.tax_code_id || "",
      unpaid_leave: initialData?.unpaid_leave || "N",
      visible_in_payslip: initialData?.visible_in_payslip || "N",
    });
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("Close_pay_component_modal");
    if (mode === "add") {
      dispatch(addpay_component(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updatepay_component({ id: initialData?.id, pay_componentData: data })
      );
    }
    reset();
    setSelected(null);
    closeButton?.click();
  };

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      id="offcanvas_add"
      role="dialog"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="modal-title">
          {mode === "add" ? "Add Pay Component" : "Edit Pay Component"}
        </h5>
        <button
          className="btn-close custom-btn-close border p-1 me-0 text-dark"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          id="Close_pay_component_modal"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="col-form-label">
                Component Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.component_name ? "is-invalid" : ""}`}
                placeholder="Enter Component Name"
                {...register("component_name", {
                  required: "Component name is required.",
                  minLength: {
                    value: 3,
                    message: "Component name must be at least 3 characters.",
                  },
                })}
              />
              {errors.component_name && (
                <small className="text-danger">
                  {errors.component_name.message}
                </small>
              )}
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Component Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.component_code ? "is-invalid" : ""}`}
                  placeholder="Enter Component Code"
                  {...register("component_code", {
                    required: "Component code is required.",
                    minLength: {
                      value: 3,
                      message: "Component code must be at least 3 characters.",
                    },
                  })}
                />
                {errors.component_code && (
                  <small className="text-danger">
                    {errors.component_code.message}
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Component Type <span className="text-danger">*</span>
                </label>
                <Controller
                  name="component_type"
                  control={control}
                  rules={{ required: "Component type is required." }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={componentTypeOptions}
                      placeholder="Select Component Type"
                      value={
                        componentTypeOptions.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || "")
                      }
                    />
                  )}
                />
                {errors.component_type && (
                  <small className="text-danger">
                    {errors.component_type.message}
                  </small>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Pay or Deduct</label>
                <Controller
                  name="pay_or_deduct"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={payOrDeductOptions}
                      placeholder="Select Pay or Deduct"
                      value={
                        payOrDeductOptions.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || "")
                      }
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">GL Account</label>
                <Controller
                  name="gl_account_id"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="form-control"
                      {...field}
                      placeholder="Enter GL Account"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Payable GL Account</label>
                <Controller
                  name="payable_glaccount_id"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      className="form-control"
                      {...field}
                      placeholder="Enter Payable GL Account"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Tax Code</label>
                <Controller
                  name="tax_code_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={taxSlabOptions}
                      placeholder="Select Tax Code"
                      value={
                        taxSlabOptions?.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || "")
                      }
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Project</label>
                <Controller
                  name="project_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={projectOptions}
                      placeholder="Select Project"
                      value={
                        projectOptions?.find(
                          (option) => option.value === field.value
                        ) || null
                      }
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || "")
                      }
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Execution Order</label>
                <input
                  type="number"
                  className={`form-control ${errors.execution_order ? "is-invalid" : ""}`}
                  placeholder="Enter Execution Order"
                  {...register("execution_order", {
                    min: {
                      value: 1,
                      message: "Execution order must be at least 1.",
                    },
                  })}
                />
                {errors.execution_order && (
                  <small className="text-danger">
                    {errors.execution_order.message}
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Column Order</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Column Order"
                  {...register("column_order")}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Factor</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  placeholder="Enter Factor"
                  {...register("factor")}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Default Formula</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Default Formula"
                  {...register("default_formula")}
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3 form-check form-switch">
                <label className="col-form-label">Is Taxable</label>
                <Controller
                  name="is_taxable"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="form-check-input"
                      value={field.value === "Y" ? true : false}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "Y" : "N")
                      }
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3 form-check form-switch">
                <label className="col-form-label">Is Statutory</label>
                <Controller
                  name="is_statutory"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="form-check-input"
                      value={field.value === "Y" ? true : false}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "Y" : "N")
                      }
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3 form-check form-switch">
                <label className="col-form-label">Is Recurring</label>
                <Controller
                  name="is_recurring"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="form-check-input"
                      value={field.value === "Y" ? true : false}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "Y" : "N")
                      }
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3 form-check form-switch">
                <label className="col-form-label">Is Advance</label>
                <Controller
                  name="is_advance"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="form-check-input"
                      value={field.value === "Y" ? true : false}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "Y" : "N")
                      }
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3 form-check form-switch">
                <label className="col-form-label">Is Grossable</label>
                <Controller
                  name="is_grossable"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="form-check-input"
                      value={field.value === "Y" ? true : false}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "Y" : "N")
                      }
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3 form-check form-switch">
                <label className="col-form-label">Is Overtime Related</label>
                <Controller
                  name="is_overtime_related"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="form-check-input"
                      value={field.value === "Y" ? true : false}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "Y" : "N")
                      }
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3 form-check form-switch">
                <label className="col-form-label">Is Worklife Related</label>
                <Controller
                  name="is_worklife_related"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="form-check-input"
                      value={field.value === "Y" ? true : false}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "Y" : "N")
                      }
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3 form-check form-switch">
                <label className="col-form-label">Is Unpaid Leave</label>
                <Controller
                  name="unpaid_leave"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="form-check-input"
                      value={field.value === "Y" ? true : false}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "Y" : "N")
                      }
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3 form-check form-switch">
                <label className="col-form-label">Contributes to NSSF</label>
                <Controller
                  name="contributes_to_nssf"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="form-check-input"
                      value={field.value === "Y" ? true : false}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "Y" : "N")
                      }
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3 form-check form-switch">
                <label className="col-form-label">Contributes to PAYE</label>
                <Controller
                  name="contributes_to_paye"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="form-check-input"
                      value={field.value === "Y" ? true : false}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "Y" : "N")
                      }
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3 form-check form-switch">
                <label className="col-form-label">Formula Editable</label>
                <Controller
                  name="formula_editable  "
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="form-check-input"
                      value={field.value === "Y" ? true : false}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "Y" : "N")
                      }
                    />
                  )}
                />
              </div>
            </div>

            <div className="col-md-4">
              <div className="mb-3 form-check form-switch">
                <label className="col-form-label">Visible in Payslip</label>
                <Controller
                  name="visible_in_payslip"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="form-check-input"
                      value={field.value === "Y" ? true : false}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "Y" : "N")
                      }
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3 form-check form-switch">
                <label className="col-form-label">Auto Fill</label>
                <Controller
                  name="auto_fill"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="checkbox"
                      className="form-check-input"
                      value={field.value === "Y" ? true : false}
                      onChange={(e) =>
                        field.onChange(e.target.checked ? "Y" : "N")
                      }
                    />
                  )}
                />
              </div>
            </div>

            <div className="mb-0">
              <label className="col-form-label">Status</label>
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <input
                    type="radio"
                    className="status-radio"
                    id="active"
                    value="Y"
                    {...register("is_active", {
                      required: "Status is required.",
                    })}
                  />
                  <label htmlFor="active">Active</label>
                </div>
                <div>
                  <input
                    type="radio"
                    className="status-radio"
                    id="inactive"
                    value="N"
                    {...register("is_active")}
                  />
                  <label htmlFor="inactive">Inactive</label>
                </div>
              </div>
              {errors.is_active && (
                <small className="text-danger">
                  {errors.is_active.message}
                </small>
              )}
            </div>
          </div>

          <div className="d-flex py-3 align-items-center justify-content-end m-0">
            <Link to="#" className="btn btn-light me-2" data-bs-dismiss="modal">
              Cancel
            </Link>
            <button
              disabled={loading}
              type="submit"
              className="btn btn-primary"
            >
              {loading
                ? mode === "add"
                  ? "Creating..."
                  : "Updating..."
                : mode === "add"
                  ? "Create"
                  : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditModal;
