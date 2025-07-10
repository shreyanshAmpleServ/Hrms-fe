import moment from "moment";
import React, { useEffect, useMemo } from "react";
import { Placeholder } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import {
  addleave_application,
  updateleave_application,
} from "../../../redux/leaveApplication";
import { fetchLeaveBalanceByEmployee } from "../../../redux/leaveBalance";
import { fetchLeaveType } from "../../../redux/LeaveType";

const AddEditModal = ({ contact, mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.leave_Applications);
  const dispatch = useDispatch();
  const { leaveBalanceByEmployee, loading: leaveBalanceLoading } = useSelector(
    (state) => state.leaveBalance
  );

  const {
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    dispatch(fetchLeaveType({ is_active: true }));
  }, [dispatch]);

  const leaveType = useSelector((state) => state.leaveType.leaveType);

  const LeaveTypeList = useMemo(
    () =>
      leaveType?.data?.map((item) => ({
        value: item.id,
        label: item.leave_type,
      })) || [],
    [leaveType]
  );

  useEffect(() => {
    if (watch("employee_id") && watch("leave_type_id")) {
      dispatch(
        fetchLeaveBalanceByEmployee({
          employeeId: watch("employee_id"),
          leaveTypeId: watch("leave_type_id"),
        })
      );
    }
  }, [watch("employee_id"), watch("leave_type_id"), dispatch]);

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
        status: initialData.status || "P",
        contact_details_during_leave:
          initialData.contact_details_during_leave || "",
        approval_date: initialData.approval_date || "",
        document_attachment: initialData.document_attachment || null,
        rejection_reason: initialData.rejection_reason || "",
        backup_person_id: initialData.backup_person_id || "",
        approver_id: initialData.approver_id || "",
      });
    } else {
      reset({
        employee_id: "",
        leave_type_id: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: new Date().toISOString().split("T")[0],
        reason: "",
        status: "P",
        contact_details_during_leave: "",
        approval_date: "",
        document_attachment: null,
        rejection_reason: "",
        backup_person_id: "",
        approver_id: "",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    const resumeFile = data.document_attachment?.[0];

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === "document_attachment") {
          formData.append(key, resumeFile);
        } else if (data[key] instanceof Date) {
          formData.append(key, new Date(data[key]).toISOString());
        } else {
          formData.append(
            key,
            typeof data[key] === "object"
              ? JSON.stringify(data[key])
              : data[key]
          );
        }
      }
    });

    if (mode === "add") {
      dispatch(addleave_application(formData));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateleave_application({
          id: initialData.id,
          leave_applicationData: formData,
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
      const handleModalClose = () => {};
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
          <div className="col-md-12 mb-3">
            {leaveBalanceByEmployee?.data?.leave_balance ? (
              leaveBalanceLoading ? (
                <Placeholder as="span" animation="glow">
                  <Placeholder
                    xs={4}
                    size="lg"
                    style={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "5px",
                    }}
                  />
                </Placeholder>
              ) : (
                <div className="alert alert-success">
                  Available Balance for{" "}
                  {leaveBalanceByEmployee?.data?.leave_type}:{" "}
                  {leaveBalanceByEmployee?.data?.leave_balance}
                </div>
              )
            ) : null}
          </div>

          <div className="col-md-6">
            <label className="col-form-label">
              Employee <span className="text-danger">*</span>
            </label>
            <Controller
              name="employee_id"
              control={control}
              rules={{ required: "Employee is required" }}
              render={({ field }) => (
                <EmployeeSelect
                  {...field}
                  onChange={(i) => field.onChange(i?.value)}
                  value={field.value}
                />
              )}
            />
            {errors.employee_id && (
              <small className="text-danger">
                {errors.employee_id.message}
              </small>
            )}
          </div>

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

          <div className="col-md-6 mb-3 mt-2">
            <label className="form-label">
              Start Date <span className="text-danger">*</span>
            </label>
            <Controller
              name="start_date"
              control={control}
              rules={{ required: "Start Date is required" }}
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

          <div className="col-md-6 mb-3 mt-2">
            <label className="form-label">
              End Date <span className="text-danger">*</span>
            </label>
            <Controller
              name="end_date"
              control={control}
              rules={{ required: "End Date is required" }}
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
                  placeholderText="Select End Date"
                />
              )}
            />
            {errors.end_date && (
              <small className="text-danger">{errors.end_date.message}</small>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Contact During Leave</label>
            <Controller
              name="contact_details_during_leave"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className="form-control"
                  placeholder="Enter Contact Details"
                />
              )}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="col-form-label">Document Attachment</label>
            <input type="file" className="form-control" accept=".pdf" />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Backup Person</label>
            <Controller
              name="backup_person_id"
              control={control}
              render={({ field }) => (
                <EmployeeSelect
                  {...field}
                  placeholder="Choose Backup Person"
                  onChange={(i) => field.onChange(i?.value)}
                  value={field.value}
                />
              )}
            />
          </div>

          <div className="col-md-12 mb-3">
            <label className="form-label">
              Reason <small className="text-muted"> (Max 255 characters)</small>{" "}
              <span className="text-danger">*</span>
            </label>
            <Controller
              name="reason"
              control={control}
              rules={{
                required: "Reason is required!",
                maxLength: {
                  value: 255,
                  message:
                    "Reason must be less than or equal to 255 characters",
                },
              }}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  maxLength={255}
                  className="form-control"
                  placeholder="Enter Reason"
                />
              )}
            />
            {errors.reason && (
              <small className="text-danger">{errors.reason.message}</small>
            )}
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
