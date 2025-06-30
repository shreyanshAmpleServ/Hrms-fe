import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addrating_scale,
  updaterating_scale,
} from "../../../../../redux/ratingScaleMaster";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.ratingScaleMaster);
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
        rating_value: initialData.rating_value || "",
        rating_description: initialData.rating_description || "",
        is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        rating_value: "",
        rating_description: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_rating_scale_modal");
    const finalData = {
      rating_value: Number(data?.rating_value),
      rating_description: data?.rating_description,
      is_active: data?.is_active,
    };
    if (mode === "add") {
      dispatch(addrating_scale(finalData));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updaterating_scale({
          id: initialData.id,
          rating_scaleData: finalData,
        })
      );
    }
    reset();
    setSelected(null);
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_rating_scale_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add  Rating Scale" : "Edit Rating Scale"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_rating_scale_modal"
              onClick={() => setSelected(null)}
            >
              <i className="ti ti-x" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                {/* Country Code */}
                <div className=" mb-3">
                  <label className="col-form-label">
                    Rating Value <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.rating_value ? "is-invalid" : ""}`}
                    placeholder="Enter Rating Value"
                    {...register("rating_value", {
                      required: "Rating value is required.",
                    })}
                  />
                  {errors.rating_value && (
                    <small className="text-danger">
                      {errors.rating_value.message}
                    </small>
                  )}
                </div>

                {/* Lower Limit */}
                <div className=" mb-3">
                  <label className="col-form-label">
                    Rating Description<span className="text-danger">*</span>
                  </label>
                  <textarea
                    type="text"
                    rows={3}
                    className={`form-control ${errors.rating_description ? "is-invalid" : ""}`}
                    placeholder="Enter Rating Description"
                    {...register("rating_description", {
                      required: "Rating description is required.",
                    })}
                  />
                  {errors.rating_description && (
                    <small className="text-danger">
                      {errors.rating_description.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label className="col-form-label">Status</label>
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <input
                      type="radio"
                      className="status-radio"
                      id="active"
                      value="Y"
                      {...register("is_active")}
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
