import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addgrievance_type,
  updategrievance_type,
} from "../../../../../redux/grievanceTypeMaster";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.grievanceType);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({ grievance_type_name: initialData.grievance_type_name || "" });
    } else {
      reset({ grievance_type_name: "" });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_grievance_type_modal");
    if (mode === "add") {
      dispatch(addgrievance_type(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updategrievance_type({
          id: initialData.id,
          grievance_typeData: data,
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
      id="add_edit_grievance_type_modal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add"
                ? "Add New Grievance Type "
                : "Edit Grievance Type "}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_grievance_type_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="col-form-label">
                  Grievance Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.grievance_type_name ? "is-invalid" : ""}`}
                  placeholder="Enter Grievance Name"
                  {...register("grievance_type_name", {
                    required: "Grievance name is required.",
                    minLength: {
                      value: 3,
                      message: "Grievance name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.grievance_type_name && (
                  <small className="text-danger">
                    {errors.grievance_type_name.message}
                  </small>
                )}
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
