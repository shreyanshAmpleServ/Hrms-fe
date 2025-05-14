import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addbranch, updatebranch } from "../../../../../redux/branch";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.branch);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        name: initialData.category_name || "",
        is_active: initialData.is_active,
      });
    } else {
      reset({
        category_name: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_branch _modal",
    );
    if (mode === "add") {
      // Dispatch Add action
      dispatch(
        addbranch({
          category_name: data.name,
          is_active: data.is_active,
        }),
      );
    } else if (mode === "edit" && initialData) {
      // Dispatch Edit action
      dispatch(
        updatebranch({
          id: initialData.id,
          branchData: { category_name: data.name, is_active: data.is_active },
        }),
      );
    }
    reset(); // Clear the form
    closeButton.click();
  };

  return (
    <div className="modal fade" id="add_edit_branch_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Employee" : "Edit branch "}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_branch _modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Industry Name */}
              {/* <div className="mb-3">
                <label className="col-form-label">
                  Company Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("name", {
                    required: "Industry name is required.",
                    minLength: {
                      value: 3,
                      message: "Industry name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div> */}
              <div className="row">
                {/* Company Dropdown */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Company <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-control ${errors.company_id ? "is-invalid" : ""}`}
                    {...register("company_id", { required: "Company is required." })}
                  >
                    <option value="">Select Company</option>
                    <option value="1">AmpleServ Technology Pvt Ltd</option>
                    <option value="2">TechCorp Solutions</option>
                    {/* Add more options as needed */}
                  </select>
                  {errors.company_id && (
                    <small className="text-danger">{errors.company_id.message}</small>
                  )}
                </div>

                {/* Branch Name Input */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Branch Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.branch_name ? "is-invalid" : ""}`}
                    {...register("branch_name", {
                      required: "Branch name is required.",
                      minLength: {
                        value: 3,
                        message: "Branch name must be at least 3 characters.",
                      },
                    })}
                  />
                  {errors.branch_name && (
                    <small className="text-danger">{errors.branch_name.message}</small>
                  )}
                </div>

                {/* Branch Location Input */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Location <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.location ? "is-invalid" : ""}`}
                    {...register("location", {
                      required: "Location is required.",
                    })}
                  />
                  {errors.location && (
                    <small className="text-danger">{errors.location.message}</small>
                  )}
                </div>
              </div>

              {/* Status */}
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
                  <small className="text-danger">{errors.is_active.message}</small>
                )}
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
