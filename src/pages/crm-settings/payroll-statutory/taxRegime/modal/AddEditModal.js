import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addtax_relief, updatetax_relief } from "../../../../../redux/taxRelief";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.taxRelief);

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
        relief_name: initialData.relief_name || "",
        amount: initialData.amount || "",
        // is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        relief_name: "",
        amount: "",
        // is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_tax_relief_modal");
    if (mode === "add") {
      dispatch(addtax_relief(data));
    } else if (mode === "edit" && initialData) {
      dispatch(updatetax_relief({ id: initialData.id, tax_reliefData: data }));
    }
    reset();
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_tax_relief_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Tax Relirf" : "Edit Tax Relirf"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_tax_relief_modal"
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
                    Relief Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    {...register("relief_name", {
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
                    Amount <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    {...register("amount", {
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
