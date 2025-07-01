import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import { fetchdepartment } from "../../../../../redux/department";
import { addShift, updateShift } from "../../../../../redux/Shift";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.shift);
  dayjs.extend(customParseFormat);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const dispatch = useDispatch();
  const { department } = useSelector((state) => state.department);
  const departmentOptions = department?.data?.map((department) => ({
    label: department.department_name,
    value: department.id,
  }));

  useEffect(() => {
    dispatch(fetchdepartment());
  }, [dispatch]);

  const watchHalfDayWorking = watch("half_day_working");
  const halfDayOnOptions = [
    { label: "Monday", value: "1" },
    { label: "Tuesday", value: "2" },
    { label: "Wednesday", value: "3" },
    { label: "Thursday", value: "4" },
    { label: "Friday", value: "5" },
    { label: "Saturday", value: "6" },
    { label: "Sunday", value: "7" },
  ];

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        shift_name: initialData.shift_name || "",
        start_time: initialData.start_time
          ? initialData.start_time
          : new Date("2025-01-01 09:00:00").toLocaleTimeString(),
        end_time: initialData.end_time
          ? initialData.end_time
          : new Date("2025-01-01 18:00:00").toLocaleTimeString(),
        lunch_time: initialData.lunch_time || "",
        daily_working_hours: initialData.daily_working_hours || "",
        department_id: initialData.department_id || "",
        number_of_working_days: initialData.number_of_working_days || "",
        half_day_working: initialData.half_day_working || "N",
        half_day_on: initialData.half_day_on || "",
        remarks: initialData.remarks || "",
        is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        shift_name: "",
        start_time: new Date("2025-01-01 09:00:00").toLocaleTimeString(),
        end_time: new Date("2025-01-01 18:00:00").toLocaleTimeString(),
        lunch_time: "",
        daily_working_hours: "",
        department_id: "",
        number_of_working_days: "",
        half_day_working: "N",
        half_day_on: "",
        remarks: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  useEffect(() => {
    if (watchHalfDayWorking === "N") {
      setValue("half_day_on", "");
    }
  }, [watchHalfDayWorking, setValue]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_add_edit_shift_modal"
    );

    const formattedData = {
      ...data,
      start_time: data.start_time ? data.start_time : "",
      end_time: data.end_time ? data.end_time : "",
      half_day_on: data.half_day_working === "N" ? null : data.half_day_on,
    };

    if (mode === "add") {
      dispatch(addShift(formattedData));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateShift({
          id: initialData.id,
          ShiftData: formattedData,
        })
      );
    }
    reset();
    setSelected(null);
    closeButton.click();
  };

  return (
    <div className="modal fade" id="add_edit_shift_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add Shift" : "Edit Shift"}
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
            <div
              className="modal-body"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
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

              <div className="row">
                {/* Start time */}
                <div className="mb-3 col-lg-6">
                  <label className="col-form-label">
                    Start Time <span className="text-danger">*</span>
                  </label>
                  <div className="icon-form">
                    <span className="form-icon">
                      <i className="ti ti-clock-hour-10" />
                    </span>
                    <Controller
                      name="start_time"
                      control={control}
                      rules={{ required: "Start time is required." }}
                      render={({ field }) => (
                        <ReactDatePicker
                          {...field}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          placeholder="Select Start Time"
                          className={`form-control ${errors.start_time ? "is-invalid" : ""}`}
                          value={field.value}
                          onChange={(date) =>
                            field.onChange(date.toLocaleTimeString())
                          }
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
                  <div className="icon-form">
                    <span className="form-icon">
                      <i className="ti ti-clock-hour-10" />
                    </span>
                    <Controller
                      name="end_time"
                      control={control}
                      rules={{ required: "End time is required." }}
                      render={({ field }) => (
                        <ReactDatePicker
                          {...field}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          placeholder="Select End Time"
                          className={`form-control ${errors.end_time ? "is-invalid" : ""}`}
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(date.toLocaleTimeString());
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.end_time && (
                    <small className="text-danger">
                      {errors.end_time.message}
                    </small>
                  )}
                </div>

                {/* Department */}
                <div className="mb-3 col-lg-6">
                  <label className="col-form-label">
                    Department <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="department_id"
                    control={control}
                    rules={{ required: "Department is required." }}
                    render={({ field }) => (
                      <ReactSelect
                        {...field}
                        options={departmentOptions}
                        placeholder="Select Department"
                        classNamePrefix="react-select"
                        className={errors.department_id ? "is-invalid" : ""}
                        value={
                          field.value
                            ? {
                                label: departmentOptions.find(
                                  (option) => option.value === field.value
                                )?.label,
                                value: field.value,
                              }
                            : null
                        }
                        onChange={(opt) => field.onChange(opt?.value)}
                      />
                    )}
                  />
                  {errors.department_id && (
                    <small className="text-danger">
                      {errors.department_id.message}
                    </small>
                  )}
                </div>

                {/* Number of working days */}
                <div className="mb-3 col-lg-6">
                  <label className="col-form-label">
                    Number of Working Days{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.number_of_working_days ? "is-invalid" : ""}`}
                    placeholder="Enter Number of Working Days"
                    {...register("number_of_working_days", {
                      required: "Number of working days is required.",
                      min: {
                        value: 1,
                        message: "Number of working days must be at least 1.",
                      },
                      max: {
                        value: 7,
                        message: "Number of working days must be at most 7.",
                      },
                    })}
                  />
                  {errors.number_of_working_days && (
                    <small className="text-danger">
                      {errors.number_of_working_days.message}
                    </small>
                  )}
                </div>

                {/* Daily working hours */}
                <div className="mb-3 col-lg-6">
                  <label className="col-form-label">
                    Daily Working Hours <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    className={`form-control ${errors.daily_working_hours ? "is-invalid" : ""}`}
                    placeholder="Enter Daily Working Hours"
                    {...register("daily_working_hours", {
                      required: "Daily working hours is required.",
                      min: {
                        value: 1,
                        message: "Daily working hours must be at least 1.",
                      },
                      max: {
                        value: 24,
                        message: "Daily working hours cannot exceed 24.",
                      },
                    })}
                  />
                  {errors.daily_working_hours && (
                    <small className="text-danger">
                      {errors.daily_working_hours.message}
                    </small>
                  )}
                </div>

                {/* Lunch time */}
                <div className="mb-3 col-lg-6">
                  <label className="col-form-label">
                    Lunch Time (minutes) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.lunch_time ? "is-invalid" : ""}`}
                    placeholder="Enter Lunch Time in minutes"
                    {...register("lunch_time", {
                      required: "Lunch time is required.",
                      min: {
                        value: 0,
                        message: "Lunch time cannot be negative.",
                      },
                      max: {
                        value: 120,
                        message: "Lunch time cannot exceed 120 minutes.",
                      },
                    })}
                  />
                  {errors.lunch_time && (
                    <small className="text-danger">
                      {errors.lunch_time.message}
                    </small>
                  )}
                </div>

                {/* Half day working */}
                <div className="mb-3 col-lg-6 d-flex align-items-center">
                  <Controller
                    name="half_day_working"
                    control={control}
                    render={({ field }) => (
                      <div className="form-check form-switch">
                        <input
                          type="checkbox"
                          className="form-check-input form-switch"
                          {...field}
                          checked={field.value === "Y"}
                          onChange={(e) =>
                            field.onChange(e.target.checked ? "Y" : "N")
                          }
                        />
                        <label className="form-check-label ms-2">
                          Half Day Working
                        </label>
                      </div>
                    )}
                  />
                </div>

                {/* Half day on - Only show if half day working is enabled */}
                {watchHalfDayWorking === "Y" && (
                  <div className="mb-3 col-lg-6">
                    <label className="col-form-label">
                      Half Day On <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="half_day_on"
                      control={control}
                      rules={
                        watchHalfDayWorking === "Y"
                          ? { required: "Please select half day." }
                          : {}
                      }
                      render={({ field }) => (
                        <ReactSelect
                          {...field}
                          options={halfDayOnOptions}
                          placeholder="Select Half Day On"
                          classNamePrefix="react-select"
                          className={errors.half_day_on ? "is-invalid" : ""}
                          value={
                            field.value
                              ? {
                                  label: halfDayOnOptions.find(
                                    (option) => option.value === field.value
                                  )?.label,
                                  value: field.value,
                                }
                              : null
                          }
                          onChange={(opt) => field.onChange(opt?.value)}
                        />
                      )}
                    />
                    {errors.half_day_on && (
                      <small className="text-danger">
                        {errors.half_day_on.message}
                      </small>
                    )}
                  </div>
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

              {/* Remarks */}
              <div className="mb-3">
                <label className="col-form-label">
                  Remarks{" "}
                  <span className="text-muted">(Max 255 characters)</span>
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter remarks (optional)"
                  {...register("remarks", {
                    maxLength: {
                      value: 255,
                      message: "Remarks must be less than 255 characters.",
                    },
                  })}
                />
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
