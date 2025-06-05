import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addlatter_type,
  updatelatter_type,
} from "../../../../../redux/letterType";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.letterTypeMaster);
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
        letter_name: initialData.letter_name || "",
        template_path: initialData.template_path || "",
      });
    } else {
      reset({
        letter_name: "",
        template_path: "",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_latter_type_modal");
    const formData = new FormData();
    formData.append("letter_name", data.letter_name);
    formData.append("template_path", data.template_path[0]);
    if (mode === "add") {
      dispatch(addlatter_type(formData));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updatelatter_type({
          id: initialData.id,
          latter_typeData: formData,
        })
      );
    }
    reset();
    setSelected(null);
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_latter_type_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Letter " : "Edit Letter"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_latter_type_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="col-form-label">
                  Latter Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Enter Latter Name"
                  {...register("letter_name", {
                    required: "Latter name is required.",
                    minLength: {
                      value: 3,
                      message: "Latter name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>

              <div className="mb-3">
                <label className="col-form-label">
                  Template Path <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className={`form-control ${errors.template_path ? "is-invalid" : ""}`}
                  {...register("template_path", {
                    required: "Template path is required.",
                  })}
                />
                {errors.template_path && (
                  <small className="text-danger">
                    {errors.template_path.message}
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
