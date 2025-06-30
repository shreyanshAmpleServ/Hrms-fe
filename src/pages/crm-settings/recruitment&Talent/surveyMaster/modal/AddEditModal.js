import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addsurvey, updatesurvey } from "../../../../../redux/surveyMaster";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.surveyMaster);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        survey_title: initialData.survey_title || "",
        launch_date: initialData.launch_date
          ? new Date(initialData.launch_date)
          : null,
        close_date: initialData.close_date
          ? new Date(initialData.close_date)
          : null,
        description: initialData.description || "",
        is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        survey_title: "",
        launch_date: null,
        close_date: null,
        description: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_survey_modal");
    if (mode === "add") {
      dispatch(addsurvey(data));
    } else {
      dispatch(
        updatesurvey({
          id: initialData?.id,
          surveyData: data,
        })
      );
    }
    reset();
    setSelected(null);
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_survey_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add Survey" : "Edit Survey"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_survey_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Survey Title */}
              <div className="mb-3">
                <label className="col-form-label">
                  Survey Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.survey_title ? "is-invalid" : ""}`}
                  placeholder="Enter Survey Title"
                  {...register("survey_title", {
                    required: "Survey title is required.",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters.",
                    },
                  })}
                />
                {errors.survey_title && (
                  <small className="text-danger">
                    {errors.survey_title.message}
                  </small>
                )}
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="col-form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  type="text"
                  rows={3}
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  placeholder="Enter Description"
                  {...register("description", {
                    required: "Description is required.",
                    minLength: {
                      value: 3,
                      message: "Description must be at least 3 characters.",
                    },
                  })}
                />
                {errors.description && (
                  <small className="text-danger">
                    {errors.description.message}
                  </small>
                )}
              </div>

              <div className="row">
                {/* Launch Date */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Launch Date <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="launch_date"
                    control={control}
                    rules={{ required: "Launch date is required." }}
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="Select Launch Date"
                        className={`form-control ${errors.launch_date ? "is-invalid" : ""}`}
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="dd-MM-yyyy"
                      />
                    )}
                  />
                  {errors.launch_date && (
                    <small className="text-danger">
                      {errors.launch_date.message}
                    </small>
                  )}
                </div>

                {/* Close Date */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Close Date <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="close_date"
                    control={control}
                    rules={{ required: "Close date is required." }}
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="Select Close Date"
                        className={`form-control ${errors.close_date ? "is-invalid" : ""}`}
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="dd-MM-yyyy"
                      />
                    )}
                  />
                  {errors.close_date && (
                    <small className="text-danger">
                      {errors.close_date.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label className="col-form-label">Status</label>
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <input
                      type="radio"
                      className="status-radio"
                      id="active"
                      value="Y"
                      {...register("is_active")}
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
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <div className="d-flex align-items-center justify-content-end m-0">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditModal;
