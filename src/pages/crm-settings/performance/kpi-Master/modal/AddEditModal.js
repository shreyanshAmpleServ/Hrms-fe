import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addkpi, updatekpi } from "../../../../../redux/kpiMaster";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.KpiMaster);
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
        kpi_name: initialData.kpi_name || "",
        description: initialData.description || "",
        is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        kpi_name: "",
        description: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_kpi_modal");
    if (mode === "add") {
      dispatch(addkpi(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updatekpi({
          id: initialData.id,
          kpiData: data,
        })
      );
    }
    reset();
    setSelected(null);
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_kpi_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add KPI" : "Edit KPI"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_kpi_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="col-form-label">
                  KPI Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.kpi_name ? "is-invalid" : ""}`}
                  placeholder="Enter KPI Name"
                  {...register("kpi_name", {
                    required: "KPI Name is required.",
                    minLength: {
                      value: 3,
                      message: "KPI Name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.kpi_name && (
                  <small className="text-danger">
                    {errors.kpi_name.message}
                  </small>
                )}
              </div>
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

              <div className="mb-3">
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
                  <small className="text-danger">
                    {errors.is_active.message}
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
