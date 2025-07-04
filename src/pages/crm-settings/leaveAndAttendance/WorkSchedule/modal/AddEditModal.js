import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addWorkScheduleTemp,
  updateWorkScheduleTemp,
} from "../../../../../redux/WorkScheduleTemp";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.WorkScheduleTemp);
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
        template_name: initialData.template_name || "",
        description: initialData.description || "",
        is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        template_name: "",
        description: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_add_edit_work_schedule_modal"
    );

    if (mode === "add") {
      dispatch(
        addWorkScheduleTemp({
          template_name: data.template_name,
          description: data?.description || "",
          is_active: data?.is_active || "Y",
        })
      );
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateWorkScheduleTemp({
          id: initialData.id,
          reqData: {
            template_name: data.template_name,
            description: data?.description || "",
            is_active: data?.is_active || "Y",
          },
        })
      );
    }
    reset(); // Clear the form
    setSelected(null);
    closeButton.click();
  };

  return (
    <div className="modal fade" id="add_edit_work_schedule_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add Work Schedule" : "Edit Work Schedule"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_add_edit_work_schedule_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/*Temp name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Template Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.template_name ? "is-invalid" : ""}`}
                  placeholder="Enter Template Name"
                  {...register("template_name", {
                    required: "Template name is required.",
                    minLength: {
                      value: 3,
                      message: "Template name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.template_name && (
                  <small className="text-danger">
                    {errors.template_name.message}
                  </small>
                )}
              </div>

              {/* description  */}
              <div className="mb-3">
                <label className="col-form-label">
                  Description<span className="text-danger">*</span>
                </label>
                <textarea
                  rows={3}
                  type="text"
                  className={`form-control ${errors.description ? "is-invalid" : ""}`}
                  placeholder="Enter Description"
                  {...register("description", {
                    required: "Description is required.",
                    minLength: {
                      value: 3,
                      message: "Description must be at least 3 characters.",
                    },
                  })}
                />
                {errors.description && (
                  <small className="text-danger">
                    {errors.description.message}
                  </small>
                )}
              </div>
              {/* <div className="row col-12">
              <div className="mb-3 col-lg-6">
                <label className="col-form-label">
                  Start Time <span className="text-danger">*</span>
                </label>
                <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-clock-hour-10" />
                    </span>
                    <Controller
                      name="start_time"
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          {...field}
                          placeholder="Select Time"
                          className="form-control"
                          value={
                            field.value ? dayjs(field.value, "HH:mm:ss") : null
                          }
                          selected={field.value}
                          onChange={field.onChange}
                          dateFormat="HH:mm:ss"
                        />
                      )}
                    />
                  </div>
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>
              <div className="mb-3 col-lg-6">
                <label className="col-form-label">
                  End Time <span className="text-danger">*</span>
                </label>
                <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-clock-hour-10" />
                    </span>
                    <Controller
                      name="end_time"
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          {...field}
                          placeholder="Select Time"
                          className="form-control"
                          value={
                            field.value ? dayjs(field.value, "HH:mm:ss") : null
                          }
                          selected={field.value}
                          onChange={field.onChange}
                          dateFormat="HH:mm:ss"
                        />
                      )}
                    />
                  </div>
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>
              </div> */}
              {/* Status */}
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
