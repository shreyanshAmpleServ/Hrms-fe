import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { addjob_posting, updatejob_posting } from "../../../redux/JobPosting";
import { fetchdepartment } from "../../../redux/department";
import { fetchdesignation } from "../../../redux/designation";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.job_posting);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    dispatch(fetchdepartment());
    dispatch(fetchdesignation());
  }, [dispatch]);

  const department = useSelector((state) => state.department.department);
  const designation = useSelector((state) => state.designation.designation);

  const DepartmentList = useMemo(
    () =>
      department?.data?.map((item) => ({
        value: item.id,
        label: item.department_name,
      })) || [],
    [department]
  );

  const DesignationList = useMemo(
    () =>
      designation?.data?.map((item) => ({
        value: item.id,
        label: item.designation_name,
      })) || [],
    [designation]
  );

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        department_id: initialData.department_id || "",
        designation_id: initialData.designation_id || "",
        job_title: initialData.job_title || "",
        description: initialData.description || "",
        required_experience:
          initialData.required_experience !== null && initialData.required_experience !== undefined
            ? String(initialData.required_experience)
            : "",
        posting_date: initialData.posting_date
          ? new Date(initialData.posting_date).toISOString().split("T")[0]
          : "",
        closing_date: initialData.closing_date
          ? new Date(initialData.closing_date).toISOString().split("T")[0]
          : "",
        is_internal:
          initialData.is_internal === true
            ? "true"
            : initialData.is_internal === false
              ? "false"
              : "", // always string for select input
      });
    } else {
      reset({
        department_id: "",
        designation_id: "",
        job_title: "",
        required_experience: "",
        posting_date: "",
        closing_date: "",
        is_internal: "",
        description: "",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_job_posting_modal");

    const formattedData = {
      ...data,
      posting_date: data.posting_date ? new Date(data.posting_date) : null,
      closing_date: data.closing_date ? new Date(data.closing_date) : null,
      required_experience:
        data.required_experience !== "" && !isNaN(data.required_experience)
          ? (data.required_experience)
          : null,

      is_internal: data.is_internal,
    };

    if (mode === "add") {
      dispatch(addjob_posting(formattedData));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updatejob_posting({
          id: initialData.id,
          job_postingData: formattedData,
        })
      );
    }

    reset();
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_job_posting_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add Job Posting" : "Edit Job Posting"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_job_posting_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body row">
              {/* Department Select */}
              <div className="col-md-6">
                <label className="col-form-label">
                  Department <span className="text-danger">*</span>
                </label>
                <Controller
                  name="department_id"
                  control={control}
                  rules={{ required: "Department is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={DepartmentList}
                      placeholder="Choose"
                      isDisabled={!DepartmentList.length}
                      classNamePrefix="react-select"
                      className="select2"
                      onChange={(option) => field.onChange(option?.value || "")}
                      value={DepartmentList.find(
                        (option) => option.value === watch("department_id")
                      )}
                    />
                  )}
                />
                {errors.department_id && (
                  <small className="text-danger">{errors.department_id.message}</small>
                )}
              </div>

              {/* Designation Select */}
              <div className="col-md-6">
                <label className="col-form-label">
                  Designation <span className="text-danger">*</span>
                </label>
                <Controller
                  name="designation_id"
                  control={control}
                  rules={{ required: "Designation is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={DesignationList}
                      placeholder="Choose"
                      isDisabled={!DesignationList.length}
                      classNamePrefix="react-select"
                      className="select2"
                      onChange={(option) => field.onChange(option?.value || "")}
                      value={DesignationList.find(
                        (option) => option.value === watch("designation_id")
                      )}
                    />
                  )}
                />
                {errors.designation_id && (
                  <small className="text-danger">{errors.designation_id.message}</small>
                )}
              </div>

              {/* Job Title */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("job_title", { required: "Job title is required" })}
                />
                {errors.job_title && (
                  <small className="text-danger">{errors.job_title.message}</small>
                )}
              </div>

              {/* Required Experience */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Required Experience</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("required_experience", { required: "Experience is required" })}
                />
                {errors.required_experience && (
                  <small className="text-danger">{errors.required_experience.message}</small>
                )}
              </div>

              {/* Posting Date */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Posting Date</label>
                <input
                  type="date"
                  className="form-control"
                  {...register("posting_date", { required: "Posting date is required" })}
                />
                {errors.posting_date && (
                  <small className="text-danger">{errors.posting_date.message}</small>
                )}
              </div>

              {/* Closing Date */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Closing Date</label>
                <input
                  type="date"
                  className="form-control"
                  {...register("closing_date", { required: "Closing date is required" })}
                />
                {errors.closing_date && (
                  <small className="text-danger">{errors.closing_date.message}</small>
                )}
              </div>

              {/* Is Internal */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Is Internal?</label>
                <select
                  className="form-select"
                  {...register("is_internal", { required: "Internal status is required" })}
                  defaultValue=""
                >
                  <option value="">Select</option>
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
                {errors.is_internal && (
                  <small className="text-danger">{errors.is_internal.message}</small>
                )}
              </div>


              {/* Description */}
              <div className="col-md-12 mb-3">
                <label className="form-label">Job Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  {...register("description", { required: "Description is required" })}
                ></textarea>
                {errors.description && (
                  <small className="text-danger">{errors.description.message}</small>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (mode === "add" ? "Creating..." : "Updating...") : mode === "add" ? "Create" : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditModal;
