import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addprovident_fund, updateprovident_fund } from "../../../../../redux/providentFund";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.providentFund);
  const dispatch = useDispatch();


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();


  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        pf_name: initialData.pf_name || "",
        employee_contribution: initialData.employee_contribution || "",
        employer_contribution: initialData.employer_contribution || "",
        // is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        pf_name: "",
        employer_contribution: "",
        employee_contribution: "",
        // is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("Close_provident_fund_modal");
    if (mode === "add") {
      dispatch(addprovident_fund(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateprovident_fund({
          id: initialData.id,
          provident_fundData: data,
        })
      );
    }
    reset();
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_provident_fund_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Provident Fund" : "Edit Provident Fund"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="Close_provident_fund_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Industry Name */}
              <div className="row">

                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Pf Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    {...register("pf_name", {
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
                </div>
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Employer Contribution <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    {...register("employer_contribution", {
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
                </div>
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Employee Contribution <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    {...register("employee_contribution", {
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
                </div>
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
