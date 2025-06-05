import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createHelpdeskTicket,
  updateHelpdeskTicket,
} from "../../../redux/HelpdeskTicket";

const ManageHelpdeskTicket = ({ setHelpdeskTicket, helpdeskTicket }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.helpdeskTicket || {});

  const statusOptions = [
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
    { value: "pending", label: "Pending" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
    { value: "critical", label: "Critical" },
  ];

  const ticketTypeOptions = [
    { value: "technical", label: "Technical" },
    { value: "hr", label: "HR" },
    { value: "it", label: "IT" },
    { value: "facilities", label: "Facilities" },
    { value: "other", label: "Other" },
  ];

  React.useEffect(() => {
    reset({
      employee_id: helpdeskTicket?.employee_id || "",
      ticket_subject: helpdeskTicket?.ticket_subject || "",
      ticket_type: helpdeskTicket?.ticket_type || "",
      status: helpdeskTicket?.status || "",
      priority: helpdeskTicket?.priority || "",
      assigned_to: helpdeskTicket?.assigned_to || "",
      description: helpdeskTicket?.description || "",
      submitted_on: helpdeskTicket?.submitted_on || new Date().toISOString(),
    });
  }, [helpdeskTicket, reset]);

  React.useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
  }, [dispatch, searchValue]);

  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {},
  );

  const employees = employee?.data?.map((i) => ({
    label: i?.full_name,
    value: i?.id,
  }));

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      helpdeskTicket
        ? await dispatch(
            updateHelpdeskTicket({
              id: helpdeskTicket.id,
              helpdeskTicketData: { ...data },
            }),
          ).unwrap()
        : await dispatch(createHelpdeskTicket({ ...data })).unwrap();
      closeButton.click();
      reset();
      setHelpdeskTicket(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setHelpdeskTicket(null);
      };
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose,
      );
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleModalClose,
        );
      };
    }
  }, [setHelpdeskTicket]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{helpdeskTicket ? "Update " : "Add New "} Helpdesk Ticket</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setHelpdeskTicket(null);
              reset();
            }}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Employee
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="employee_id"
                      control={control}
                      rules={{ required: "Employee is required" }}
                      render={({ field }) => {
                        const selectedEmployee = employees?.find(
                          (employee) => employee.value === field.value,
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={employees}
                            placeholder="Select Employee"
                            classNamePrefix="react-select"
                            isLoading={employeeLoading}
                            onInputChange={(inputValue) =>
                              setSearchValue(inputValue)
                            }
                            value={selectedEmployee || null}
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
                    {errors.employee_id && (
                      <small className="text-danger">
                        {errors.employee_id.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="status"
                      control={control}
                      rules={{ required: "Status is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={statusOptions}
                          placeholder="Select Status"
                          classNamePrefix="react-select"
                          value={statusOptions.find(
                            (x) => x.value === field.value,
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                    {errors.status && (
                      <small className="text-danger">
                        {errors.status.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Priority <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="priority"
                      control={control}
                      rules={{ required: "Priority is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={priorityOptions}
                          placeholder="Select Priority"
                          classNamePrefix="react-select"
                          value={priorityOptions.find(
                            (x) => x.value === field.value,
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                    {errors.priority && (
                      <small className="text-danger">
                        {errors.priority.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Ticket Type <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="ticket_type"
                      control={control}
                      rules={{ required: "Ticket type is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={ticketTypeOptions}
                          placeholder="Select Ticket Type"
                          classNamePrefix="react-select"
                          value={ticketTypeOptions.find(
                            (x) => x.value === field.value,
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                    {errors.ticket_type && (
                      <small className="text-danger">
                        {errors.ticket_type.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Ticket Subject <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="ticket_subject"
                      control={control}
                      rules={{ required: "Ticket subject is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`form-control ${errors.ticket_subject ? "is-invalid" : ""}`}
                          placeholder="Enter Ticket Subject"
                        />
                      )}
                    />
                    {errors.ticket_subject && (
                      <small className="text-danger">
                        {errors.ticket_subject.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Submitted Date<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="submitted_on"
                      control={control}
                      rules={{ required: "Submitted date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          placeholderText="Select Submitted Date"
                          selected={field.value}
                          value={
                            field.value
                              ? moment(field.value).format("DD-MM-YYYY")
                              : null
                          }
                          onChange={(date) => field.onChange(date)}
                          dateFormat="DD-MM-YYYY"
                        />
                      )}
                    />
                  </div>
                  {errors.submitted_on && (
                    <small className="text-danger">
                      {errors.submitted_on.message}
                    </small>
                  )}
                </div>

                <div className="col-md-12">
                  <label className="col-form-label">
                    Description<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: "Description is required!" }}
                      render={({ field }) => (
                        <textarea
                          rows={3}
                          {...field}
                          className={`form-control ${errors.description ? "is-invalid" : ""}`}
                          placeholder="Enter Description"
                        />
                      )}
                    />
                    {errors.description && (
                      <small className="text-danger">
                        {errors.description.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Assigned To
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="assigned_to"
                      control={control}
                      rules={{ required: "Assigned to is required" }}
                      render={({ field }) => {
                        const selectedAssignee = employees?.find(
                          (employee) => employee.value === field.value,
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={employees}
                            placeholder="Select Assignee"
                            classNamePrefix="react-select"
                            isLoading={employeeLoading}
                            value={selectedAssignee || null}
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
                    {errors.assigned_to && (
                      <small className="text-danger">
                        {errors.assigned_to.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {helpdeskTicket
                  ? loading
                    ? "Updating..."
                    : "Update"
                  : loading
                    ? "Creating..."
                    : "Create"}
                {loading && (
                  <div
                    style={{
                      height: "15px",
                      width: "15px",
                    }}
                    className="spinner-border ml-2 text-light"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManageHelpdeskTicket;
