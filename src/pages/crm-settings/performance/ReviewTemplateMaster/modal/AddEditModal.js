import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addreview_template,
  updatereview_template,
} from "../../../../../redux/reviewTemplateMaster";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.statutoryRates);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm();

  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        template_name: initialData.template_name || "",
        valid_from: initialData.valid_from || "",
      });
    } else {
      reset({
        template_name: "",
        valid_from: "",
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
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_review_template_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Review Template" : "Edit Review Template"}
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
                {/* Country Code */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Template Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.template_name ? "is-invalid" : ""}`}
                    {...register("template_name", {
                      required: "Country code is required.",
                    })}
                  />
                  {errors.template_name && (
                    <small className="text-danger">{errors.template_name.message}</small>
                  )}
                </div>

                {/* Lower Limit */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Valid From <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="Valid from"
                    control={control}
                    rules={{ required: "Valid from date is required." }}
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="Select date"
                        className={`form-control ${errors.valid_from ? "is-invalid" : ""}`}
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="dd-MM-yyyy"
                      />
                    )}
                  />
                  {errors.valid_from && (
                    <small className="text-danger">{errors.valid_from.message}</small>
                  )}
                </div>


                {/* Statutory Type */}

              </div>

              {/* Status */}
              {/* <div className="mb-0">
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
                  <small className="text-danger">{errors.is_active.message}</small>
                )}
              </div> */}
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
