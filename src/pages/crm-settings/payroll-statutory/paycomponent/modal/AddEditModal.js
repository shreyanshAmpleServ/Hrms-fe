import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addpay_component,
  updatepay_component,
} from "../../../../../redux/pay-component";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.payComponent);

  const {
    register,
    handleSubmit,

    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  const dispatch = useDispatch();

  const isTaxable = watch("is_taxable") === "Y";
  const isStatutory = watch("is_statutory") === "Y";

  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        component_name: initialData.component_name || "",
        component_code: initialData.component_code || "",
        component_type: initialData.component_type || "",
        is_taxable: initialData.is_taxable || "",
        is_statutory: initialData.is_statutory || "",
        is_active: initialData.is_active,
      });
    } else {
      reset({
        component_name: "",
        component_code: "",
        component_type: "",
        is_taxable: "",
        is_statutory: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("Close_pay_component_modal");
    const finalData = {
      ...data,
    };
    if (mode === "add") {
      dispatch(addpay_component(finalData));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updatepay_component({
          id: initialData.id,
          pay_componentData: finalData,
        })
      );
    }
    reset();
    setSelected(null);
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_pay_component_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Pay Component" : "Edit Pay Component"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="Close_pay_component_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Component Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Component Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.component_name ? "is-invalid" : ""}`}
                  placeholder="Enter Component Name"
                  {...register("component_name", {
                    required: "Component name is required.",
                    minLength: {
                      value: 3,
                      message: "Component name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.component_name && (
                  <small className="text-danger">
                    {errors.component_name.message}
                  </small>
                )}
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Component Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.component_code ? "is-invalid" : ""}`}
                      placeholder="Enter Component Code"
                      {...register("component_code", {
                        required: "Component code is required.",
                        minLength: {
                          value: 3,
                          message:
                            "Component code must be at least 3 characters.",
                        },
                      })}
                    />
                    {errors.component_code && (
                      <small className="text-danger">
                        {errors.component_code.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Component Type <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.component_type ? "is-invalid" : ""}`}
                      placeholder="Enter Component Type"
                      {...register("component_type", {
                        required: "Component type is required.",
                        minLength: {
                          value: 3,
                          message:
                            "Component type must be at least 3 characters.",
                        },
                      })}
                    />
                    {errors.component_type && (
                      <small className="text-danger">
                        {errors.component_type.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                {/* Is Taxable */}
                <div className="col-md-6">
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="is_taxable"
                      checked={isTaxable}
                      onChange={(e) => {
                        setValue("is_taxable", e.target.checked ? "Y" : "N");
                      }}
                    />
                    <label className="form-check-label" htmlFor="is_taxable">
                      Is Taxable
                    </label>
                  </div>
                </div>

                {/* Is Statutory */}
                <div className="col-md-6">
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="is_statutory"
                      checked={isStatutory}
                      onChange={(e) => {
                        setValue("is_statutory", e.target.checked ? "Y" : "N");
                      }}
                    />
                    <label className="form-check-label" htmlFor="is_statutory">
                      Is Statutory
                    </label>
                  </div>
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
                  <small className="text-danger">
                    {errors.is_active.message}
                  </small>
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
