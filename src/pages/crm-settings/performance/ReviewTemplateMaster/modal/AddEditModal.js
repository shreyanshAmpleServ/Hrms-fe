import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addreview_template,
  updatereview_template,
} from "../../../../../redux/reviewTemplateMaster";
import moment from "moment";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.reviewTemplateMaster);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        template_name: initialData.template_name || "",
        valid_from:
          new Date(initialData.valid_from).toISOString() ||
          new Date().toISOString(),
      });
    } else {
      reset({
        template_name: "",
        valid_from: new Date().toISOString(),
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_review_template_modal");
    if (mode === "add") {
      dispatch(addreview_template(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updatereview_template({
          id: initialData.id,
          review_templateData: data,
        })
      );
    }
    reset();
    setSelected(null);
    closeButton?.click();
  };

  return (
    <div
      className="modal fade"
      id="add_edit_review_template_modal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add"
                ? "Add New Review Template"
                : "Edit Review Template"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_review_template_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                {/* Template Name */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Template Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.template_name ? "is-invalid" : ""}`}
                    placeholder="Enter template name"
                    {...register("template_name", {
                      required: "Template name is required.",
                    })}
                  />
                  {errors.template_name && (
                    <small className="text-danger">
                      {errors.template_name.message}
                    </small>
                  )}
                </div>

                {/* Valid From */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Valid From <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="valid_from"
                    control={control}
                    rules={{ required: "Valid from date is required." }}
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="Select valid from date"
                        className={`form-control ${errors.valid_from ? "is-invalid" : ""}`}
                        selected={field.value ? new Date(field.value) : null}
                        value={
                          field.value
                            ? moment(field.value).format("DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => field.onChange(date)}
                        dateFormat="DD-MM-YYYY"
                      />
                    )}
                  />
                  {errors.valid_from && (
                    <small className="text-danger">
                      {errors.valid_from.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditModal;
