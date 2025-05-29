import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addassets_type,
  updateassets_type,
} from "../../../../../redux/assetType";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.assetTypeMaster);
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
    const closeButton = document.getElementById("close_asset_type_modal");
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
    setSelected(null);
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_assets_type_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Asset Type" : "Edit Asset Type"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_asset_type_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="col-form-label">
                  Asset Type Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.asset_type_name ? "is-invalid" : ""}`}
                  placeholder="Enter Asset Type Name"
                  {...register("asset_type_name", {
                    required: "Asset type name is required.",
                    minLength: {
                      value: 3,
                      message: "Asset type name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.asset_type_name && (
                  <small className="text-danger">
                    {errors.asset_type_name.message}
                  </small>
                )}
              </div>

              <div className="mb-3">
                <label className="col-form-label">
                  Depreciation Rate (%) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  className={`form-control ${errors.depreciation_rate ? "is-invalid" : ""}`}
                  placeholder="Enter Depreciation Rate"
                  {...register("depreciation_rate", {
                    required: "Depreciation rate is required.",
                    max: {
                      value: 100,
                      message: "Depreciation rate cannot exceed 100.",
                    },
                    min: {
                      value: 0,
                      message: "Depreciation rate cannot be negative.",
                    },
                  })}
                />
                {errors.depreciation_rate && (
                  <small className="text-danger">
                    {errors.depreciation_rate.message}
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
