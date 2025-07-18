import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import DepartmentSelect from "../../../components/common/DepartmentSelect";
import DesignationSelect from "../../../components/common/DesignationSelect";
import { createJobPosting, updateJobPosting } from "../../../redux/JobPosting";

const ManageJobPosting = ({ setJobPosting, JobPosting }) => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const postingDate = useWatch({ control, name: "posting_date" });

  const { loading } = useSelector((state) => state.JobPosting || {});

  React.useEffect(() => {
    if (JobPosting) {
      reset({
        department_id: JobPosting.department_id || "",
        designation_id: JobPosting.designation_id || "",
        job_title: JobPosting.job_title || "",
        description: JobPosting.description || "",
        required_experience: JobPosting.required_experience || "",
        posting_date: JobPosting.posting_date
          ? new Date(JobPosting.posting_date).toISOString()
          : new Date().toISOString(),
        closing_date: JobPosting.closing_date
          ? new Date(JobPosting.closing_date).toISOString()
          : new Date(
              new Date().setDate(new Date().getDate() + 7)
            ).toISOString(),
        is_internal: JobPosting.is_internal || false,
      });
    } else {
      reset({
        department_id: "",
        designation_id: "",
        job_title: "",
        description: "",
        required_experience: "",
        posting_date: new Date().toISOString(),
        closing_date: new Date(
          new Date().setDate(new Date().getDate() + 7)
        ).toISOString(),
        is_internal: false,
      });
    }
  }, [JobPosting, reset]);

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      JobPosting
        ? await dispatch(
            updateJobPosting({ id: JobPosting.id, JobPostingData: data })
          ).unwrap()
        : await dispatch(createJobPosting(data)).unwrap();
      closeButton.click();
      reset();
      setJobPosting(null);
    } catch (error) {
      closeButton.click();
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setJobPosting(null);
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
  }, [setJobPosting]);
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{JobPosting ? "Update" : "Add"} Job Posting</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => {
            setJobPosting(null);
            reset();
          }}
        >
          <i className="ti ti-x" />
        </button>
      </div>

      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Department <span className="text-danger">*</span>
              </label>
              <Controller
                name="department_id"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <DepartmentSelect
                    {...field}
                    value={field.value}
                    onChange={(opt) => field.onChange(opt.value)}
                  />
                )}
              />
              {errors.department_id && (
                <small className="text-danger">
                  {errors.department_id.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Designation <span className="text-danger">*</span>
              </label>
              <Controller
                name="designation_id"
                control={control}
                rules={{ required: "Designation is required" }}
                render={({ field }) => (
                  <DesignationSelect
                    {...field}
                    value={field.value}
                    onChange={(opt) => field.onChange(opt.value)}
                  />
                )}
              />
              {errors.designation_id && (
                <small className="text-danger">
                  {errors.designation_id.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Job Title <span className="text-danger">*</span>
              </label>
              <Controller
                name="job_title"
                control={control}
                rules={{ required: "Job title is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={`form-control ${errors.job_title ? "is-invalid" : ""}`}
                    placeholder="Enter Job Title"
                  />
                )}
              />
              {errors.job_title && (
                <small className="text-danger">
                  {errors.job_title.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Experience <span className="text-danger">*</span>
              </label>
              <Controller
                name="required_experience"
                control={control}
                rules={{ required: "Experience is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={`form-control ${errors.required_experience ? "is-invalid" : ""}`}
                    placeholder="Required Experience"
                  />
                )}
              />
              {errors.required_experience && (
                <small className="text-danger">
                  {errors.required_experience.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Posting Date <span className="text-danger">*</span>
              </label>
              <Controller
                name="posting_date"
                control={control}
                rules={{ required: "Posting date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className={`form-control ${errors.posting_date ? "is-invalid" : ""}`}
                    value={
                      field.value
                        ? moment(field.value).format("DD-MM-YYYY")
                        : null
                    }
                    onChange={(date) =>
                      field.onChange(moment(date).startOf("day").toDate())
                    }
                    dateFormat="DD-MM-YYYY"
                    maxDate={new Date()}
                    placeholderText="Select Posting Date"
                  />
                )}
              />
              {errors.posting_date && (
                <small className="text-danger">
                  {errors.posting_date.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Closing Date <span className="text-danger">*</span>
              </label>
              <Controller
                name="closing_date"
                control={control}
                rules={{
                  required: "Closing date is required",
                  validate: (value) =>
                    !postingDate ||
                    value >= postingDate ||
                    "Closing date must be after or equal to posting date",
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className={`form-control ${errors.closing_date ? "is-invalid" : ""}`}
                    value={
                      field.value
                        ? moment(field.value).format("DD-MM-YYYY")
                        : null
                    }
                    onChange={(date) =>
                      field.onChange(moment(date).startOf("day").toDate())
                    }
                    dateFormat="DD-MM-YYYY"
                    minDate={postingDate || null}
                    placeholderText="Select Closing Date"
                  />
                )}
              />
              {errors.closing_date && (
                <small className="text-danger">
                  {errors.closing_date.message}
                </small>
              )}
            </div>
            <div className="col-md-12 mb-3">
              <label className="col-form-label">
                Description{" "}
                <small className="text-muted">(Max 255 characters)</small>
                <span className="text-danger">*</span>
              </label>
              <Controller
                name="description"
                control={control}
                rules={{
                  required: "Description is required!",
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
                    className={`form-control ${errors.description ? "is-invalid" : ""}`}
                    placeholder="Enter Description "
                  />
                )}
              />
              {errors.description && (
                <small className="text-danger">
                  {errors.description.message}
                </small>
              )}
            </div>

            <div
              style={{ paddingLeft: "35px" }}
              className="col-md-12 mb-3 form-check"
            >
              <Controller
                name="is_internal"
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
              <label className="form-check-label">Is Internal Job?</label>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {JobPosting
                ? loading
                  ? "Updating..."
                  : "Update"
                : loading
                  ? "Creating..."
                  : "Create"}
              {loading && (
                <div
                  className="spinner-border text-light ms-2"
                  style={{ height: "15px", width: "15px" }}
                  role="status"
                />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageJobPosting;
