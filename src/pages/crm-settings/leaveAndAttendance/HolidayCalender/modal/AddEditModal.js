import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addHolidayCalender, updateHolidayCalender } from "../../../../../redux/HolidayCalender";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.holidayCalender);
  dayjs.extend(customParseFormat);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        holiday_name: initialData.holiday_name || "",
        holiday_date:  new Date(initialData.holiday_date) || "",
        location: initialData.location || "",
      });
    } else {
      reset({
        name: "",
        location: "",
        holiday_date:new Date(),
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_add_edit_holiday_calender_modal",
    );
    console.log("DAta",data)
    if (mode === "add") {
      // Dispatch Add action
      dispatch(
        addHolidayCalender({
          holiday_name: data.holiday_name,
           holiday_date:data?.holiday_date || "",
           location:data?.location || "",
        }),
      );
    } else if (mode === "edit" && initialData) {
      // Dispatch Edit action
      dispatch(
        updateHolidayCalender({
          id: initialData.id,
          reqData: { 
            holiday_name: data.holiday_name,
          holiday_date:data?.holiday_date || "",
          location:data?.location || "",
         },
        }),
      );
    }
    reset(); // Clear the form
    closeButton.click();
  };

  return (
    <div className="modal fade" id="add_edit_holiday_calender_modal" role="dialog">
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
              id="close_btn_add_edit_holiday_calender_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Shift Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Leave Type <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("holiday_name", {
                    required: "Shift name is required.",
                    minLength: {
                      value: 3,
                      message: "Shift name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.holiday_name && (
                  <small className="text-danger">{errors.holiday_name.message}</small>
                )}
              </div>
               {/* Holiday Date  */}
                 <div className="mb-3">
                <label className="col-form-label">
                  Holiday Date<span className="text-danger">*</span>
                </label>
                <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-clock-hour-10" />
                    </span>
                    <Controller
                      name="start_time"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          placeholder="Select Date"
                          className="form-control"
                          value={
                            field.value
                              ? dayjs(field.value, "dd-MM-yyyy")
                              : null
                          }
                          onChange={field.onChange}
                          dateFormat="dd-MM-yyyy"
                          selected={field.value}
                        />
                      )}
                    />
                  </div>
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>
              {/* Location  */}
              <div className="mb-3">
                <label className="col-form-label">
                  Location<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("location")}
                />
                {errors.location && (
                  <small className="text-danger">{errors.location.message}</small>
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
