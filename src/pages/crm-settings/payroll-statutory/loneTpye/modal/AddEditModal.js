import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addloan_type, updateloan_type } from "../../../../../redux/loneType";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.loan_type);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        loan_name: initialData.loan_name || "",
        interest_rate: initialData.interest_rate || "",
      });
    } else {
      reset({
        loan_name: "",
        interest_rate: "",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("Close_loan_type_modal");
    const finalData = { ...data };

    if (mode === "add") {
      dispatch(addloan_type(finalData));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateloan_type({
          id: initialData.id,
          loan_typeData: finalData,
        })
      );
    }
    reset();
    setSelected(null);
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_loan_type_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add Loan Type" : "Edit Loan Type"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="Close_loan_type_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Loan Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Loan Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.loan_name ? "is-invalid" : ""}`}
                  placeholder="Enter Loan Name"
                  {...register("loan_name", {
                    required: "Loan name is required.",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters required.",
                    },
                  })}
                />
                {errors.loan_name && (
                  <small className="text-danger">
                    {errors.loan_name.message}
                  </small>
                )}
              </div>

              <div className="mb-3">
                <label className="col-form-label">
                  Interest Rate (%) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control ${errors.interest_rate ? "is-invalid" : ""}`}
                  placeholder="Enter Interest Rate"
                  {...register("interest_rate", {
                    required: "Interest rate is required.",
                    min: {
                      value: 0,
                      message: "Must be non-negative.",
                    },
                    max: {
                      value: 100,
                      message: "Must be less than 100.",
                    },
                  })}
                />
                {errors.interest_rate && (
                  <small className="text-danger">
                    {errors.interest_rate.message}
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
