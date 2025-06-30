import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addsalary_structure,
  updatesalary_structure,
} from "../../../../../redux/salary-structure";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.goalCategoryMaster);
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
        structure_name: initialData.structure_name || "",
        is_active: initialData.is_active || "Y",
      });
    } else {
      reset({ structure_name: "", is_active: "Y" });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_salary_structure_modal");
    if (mode === "add") {
      dispatch(addsalary_structure(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updatesalary_structure({
          id: initialData.id,
          salary_structureData: data,
        })
      );
    }
    setSelected(null);
    reset();
    closeButton?.click();
  };

  return (
    <div
      className="modal fade"
      id="add_edit_salary_structure_modal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add"
                ? "Add Salary Structure "
                : "Edit Salary Structure"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_salary_structure_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="col-form-label">
                  Structure Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.structure_name ? "is-invalid" : ""}`}
                  placeholder="Enter Structure Name"
                  {...register("structure_name", {
                    required: "Structure name is required.",
                    minLength: {
                      value: 3,
                      message: "Structure name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.structure_name && (
                  <small className="text-danger">
                    {errors.structure_name.message}
                  </small>
                )}
              </div>
              <div className="mb-0">
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
