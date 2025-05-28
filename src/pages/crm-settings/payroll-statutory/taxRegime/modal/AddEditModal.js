import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addtax_relief,
  updatetax_relief,
} from "../../../../../redux/taxRelief";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.taxRelief);

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
        relief_name: initialData.relief_name || "",
        amount: initialData.amount || "",
      });
    } else {
      reset({
        relief_name: "",
        amount: "",
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
    setSelected(null);
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_tax_relief_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Tax Relief" : "Edit Tax Relief"}
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
              <div className="row">
                <div className=" mb-3">
                  <label className="col-form-label">
                    Tax Relief Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.relief_name ? "is-invalid" : ""}`}
                    placeholder="Enter Tax Relief Name"
                    {...register("relief_name", {
                      required: "Tax Relief name is required.",
                      minLength: {
                        value: 3,
                        message:
                          "Tax Relief name must be at least 3 characters.",
                      },
                    })}
                  />
                  {errors.relief_name && (
                    <small className="text-danger">
                      {errors.relief_name.message}
                    </small>
                  )}
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Amount <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                    placeholder="Enter Amount"
                    {...register("amount", {
                      required: "Amount is required.",
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: "Amount must be at least 1.",
                      },
                    })}
                  />
                  {errors.amount && (
                    <small className="text-danger">
                      {errors.amount.message}
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
