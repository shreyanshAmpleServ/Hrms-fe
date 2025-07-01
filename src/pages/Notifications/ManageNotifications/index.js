import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createNotifications,
  updateNotifications,
} from "../../../redux/Notifications"; // You need to create this

const ManageNotifications = ({ setNotifications, Notifications }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.Notifications || {});
  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {}
  );

  const statusOptions = [
    { value: "sent", label: "Sent" },
    { value: "failed", label: "Failed" },
    { value: "pending", label: "Pending" },
  ];

  const channelOptions = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "in_app", label: "In-App" },
  ];

  const employees = employee?.data?.map((i) => ({
    label: i?.full_name,
    value: i?.id,
  }));

  useEffect(() => {
    if (Notifications) {
      // Edit mode
      reset({
        employee_id: Notifications.employee_id || "",
        message_title: Notifications.message_title || "",
        message_body: Notifications.message_body || "",
        channel: Notifications.channel || "",
        sent_on: Notifications.sent_on
          ? new Date(Notifications.sent_on)
          : new Date(),
        status: Notifications.status || "Panding",
      });
    } else {
      // Add mode
      reset({
        employee_id: "",
        message_title: "",
        message_body: "",
        channel: "",
        sent_on: new Date(),
        status: "Panding",
      });
    }
  }, [Notifications, reset]);

  useEffect(() => {
    dispatch(fetchEmployee({ search: searchValue, is_active: true }));
  }, [dispatch, searchValue]);

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      Notifications
        ? await dispatch(
            updateNotifications({
              id: Notifications.id,
              NotificationsData: data,
            })
          ).unwrap()
        : await dispatch(createNotifications(data)).unwrap();
      closeButton.click();
      reset();
      setNotifications(null);
    } catch (error) {
      closeButton.click();
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setNotifications(null);
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
  }, [setNotifications]);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{Notifications ? "Update" : "Add"} Notifications</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => {
            setNotifications(null);
            reset();
          }}
        >
          <i className="ti ti-x" />
        </button>
      </div>

      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Employee <span className="text-danger">*</span>
              </label>
              <Controller
                name="employee_id"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => {
                  const selectedEmployee = employees?.find(
                    (emp) => emp.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      className="select"
                      options={employees}
                      placeholder="Select Employee"
                      classNamePrefix="react-select"
                      isLoading={employeeLoading}
                      onInputChange={(inputValue) => setSearchValue(inputValue)}
                      value={selectedEmployee || null}
                      onChange={(option) => field.onChange(option.value)}
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
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

            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Channel <span className="text-danger">*</span>
              </label>
              <Controller
                name="channel"
                control={control}
                rules={{ required: "Channel is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="select"
                    options={channelOptions}
                    placeholder="Select Channel"
                    classNamePrefix="react-select"
                    value={channelOptions.find((x) => x.value === field.value)}
                    onChange={(option) => field.onChange(option.value)}
                  />
                )}
              />
              {errors.channel && (
                <small className="text-danger">{errors.channel.message}</small>
              )}
            </div>

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
                    className="select"
                    options={statusOptions}
                    placeholder="Select Status"
                    classNamePrefix="react-select"
                    value={statusOptions.find((x) => x.value === field.value)}
                    onChange={(option) => field.onChange(option.value)}
                  />
                )}
              />
              {errors.status && (
                <small className="text-danger">{errors.status.message}</small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Sent On <span className="text-danger">*</span>
              </label>
              <Controller
                name="sent_on"
                control={control}
                rules={{ required: "Sent date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="form-control"
                    selected={field.value}
                    placeholderText="Select Sent Date"
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd-MM-yyyy"
                  />
                )}
              />
              {errors.sent_on && (
                <small className="text-danger">{errors.sent_on.message}</small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Message Title <span className="text-danger">*</span>
              </label>
              <Controller
                name="message_title"
                control={control}
                rules={{ required: "Message title is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={`form-control ${errors.message_title ? "is-invalid" : ""}`}
                    placeholder="Enter Title"
                  />
                )}
              />
              {errors.message_title && (
                <small className="text-danger">
                  {errors.message_title.message}
                </small>
              )}
            </div>

            <div className="col-md-12 mb-3">
              <label className="col-form-label">
                Message Body{" "}
                <small className="text-muted">(Max 255 characters)</small>
              </label>
              <Controller
                name="message_body"
                control={control}
                rules={{
                  required: " Message Body is required!",
                  maxLength: {
                    value: 255,
                    message:
                      " Message Body must be less than or equal to 255 characters",
                  },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    maxLength={255}
                    className="form-control"
                    placeholder="Enter  Message Body "
                  />
                )}
              />
              {/* {errors.message_body && (
                <small className="text-danger">
                  {errors.message_body.message}
                </small>
              )} */}
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
              {Notifications
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

export default ManageNotifications;
