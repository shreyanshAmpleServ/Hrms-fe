import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addprovident_fund,
  updateprovident_fund,
} from "../../../../../redux/providentFund";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.providentFund);
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
        pf_name: initialData.pf_name || "",
        employee_contribution: initialData.employee_contribution || "",
        employer_contribution: initialData.employer_contribution || "",
      });
    } else {
      reset({
        pf_name: "",
        employer_contribution: "",
        employee_contribution: "",
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
        }),
      );
    }
    reset();
    setSelected(null);
    closeButton?.click();
  };

  return (
    <div
      className="modal fade"
      id="add_edit_provident_fund_modal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add"
                ? "Add New Provident Fund"
                : "Edit Provident Fund"}
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
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Provident Fund Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.pf_name ? "is-invalid" : ""}`}
                    placeholder="Enter Provident Fund Name"
                    {...register("pf_name", {
                      required: "Provident Fund name is required.",
                      minLength: {
                        value: 3,
                        message:
                          "Provident Fund name must be at least 3 characters.",
                      },
                    })}
                  />
                  {errors.pf_name && (
                    <small className="text-danger">
                      {errors.pf_name.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Employer Contribution <span className="text-danger">*</span>
                  </label>
                  <input
                    className={`form-control ${errors.employer_contribution ? "is-invalid" : ""}`}
                    placeholder="Enter Employer Contribution"
                    {...register("employer_contribution", {
                      required: "Employer contribution is required.",
                      min: {
                        value: 0,
                        message:
                          "Employer contribution must be greater than 0.",
                      },
                      max: {
                        value: 100,
                        message: "Employer contribution must be less than 100.",
                      },
                    })}
                  />
                  {errors.employer_contribution && (
                    <small className="text-danger">
                      {errors.employer_contribution.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Employee Contribution <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.employee_contribution ? "is-invalid" : ""}`}
                    placeholder="Enter Employee Contribution"
                    {...register("employee_contribution", {
                      required: "Employee contribution is required.",
                      min: {
                        value: 0,
                        message:
                          "Employee contribution must be greater than 0.",
                      },
                      max: {
                        value: 100,
                        message: "Employee contribution must be less than 100.",
                      },
                    })}
                  />
                  {errors.employee_contribution && (
                    <small className="text-danger">
                      {errors.employee_contribution.message}
                    </small>
                  )}
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
