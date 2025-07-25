import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import {
  creategrievanceSubmission,
  updategrievanceSubmission,
} from "../../../redux/grievanceSubmission";
import { fetchgrievance_type } from "../../../redux/grievanceTypeMaster";

const ManagegrievanceSubmission = ({
  setgrievanceSubmission,
  grievanceSubmission,
}) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: "",
      grievance_type: "",
      description: "",
      anonymous: false,
      submitted_on: new Date().toISOString(),
      status: "Pending",
      assigned_to: "",
      resolution_notes: "",
      resolved_on: "",
    },
  });

  const { loading } = useSelector((state) => state.grievanceSubmission || {}); // ✅ Use correct slice

  useEffect(() => {
    if (grievanceSubmission) {
      reset({
        employee_id: grievanceSubmission.employee_id || "",
        grievance_type: grievanceSubmission.grievance_type || "",
        description: grievanceSubmission.description || "",
        anonymous: grievanceSubmission.anonymous || false,
        submitted_on:
          grievanceSubmission.submitted_on || new Date().toISOString(),
        status: grievanceSubmission.status || "Pending",
        assigned_to: grievanceSubmission.assigned_to || "",
        resolution_notes: grievanceSubmission.resolution_notes || "",
        resolved_on:
          grievanceSubmission.resolved_on || new Date().toISOString(),
      });
    } else {
      reset({
        employee_id: "",
        grievance_type: "",
        description: "",
        anonymous: false,
        submitted_on: new Date().toISOString(),
        status: "Pending",
        assigned_to: "",
        resolution_notes: "",
        resolved_on: new Date().toISOString(),
      });
    }
  }, [grievanceSubmission, reset]);

  useEffect(() => {
    dispatch(fetchgrievance_type({ is_active: true }));
  }, [dispatch]);

  const { grievance_type } = useSelector((state) => state.grievanceType || {});

  const grievanceTypeOptions =
    grievance_type?.data?.map((i) => ({
      label: i?.grievance_type_name,
      value: i?.id,
    })) || [];

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      if (grievanceSubmission) {
        await dispatch(
          updategrievanceSubmission({
            id: grievanceSubmission.id,
            grievanceSubmissionData: { ...data },
          })
        ).unwrap();
      } else {
        await dispatch(creategrievanceSubmission({ ...data })).unwrap();
      }
      closeButton?.click();
      reset();
      setgrievanceSubmission(null);
    } catch (error) {
      closeButton?.click();
      console.error("Submission error:", error);
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setgrievanceSubmission(null);
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
  }, [setgrievanceSubmission]);

  return (
    <>
      {/* Add New appointment */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>
            {grievanceSubmission ? "Update " : "Add New "} Grievance Submission
          </h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setgrievanceSubmission(null);
              reset();
            }}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Employee<span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="employee_id"
                    control={control}
                    rules={{ required: "Employee is required" }}
                    render={({ field }) => (
                      <EmployeeSelect
                        {...field}
                        value={field.value}
                        onChange={(i) => field.onChange(i?.value)}
                      />
                    )}
                  />
                  {errors.employee_id && (
                    <small className="text-danger">
                      {errors.employee_id.message}
                    </small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Status</label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={[
                          { value: "", label: "-- Select --" },
                          { value: "Pending", label: "Pending" },
                          { value: "Resolved", label: "Resolved" },
                          { value: "Closed", label: "Closed" },
                        ]}
                        placeholder="-- Select --"
                        classNamePrefix="react-select"
                        value={
                          field.value
                            ? { label: field.value, value: field.value }
                            : null
                        }
                        onChange={(opt) => field.onChange(opt.value)}
                      />
                    )}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Grievance Type <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="grievance_type"
                    control={control}
                    rules={{ required: "Grievance type is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={[
                          { value: "", label: "-- Select --" },
                          ...grievanceTypeOptions,
                        ]}
                        placeholder="-- Select --"
                        classNamePrefix="react-select"
                        value={field.value}
                        onChange={(i) => field.onChange(i?.value)}
                      />
                    )}
                  />
                  {errors.grievance_type && (
                    <small className="text-danger">
                      {errors.grievance_type.message}
                    </small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Resolved On</label>
                  <Controller
                    name="resolved_on"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        value={
                          field.value
                            ? moment(field.value).format("DD-MM-YYYY")
                            : ""
                        }
                        selected={field.value ? new Date(field.value) : null}
                        onChange={field.onChange}
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                      />
                    )}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Submitted On</label>
                  <Controller
                    name="submitted_on"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        value={
                          field.value
                            ? moment(field.value).format("DD-MM-YYYY")
                            : ""
                        }
                        selected={field.value ? new Date(field.value) : null}
                        onChange={field.onChange}
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                      />
                    )}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Assigned To</label>
                  <Controller
                    name="assigned_to"
                    control={control}
                    render={({ field }) => (
                      <EmployeeSelect
                        {...field}
                        placeholder="-- Select --"
                        value={field.value}
                        onChange={(i) => field.onChange(i?.value)}
                      />
                    )}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <Controller
                    name="anonymous"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />

                  <label className="col-form-label ms-2">Anonymous?</label>
                </div>

                {/* Resolution Notes */}
                <div className="col-12 mb-3">
                  <label className="col-form-label">
                    Resolution Notes{" "}
                    <small className="text-muted">(Max 255 characters)</small>
                    <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="resolution_notes"
                    control={control}
                    rules={{
                      required: "Resolution notes is required!",
                      maxLength: {
                        value: 255,
                        message:
                          "Resolution notes must be less than or equal to 255 characters",
                      },
                    }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        maxLength={255}
                        className="form-control"
                        placeholder="Enter Resolution Notes"
                      />
                    )}
                  />
                  {errors.resolution_notes && (
                    <small className="text-danger">
                      {errors.resolution_notes.message}
                    </small>
                  )}
                </div>

                {/* Description */}
                <div className="col-12 mb-3">
                  <label className="col-form-label">Description</label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{
                      maxLength: {
                        value: 255,
                        message:
                          "Description must be less than or equal to 255 characters",
                      },
                    }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        maxLength={255}
                        className="form-control"
                        placeholder="Enter description"
                      />
                    )}
                  />
                  {errors.description && (
                    <small className="text-danger">
                      {errors.description.message}
                    </small>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {grievanceSubmission
                  ? loading
                    ? " Updating..."
                    : "Update"
                  : loading
                    ? "Creating..."
                    : "Create"}
                {loading && (
                  <div
                    style={{
                      height: "15px",
                      width: "15px",
                    }}
                    className="spinner-border ml-2 text-light"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManagegrievanceSubmission;
