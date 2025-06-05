import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addShift, updateShift } from "../../../../../redux/Shift";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TimePicker } from "antd";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.shift);
  dayjs.extend(customParseFormat);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        shift_name: initialData.shift_name || "",
        start_time: dayjs(initialData.start_time) || "",
        end_time: dayjs(initialData.end_time) || "",
      });
    } else {
      reset({
        shift_name: "",
        start_time: "",
        end_time: "",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_add_edit_shift_modal",
    );
    if (mode === "add") {
      dispatch(
        addShift({
          shift_name: data.shift_name,
          start_time: data.start_time,
          end_time: data.end_time,
        }),
      );
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateShift({
          id: initialData.id,
          ShiftData: {
            shift_name: data.shift_name,
            start_time: data.start_time,
            end_time: data.end_time,
          },
        }),
      );
    }
    reset();
    setSelected(null);
    closeButton.click();
  };

  return (
    <div className="modal fade" id="add_edit_shift_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Shift" : "Edit Shift"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_add_edit_shift_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Shift Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Shift Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.shift_name ? "is-invalid" : ""}`}
                  placeholder="Enter Shift Name"
                  {...register("shift_name", {
                    required: "Shift name is required.",
                    minLength: {
                      value: 3,
                      message: "Shift name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.shift_name && (
                  <small className="text-danger">
                    {errors.shift_name.message}
                  </small>
                )}
              </div>
              <div className="row col-12">
                {/* Start time */}
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
                          placeholder="Select Start Time"
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
                  {errors.start_time && (
                    <small className="text-danger">
                      {errors.start_time.message}
                    </small>
                  )}
                </div>
                {/* End time */}
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
                          placeholder="Select End Time"
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
