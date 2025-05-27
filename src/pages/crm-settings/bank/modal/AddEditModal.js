import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addbank, updatebank } from "../../../../redux/bank";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.bank);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({ bank_name: initialData.bank_name || "" });
    } else {
      reset({ bank_name: "" });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_bank_modal");
    if (mode === "add") {
      dispatch(addbank(data));
    } else if (mode === "edit" && initialData) {
      dispatch(updatebank({ id: initialData.id, ankData: data }));
    }
    reset();
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_bank_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Bank" : "Edit Bank"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_bank_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="col-form-label">
                  Bank Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.bank_name ? "is-invalid" : ""}`}
                  placeholder="Enter Bank Name"
                  {...register("bank_name", {
                    required: "Bank name is required.",
                    minLength: {
                      value: 3,
                      message: "Bank name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.bank_name && (
                  <small className="text-danger">
                    {errors.bank_name.message}
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
