import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  adddisciplinary_penalty,
  updatedisciplinary_penalty,
} from "../../../../../redux/disciplinaryPenalty";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.disciplinary_penalty);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        penalty_type: initialData.penalty_type || "",
        description: initialData.description || "",
        is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        penalty_type: "",
        description: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_disciplinary_penalty_modal"
    );
    if (mode === "add") {
      dispatch(adddisciplinary_penalty(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updatedisciplinary_penalty({
          id: initialData.id,
          disciplinary_penaltyData: data,
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
      id="add_edit_disiplinary_penalty_modal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add"
                ? "Add  disciplinary penalty "
                : "Edit disciplinary penalty"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_disciplinary_penalty_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="col-form-label">
                  Penalty Type <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.penalty_type ? "is-invalid" : ""}`}
                  placeholder="Enter penalty type"
                  {...register("penalty_type", {
                    required: "Penalty type is required.",
                    minLength: {
                      value: 3,
                      message: "Penalty type must be at least 3 characters.",
                    },
                  })}
                />
                {errors.penalty_type && (
                  <small className="text-danger">
                    {errors.penalty_type.message}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label className="col-form-label">
                  Description <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={3}
                  type="text"
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  placeholder="Enter description"
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
