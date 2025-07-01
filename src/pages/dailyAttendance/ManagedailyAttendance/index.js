import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createdailyAttendance,
  updatedailyAttendance,
} from "../../../redux/dailyAttendance"; // Ensure this slice exists

const ManagedailyAttendance = ({ setAttendance, dailyAttendance }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    shouldFocusError: false,
  });

  const { loading } = useSelector((state) => state.dailyAttendance || {});
  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {}
  );

  const statusOptions = [
    { value: "Present", label: "Present" },
    { value: "Absent", label: "Absent" },
    { value: "Half Day", label: "Half Day" },
    { value: "Late", label: "Late" },
  ];

  const employees = employee?.data?.map((i) => ({
    label: `${i.full_name}`,
    value: i?.id,
  }));

  React.useEffect(() => {
    if (dailyAttendance) {
      // Edit mode
      reset({
        employee_id: dailyAttendance?.employee_id || "",
        attendance_date: dailyAttendance?.attendance_date
          ? new Date(dailyAttendance.attendance_date)
          : new Date(),
        check_in_time: dailyAttendance?.check_in_time
          ? new Date(dailyAttendance.check_in_time)
          : null,
        check_out_time: dailyAttendance?.check_out_time
          ? new Date(dailyAttendance.check_out_time)
          : null,
        // status:
        //   statusOptions.find((opt) => opt.value === dailyAttendance?.status) ||
        //   null,
        status: dailyAttendance.status || "",
        remarks: dailyAttendance?.remarks || "",
      });
    } else {
      // Add mode – blank form
      reset({
        employee_id: "",
        attendance_date: new Date(),
        check_in_time: null,
        check_out_time: null,
        status: "",
        remarks: "",
      });
    }
  }, [dailyAttendance, reset]);

  useEffect(() => {
    dispatch(fetchEmployee({ search: searchValue, is_active: true }));
  }, [dispatch, searchValue]);

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      dailyAttendance
        ? await dispatch(
            updatedailyAttendance({
              id: dailyAttendance.id,
              dailyAttendanceData: data,
            })
          ).unwrap()
        : await dispatch(createdailyAttendance(data)).unwrap();
      closeButton.click();
      reset();
      setAttendance(null);
    } catch (error) {
      closeButton.click();
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setAttendance(null);
      };
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose
      );
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleModalClose
        );
      };
    }
  }, [setAttendance]);
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{dailyAttendance ? "Update" : "Add "} Daily Attendance</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => {
            setAttendance(null);
            reset();
          }}
        >
          <i className="ti ti-x" />
        </button>
      </div>

      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {/* Employee */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Employee <span className="text-danger">*</span>
              </label>
              <Controller
                name="employee_id"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => {
                  const selected = employees?.find(
                    (emp) => emp.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      options={employees}
                      placeholder="Select Employee"
                      isLoading={employeeLoading}
                      value={selected || null}
                      onInputChange={setSearchValue}
                      onChange={(option) => field.onChange(option.value)}
                      classNamePrefix="react-select"
                    />
                  );
                }}
              />
              {errors.employee_id && (
                <small className="text-danger">
                  {errors.employee_id.message}
                </small>
              )}
            </div>

            {/* Attendance Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Attendance Date <span className="text-danger">*</span>
              </label>
              <Controller
                name="attendance_date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                    placeholderText="Select date"
                  />
                )}
              />
              {errors.attendance_date && (
                <small className="text-danger">
                  {errors.attendance_date.message}
                </small>
              )}
            </div>

            {/* Check-in */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Check-In Time <span className="text-danger">*</span>
              </label>
              <Controller
                name="check_in_time"
                control={control}
                rules={{ required: "Check-in time is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="hh:mm aa"
                    placeholderText="Select Time"
                    className="form-control"
                  />
                )}
              />
              {errors.check_in_time && (
                <small className="text-danger">
                  {errors.check_in_time.message}
                </small>
              )}
            </div>

            {/* Check-out */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Check-Out Time <span className="text-danger">*</span>
              </label>
              <Controller
                name="check_out_time"
                control={control}
                rules={{ required: "Check-out time is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="hh:mm aa"
                    placeholderText="Select Time"
                    className="form-control"
                  />
                )}
              />
              {errors.check_out_time && (
                <small className="text-danger">
                  {errors.check_out_time.message}
                </small>
              )}
            </div>

            {/* Status */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Status <span className="text-danger">*</span>
              </label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={statusOptions}
                    placeholder="Select Status"
                    value={statusOptions.find(
                      (opt) => opt.value === field.value
                    )}
                    onChange={(option) => field.onChange(option.value)}
                    classNamePrefix="react-select"
                  />
                )}
              />
              {errors.status && (
                <small className="text-danger">{errors.status.message}</small>
              )}
            </div>

            {/* Remarks */}
            <div className="col-md-12 mb-3">
              <label className="col-form-label">
                Remarks <span className="text-muted">(max 255 characters)</span>
              </label>
              <Controller
                name="remarks"
                control={control}
                rules={{
                  maxLength: {
                    value: 255,
                    message:
                      "Remarks must be less than or equal to 255 characters",
                  },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="form-control"
                    placeholder="Enter Remarks"
                    rows={3}
                    maxLength={255}
                  />
                )}
              />
              {errors.remarks && (
                <small className="text-danger">{errors.remarks.message}</small>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {dailyAttendance
                ? loading
                  ? "Updating..."
                  : "Update"
                : loading
                  ? "Creating..."
                  : "Create"}
              {loading && (
                <div
                  className="spinner-border text-light ms-2"
                  style={{ height: "15px", width: "15px" }}
                  role="status"
                />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagedailyAttendance;
