import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { addleave_application, updateleave_application } from "../../../redux/leaveApplication";
import { fetchLeaveType } from "../../../redux/LeaveType";
import { fetchEmployee } from "../../../redux/Employee";

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
    const offcanvasElement = document.getElementById("add_edit_leave_application_modal");
    if (offcanvasElement) {
      const handleModalClose = () => {
        // Clean up state if needed
      };
      offcanvasElement.addEventListener("hidden.bs.offcanvas", handleModalClose);
      return () => offcanvasElement.removeEventListener("hidden.bs.offcanvas", handleModalClose);
    }
  }, []);

  return (
    <div className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="add_edit_leave_application_modal"
    // aria-labelledby="offcanvasLabel"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">{contact ? "Update" : "Add New"}  Leave Applications</h5>
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
              <small className="text-danger">{errors.employee_id.message}</small>
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
              <small className="text-danger">{errors.leave_type_id.message}</small>
            )}
          </div>

          {/* Start Date */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              {...register("start_date", { required: "Start date is required" })}
            />
            {errors.start_date && (
              <small className="text-danger">{errors.start_date.message}</small>
            )}
          </div>

          {/* End Date */}
          <div className="col-md-6 mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              {...register("end_date", { required: "End date is required" })}
            />
            {errors.end_date && (
              <small className="text-danger">{errors.end_date.message}</small>
            )}
          </div>

          {/* reason */}
          <div className="col-md-12 mb-3">
            <label className="form-label">Reason</label>
            <textarea
              className="form-control"
              rows={3}
              {...register("reason", { required: "reason is required" })}
            />
            {errors.reason && (
              <small className="text-danger">{errors.reason.message}</small>
            )}
          </div>

          {/* Status */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              {...register("status", { required: "Status is required" })}
              defaultValue=""
            >
              <option value="">Select</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            {errors.status && (
              <small className="text-danger">{errors.status.message}</small>
            )}
          </div>



          <div className="col-md-12 text-end">
            <button type="button" className="btn btn-light me-2" data-bs-dismiss="offcanvas">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (mode === "add" ? "Creating..." : "Updating...") : mode === "add" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditModal;
