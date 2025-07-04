import moment from "moment";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addHolidayCalender,
  updateHolidayCalender,
} from "../../../../../redux/HolidayCalender";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.holidayCalender);
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
        holiday_name: initialData.holiday_name || "",
        holiday_date:
          new Date(initialData.holiday_date).toISOString() ||
          new Date().toISOString(),
        location: initialData.location || "",
        is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        holiday_name: "",
        location: "",
        holiday_date: new Date().toISOString(),
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_add_edit_holiday_calender_modal"
    );
    if (mode === "add") {
      dispatch(
        addHolidayCalender({
          holiday_name: data.holiday_name,
          holiday_date: data?.holiday_date || "",
          location: data?.location || "",
          is_active: data?.is_active || "Y",
        })
      );
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateHolidayCalender({
          id: initialData.id,
          reqData: {
            holiday_name: data.holiday_name,
            holiday_date: data?.holiday_date || "",
            location: data?.location || "",
            is_active: data?.is_active || "Y",
          },
        })
      );
    }
    reset();
    setSelected(null);
    closeButton.click();
  };

  return (
    <div
      className="modal fade"
      id="add_edit_holiday_calender_modal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add  Holiday" : "Edit Holiday"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_add_edit_holiday_calender_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="col-form-label">
                  Holiday Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.holiday_name ? "is-invalid" : ""}`}
                  placeholder="Enter Holiday Name"
                  {...register("holiday_name", {
                    required: "Holiday name is required.",
                    minLength: {
                      value: 3,
                      message: "Holiday name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.holiday_name && (
                  <small className="text-danger">
                    {errors.holiday_name.message}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label className="col-form-label">
                  Holiday Date<span className="text-danger">*</span>
                </label>
                <div className="mb-3 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-calendar-event" />
                  </span>
                  <Controller
                    name="holiday_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        placeholder="Select Holiday Date"
                        className="form-control"
                        value={
                          field.value
                            ? moment(field.value).format("DD-MM-YYYY")
                            : null
                        }
                        onChange={field.onChange}
                        dateFormat="DD-MM-YYYY"
                        selected={field.value}
                      />
                    )}
                  />
                </div>
                {errors.holiday_date && (
                  <small className="text-danger">
                    {errors.holiday_date.message}
                  </small>
                )}
              </div>
              {/* Location  */}
              <div className="mb-3">
                <label className="col-form-label">
                  Location<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.location ? "is-invalid" : ""}`}
                  placeholder="Enter Location"
                  {...register("location")}
                />
                {errors.location && (
                  <small className="text-danger">
                    {errors.location.message}
                  </small>
                )}
              </div>
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
