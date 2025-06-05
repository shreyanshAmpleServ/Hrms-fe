import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addCurrencies, updateCurrencies } from "../../../../../redux/currency";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.currencies);

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
        currency_name: initialData.currency_name || "",
        currency_code: initialData.currency_code || "",
      });
    } else {
      reset({ currency_name: "", currency_code: "" });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_Currencies_modal");
    if (mode === "add") {
      dispatch(addCurrencies(data));
    } else if (mode === "edit" && initialData) {
      dispatch(updateCurrencies({ id: initialData.id, CurrenciesData: data }));
    }
    reset();
    setSelected(null);
    closeButton?.click();
  };
  return (
    <div className="modal fade" id="add_edit_currencies_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add  Currencies" : "Edit Currencies"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_Currencies_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                <div className=" mb-3">
                  <label className="col-form-label">
                    Currency Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Enter Currency Name"
                    {...register("currency_name", {
                      required: "Currency name is required.",
                      minLength: {
                        value: 3,
                        message: "Currency name must be at least 3 characters.",
                      },
                    })}
                  />
                  {errors.currency_name && (
                    <small className="text-danger">
                      {errors.currency_name.message}
                    </small>
                  )}
                </div>
                <div className=" mb-3">
                  <label className="col-form-label">
                    Currency Code <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.currency_code ? "is-invalid" : ""}`}
                    placeholder="Enter Currency Code"
                    {...register("currency_code", {
                      required: "Currency code is required.",
                      minLength: {
                        value: 3,
                        message: "Currency code must be at least 3 characters.",
                      },
                    })}
                  />
                  {errors.currency_code && (
                    <small className="text-danger">
                      {errors.currency_code.message}
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
