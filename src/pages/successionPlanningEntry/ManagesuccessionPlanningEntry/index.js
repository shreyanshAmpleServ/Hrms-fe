import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createsuccessionPlanning,
  updatesuccessionPlanning,
} from "../../../redux/successionPlanningEntry";
import DatePicker from "react-datepicker";

const ManagesuccessionPlanning = ({
  setsuccessionPlanning,
  successionPlanning,
}) => {
  const [searchValue, setSearchValue] = useState("");
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
      critical_position: false,
      readiness_level: "",
      plan_date: "",
    },
  });

  useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
  }, [dispatch, searchValue]);

  useEffect(() => {
    if (successionPlanning) {
      reset({
        current_holder_id: successionPlanning.current_holder_id || "",
        potential_successor_id: successionPlanning.potential_successor_id || "",
        critical_position: successionPlanning.critical_position || false,
        readiness_level: successionPlanning.readiness_level || "",
        plan_date: successionPlanning.plan_date
          ? moment(successionPlanning.plan_date).format("YYYY-MM-DD")
          : "",
      });
    } else {
      reset({
        current_holder_id: "",
        potential_successor_id: "",
        critical_position: false,
        readiness_level: "",
        plan_date: "",
      });
    }
  }, [successionPlanning, reset]);

  const { employee } = useSelector((state) => state.employee || {});
  const { loading } = useSelector((state) => state.successionPlanning || {});

  const employeeOptions = employee?.data?.map((emp) => ({
    label: emp.full_name,
    value: emp.id,
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
                render={({ field }) => {
                  const selected = employeeOptions?.find(
                    (opt) => opt.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      options={employeeOptions}
                      placeholder="Select Employee"
                      value={selected || null}
                      onInputChange={setSearchValue}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                    />
                  );
                }}
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
                render={({ field }) => {
                  const selected = employeeOptions?.find(
                    (opt) => opt.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      options={employeeOptions}
                      placeholder="Select Successor"
                      value={selected || null}
                      onInputChange={setSearchValue}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                    />
                  );
                }}
              />
              {errors.potential_successor_id && (
                <small className="text-danger">
                  {errors.potential_successor_id.message}
                </small>
              )}
            </div>

            {/* Critical Position */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label d-block">
                Is Critical Position?
              </label>
              <Controller
                name="critical_position"
                control={control}
                render={({ field }) => (
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="critical_position"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </div>
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
