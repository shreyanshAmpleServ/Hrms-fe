import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addassets_type,
  updateassets_type,
} from "../../../../../redux/assetType";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.assetTypeMaster);
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
        asset_type_name: initialData.asset_type_name || "",
        depreciation_rate: initialData.depreciation_rate || "",

      });
    } else {
      reset({
        asset_type_name: "",
        depreciation_rate: "",

      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_assets_type_modal");
    if (mode === "add") {
      dispatch(addassets_type(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateassets_type({
          id: initialData.id,
          assets_typeData: data,
        })
      );
    }
    reset();
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_assets_type_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Statutory Rates" : "Edit Statutory Rates"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_assets_type_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                {/* Country Code */}
                <div className="mb-3">
                  <label className="col-form-label">
                    Award Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.asset_type_name ? "is-invalid" : ""}`}
                    {...register("asset_type_name", {
                      required: "Country code is required.",
                    })}
                  />
                  {errors.country_code && (
                    <small className="text-danger">{errors.country_code.message}</small>
                  )}
                </div>

                {/* Lower Limit */}
                <div className=" mb-3">
                  <label className="col-form-label">
                    Description Rate <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.depreciation_rate ? "is-invalid" : ""}`}
                    {...register("depreciation_rate", {
                      required: "Lower limit is required.",
                    })}
                  />
                  {errors.depreciation_rate && (
                    <small className="text-danger">{errors.description.message}</small>
                  )}
                </div>

                {/* Statutory Type */}


                {/* Upper Limit */}


                {/* Rate Percent */}

              </div>

              {/* Status */}

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
