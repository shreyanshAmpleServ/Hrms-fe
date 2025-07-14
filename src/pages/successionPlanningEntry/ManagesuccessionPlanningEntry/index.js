import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import { fetchRoles } from "../../../redux/roles";
import {
  createsuccessionPlanning,
  updatesuccessionPlanning,
} from "../../../redux/successionPlanningEntry";

const ManagesuccessionPlanning = ({
  setsuccessionPlanning,
  successionPlanning,
}) => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      current_holder_id: "",
      potential_successor_id: "",
      critical_position: "",
      readiness_level: "",
      plan_date: new Date().toISOString(),
      development_plan: "",
      successor_rank: "",
      expected_transition_date: new Date().toISOString(),
      risk_of_loss: "",
      retention_plan: "",
      last_updated_by_hr: "",
      last_review_date: new Date().toISOString(),
      evaluated_by: "",
      role_id: "",
      evaluation_date: new Date().toISOString(),
      training_date: new Date().toISOString(),
    },
  });

  useEffect(() => {
    dispatch(fetchRoles({ is_active: true }));
  }, [dispatch]);

  useEffect(() => {
    if (successionPlanning) {
      reset({
        current_holder_id: successionPlanning.current_holder_id || "",
        potential_successor_id: successionPlanning.potential_successor_id || "",
        critical_position: successionPlanning.critical_position || false,
        readiness_level: successionPlanning.readiness_level || "",
        plan_date: successionPlanning.plan_date || "",
        development_plan: successionPlanning.development_plan || "",
        successor_rank: successionPlanning.successor_rank || "",
        risk_of_loss: successionPlanning.risk_of_loss || "",
        expected_transition_date:
          successionPlanning.expected_transition_date || "",
        evaluated_by: successionPlanning.evaluated_by || "",
        retention_plan: successionPlanning.retention_plan || "",
        last_updated_by_hr: successionPlanning.last_updated_by_hr || "",
        role_id: successionPlanning.role_id || "",
        training_date:
          successionPlanning.training_date || new Date().toISOString(),
      });
    } else {
      reset({
        current_holder_id: "",
        potential_successor_id: "",
        critical_position: "",
        readiness_level: "",
        plan_date: new Date().toISOString(),
        development_plan: "",
        successor_rank: "",
        risk_of_loss: "",
        retention_plan: "",
        last_updated_by_hr: "",
        last_review_date: new Date().toISOString(),
        evaluated_by: "",
        role_id: "",
        training_date: new Date().toISOString(),
      });
    }
  }, [successionPlanning, reset]);

  const { loading } = useSelector((state) => state.successionPlanning || {});

  const { roles, loading: rolesLoading } = useSelector((state) => state.roles);

  const roleOptions = roles?.map((role) => ({
    value: role.id,
    label: role.role_name,
  }));
  const readinessOptions = [
    { label: "Ready Now", value: "Ready Now" },
    { label: "Ready in 1 Year", value: "Ready in 1 Year" },
    { label: "Ready in 2+ Years", value: "Ready in 2+ Years" },
  ];

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      if (successionPlanning) {
        await dispatch(
          updatesuccessionPlanning({
            id: successionPlanning.id,
            successionPlanningData: { ...data },
          })
        ).unwrap();
      } else {
        await dispatch(createsuccessionPlanning({ ...data })).unwrap();
      }
      closeButton?.click();
      reset();
      setsuccessionPlanning(null);
    } catch (error) {
      console.error("Submission error:", error);
      closeButton?.click();
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setsuccessionPlanning(null);
      };
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
  }, [setsuccessionPlanning]);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{successionPlanning ? "Update" : "Add "} Succession Planning</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1"
          data-bs-dismiss="offcanvas"
          onClick={() => {
            setsuccessionPlanning(null);
            reset();
          }}
        />
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {/* Current Holder */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Current Holder <span className="text-danger">*</span>
              </label>
              <Controller
                name="current_holder_id"
                control={control}
                rules={{ required: "Current holder is required" }}
                render={({ field }) => (
                  <EmployeeSelect
                    {...field}
                    placeholder="Select Potential Successor"
                    value={field.value}
                    onChange={(opt) => field.onChange(opt?.value)}
                  />
                )}
              />
              {errors.current_holder_id && (
                <small className="text-danger">
                  {errors.current_holder_id.message}
                </small>
              )}
            </div>

            {/* Potential Successor */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Potential Successor <span className="text-danger">*</span>
              </label>
              <Controller
                name="potential_successor_id"
                control={control}
                rules={{ required: "Potential successor is required" }}
                render={({ field }) => (
                  <EmployeeSelect
                    {...field}
                    placeholder="Select Current Holder"
                    value={field.value}
                    onChange={(opt) => field.onChange(opt?.value)}
                  />
                )}
              />
              {errors.potential_successor_id && (
                <small className="text-danger">
                  {errors.potential_successor_id.message}
                </small>
              )}
            </div>

            {/* Critical Position */}

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Critical Position</label>
              <Controller
                name="critical_position"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="form-control"
                    placeholder="Enter Critical Position"
                  />
                )}
              />
            </div>

            {/* Readiness Level */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Readiness Level <span className="text-danger">*</span>
              </label>
              <Controller
                name="readiness_level"
                control={control}
                rules={{ required: "Readiness level is required" }}
                render={({ field }) => {
                  const selected = readinessOptions.find(
                    (opt) => opt.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      options={readinessOptions}
                      placeholder="Select Readiness Level"
                      value={selected || null}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                    />
                  );
                }}
              />
              {errors.readiness_level && (
                <small className="text-danger">
                  {errors.readiness_level.message}
                </small>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Evaluation Date <span className="text-danger">*</span>
              </label>
              <Controller
                name="evaluation_date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={
                      field.value
                        ? moment(field.value).format("DD-MM-YYYY")
                        : ""
                    }
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Offer Date"
                  />
                )}
              />
              {errors.evaluation_date && (
                <small className="text-danger">
                  {errors.evaluation_date.message}
                </small>
              )}
            </div>
            {/* Plan Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Plan Date<span className="text-danger"> *</span>
              </label>
              <Controller
                name="plan_date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={
                      field.value
                        ? moment(field.value).format("DD-MM-YYYY")
                        : ""
                    }
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Offer Date"
                  />
                )}
              />
              {errors.plan_date && (
                <small className="text-danger">
                  {errors.plan_date.message}
                </small>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Training Date <span className="text-danger">*</span>
              </label>
              <Controller
                name="training_date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={
                      field.value
                        ? moment(field.value).format("DD-MM-YYYY")
                        : ""
                    }
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Date"
                  />
                )}
              />
              {errors.training_date && (
                <small className="text-danger">
                  {errors.training_date.message}
                </small>
              )}
            </div>
            {/* Expected Transition Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Expected Transition Date</label>
              <Controller
                name="expected_transition_date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={
                      field.value
                        ? moment(field.value).format("DD-MM-YYYY")
                        : ""
                    }
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Offer Date"
                  />
                )}
              />
            </div>

            {/* Successor Rank */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Successor Rank</label>
              <Controller
                name="successor_rank"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="form-control"
                    placeholder="Enter Successor Rank"
                  />
                )}
              />
            </div>

            {/* Risk of Loss */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Risk of Loss</label>
              <Controller
                name="risk_of_loss"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { label: "Low", value: "Low" },
                      { label: "Medium", value: "Medium" },
                      { label: "High", value: "High" },
                    ]}
                    placeholder="Select Risk Level"
                    value={
                      [
                        { label: "Low", value: "Low" },
                        { label: "Medium", value: "Medium" },
                        { label: "High", value: "High" },
                      ].find((opt) => opt.value === field.value) || null
                    }
                    onChange={(opt) => field.onChange(opt?.value)}
                    classNamePrefix="react-select"
                  />
                )}
              />
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Role <span className="text-danger">*</span>
                </label>
                <Controller
                  name="role_id"
                  control={control}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={roleOptions}
                      isLoading={rolesLoading}
                      placeholder="Select Role"
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                    />
                  )}
                />
                {errors.role_id && (
                  <small className="text-danger">
                    {errors.role_id.message}
                  </small>
                )}
              </div>
            </div>

            {/* Last Updated by HR */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Last Updated By HR <span className="text-danger">*</span>
              </label>
              <Controller
                name="last_updated_by_hr"
                control={control}
                rules={{ required: "Last Updated By HR is required" }}
                render={({ field }) => (
                  <EmployeeSelect
                    {...field}
                    placeholder="Select Last Updated By HR"
                    value={field.value}
                    onChange={(opt) => field.onChange(opt?.value)}
                  />
                )}
              />
              {errors.last_updated_by_hr && (
                <small className="text-danger">
                  {errors.last_updated_by_hr.message}
                </small>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Evaluated By <span className="text-danger">*</span>
              </label>
              <Controller
                name="evaluated_by"
                control={control}
                rules={{ required: "Evaluated By is required" }}
                render={({ field }) => (
                  <EmployeeSelect
                    {...field}
                    placeholder="Select Evaluated By"
                    value={field.value}
                    onChange={(opt) => field.onChange(opt?.value)}
                  />
                )}
              />
              {errors.evaluated_by && (
                <small className="text-danger">
                  {errors.evaluated_by.message}
                </small>
              )}
            </div>

            {/* Last Review Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Last Review Date</label>
              <Controller
                name="last_review_date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={
                      field.value
                        ? moment(field.value).format("DD-MM-YYYY")
                        : ""
                    }
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Offer Date"
                  />
                )}
              />
            </div>
            {/* Development Plan */}
            <div className="col-md-12 mb-3">
              <label className="col-form-label">
                Development Plan{" "}
                <span className="text-muted">(Max 255 characters)</span>
              </label>
              <Controller
                name="development_plan"
                control={control}
                rules={{
                  maxLength: { value: 255, message: "Max 255 characters" },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    className="form-control"
                    placeholder="Enter Development Plan"
                  />
                )}
              />
              {errors.development_plan && (
                <small className="text-danger">
                  {errors.development_plan.message}
                </small>
              )}
            </div>
            {/* Retention Plan */}
            <div className="col-md-12 mb-3">
              <label className="col-form-label">
                Retention Plan{" "}
                <span className="text-muted">(Max 255 characters)</span>
              </label>
              <Controller
                name="retention_plan"
                control={control}
                rules={{
                  maxLength: { value: 255, message: "Max 255 characters" },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    className="form-control"
                    placeholder="Enter Retention Plan"
                  />
                )}
              />
              {errors.retention_plan && (
                <small className="text-danger">
                  {errors.retention_plan.message}
                </small>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {successionPlanning
                ? loading
                  ? "Updating..."
                  : "Update"
                : loading
                  ? "Creating..."
                  : "Create"}
              {loading && (
                <div className="spinner-border spinner-border-sm ms-2" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagesuccessionPlanning;
