import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  addleave_application,
  updateleave_application,
} from "../../../redux/leaveApplication";
import { fetchLeaveType } from "../../../redux/LeaveType";
import { fetchEmployee } from "../../../redux/Employee";
import moment from "moment";
import DatePicker from "react-datepicker";

const AddEditModal = ({ contact, mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.leave_Applications);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  // Fetch data
  useEffect(() => {
    dispatch(fetchEmployee());
    dispatch(fetchLeaveType());
  }, [dispatch]);

  const employee = useSelector((state) => state.employee.employee);
  const leaveType = useSelector((state) => state.leaveType.leaveType);

  // Employee dropdown list
  const EmployeeList = useMemo(
    () =>
      employee?.data?.map((item) => ({
        value: item.id,
        label: item.full_name,
      })) || [],
    [employee]
  );

  // Leave Type dropdown list
  const LeaveTypeList = useMemo(
    () =>
      leaveType?.data?.map((item) => ({
        value: item.id,
        label: item.leave_type,
      })) || [],
    [leaveType]
  );

  const Status = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  // Reset values on edit or add
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        employee_id: initialData.employee_id || "",
        leave_type_id: initialData.leave_type_id || "",
        start_date: initialData.start_date
          ? new Date(initialData.start_date).toISOString().split("T")[0]
          : "",
        end_date: initialData.end_date
          ? new Date(initialData.end_date).toISOString().split("T")[0]
          : "",
        reason: initialData.reason || "",
        status: initialData.status || "",
      });
    } else {
      reset({
        employee_id: "",
        leave_type_id: "",
        start_date: "",
        end_date: "",
        reason: "",
        status: "",
      });
    }
  }, [mode, initialData, reset]);

  // Submit handler
  const onSubmit = (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');

    const formattedData = {
      ...data,
      start_date: data.start_date ? new Date(data.start_date) : null,
      end_date: data.end_date ? new Date(data.end_date) : null,
    };

    if (mode === "add") {
      dispatch(addleave_application(formattedData));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateleave_application({
          id: initialData.id,
          leave_applicationData: formattedData,
        })
      );
    }

    reset();
    closeButton?.click();
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById(
      "add_edit_leave_application_modal"
    );
    if (offcanvasElement) {
      const handleModalClose = () => {
        // Clean up state if needed
      };
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose
      );
      return () =>
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleModalClose
        );
    }
  }, []);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="add_edit_leave_application_modal"
      // aria-labelledby="offcanvasLabel"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {contact ? "Update" : "Add"} Leave Applications
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)} className="row">
          {/* Department */}
          {/* Employee */}
          <div className="col-md-6">
            <label className="col-form-label">
              Employee <span className="text-danger">*</span>
            </label>
            <Controller
              name="employee_id"
              control={control}
              rules={{ required: "Employee is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={EmployeeList}
                  placeholder="Choose Employee"
                  isDisabled={!EmployeeList.length}
                  classNamePrefix="react-select"
                  className="select2"
                  onChange={(option) => field.onChange(option?.value || "")}
                  value={EmployeeList.find(
                    (option) => option.value === watch("employee_id")
                  )}
                />
              )}
            />
            {errors.employee_id && (
              <small className="text-danger">
                {errors.employee_id.message}
              </small>
            )}
          </div>

          {/* Leave Type */}
          <div className="col-md-6">
            <label className="col-form-label">
              Leave Type <span className="text-danger">*</span>
            </label>
            <Controller
              name="leave_type_id"
              control={control}
              rules={{ required: "Leave type is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={LeaveTypeList}
                  placeholder="Choose Leave Type"
                  isDisabled={!LeaveTypeList.length}
                  classNamePrefix="react-select"
                  className="select2"
                  onChange={(option) => field.onChange(option?.value || "")}
                  value={LeaveTypeList.find(
                    (option) => option.value === watch("leave_type_id")
                  )}
                />
              )}
            />
            {errors.leave_type_id && (
              <small className="text-danger">
                {errors.leave_type_id.message}
              </small>
            )}
          </div>

          {/* Start Date */}
          <div className="col-md-6 mb-3 mt-2">
            <label className="form-label">Start Date</label>
            <Controller
              name="start_date"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={
                    field.value ? moment(field.value).format("DD-MM-YYYY") : ""
                  }
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                  className="form-control"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Start Date"
                />
              )}
            />
            {errors.start_date && (
              <small className="text-danger">{errors.start_date.message}</small>
            )}
          </div>

          {/* End Date */}
          <div className="col-md-6 mb-3 mt-2">
            <label className="form-label">End Date</label>
            <Controller
              name="end_date"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={
                    field.value ? moment(field.value).format("DD-MM-YYYY") : ""
                  }
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                  className="form-control"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select  End Date"
                />
              )}
            />
            {errors.end_date && (
              <small className="text-danger">{errors.end_date.message}</small>
            )}
          </div>

          {/* Status */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Status</label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Approved Status is required" }}
              render={({ field }) => {
                const selectedDeal = Status?.find(
                  (employee) => employee.value === field.value
                );
                return (
                  <Select
                    {...field}
                    className="select"
                    options={Status}
                    placeholder="Select  Status"
                    value={selectedDeal || null}
                    classNamePrefix="react-select"
                    onChange={(selectedOption) =>
                      field.onChange(selectedOption.value)
                    }
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                      }),
                    }}
                  />
                );
              }}
            />
            {errors.status && (
              <small className="text-danger">{errors.status.message}</small>
            )}
          </div>

          {/* reason */}
          <div className="col-md-12 mb-3">
            <label className="form-label">
              Reason <small className="text-muted">(Max 255 characters)</small>
            </label>
            <Controller
              name="reason"
              control={control}
              rules={{
                required: "reason is required!",
                maxLength: {
                  value: 255,
                  message:
                    "reason must be less than or equal to 255 characters",
                },
              }}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  maxLength={255}
                  className="form-control"
                  placeholder="Enter reason "
                />
              )}
            />
            {/* {errors.reason && (
              <small className="text-danger">{errors.reason.message}</small>
            )} */}
          </div>

          <div className="col-md-12 text-end">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
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
        </form>
      </div>
    </div>
  );
};

export default AddEditModal;
