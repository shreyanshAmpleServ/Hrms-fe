import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import {
  createLeaveEncashment,
  updateLeaveEncashment,
} from "../../../redux/LeaveEncashment";
import { fetchLeaveType } from "../../../redux/LeaveType";

const ManageLeaveEncashment = ({ setLeaveEncashment, leaveEncashment }) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: "",
      leave_type_id: "",
      leave_days: "",
      encashment_date: new Date(),
      encashment_amount: "",
      approval_status: "Panding",
    },
  });

  const { loading } = useSelector((state) => state.leaveEncashment || {});
  const { leaveType, loading: leaveTypeLoading } = useSelector(
    (state) => state.leaveType || {}
  );
  const leaveTypes =
    leaveType?.data?.map((i) => ({
      label: i?.leave_type,
      value: i?.id,
    })) || [];

  useEffect(() => {
    dispatch(fetchLeaveType({ is_active: true }));
  }, [dispatch]);

  React.useEffect(() => {
    if (leaveEncashment) {
      reset({
        employee_id: leaveEncashment.employee_id || "",
        leave_type_id: leaveEncashment.leave_type_id || "",
        leave_days: leaveEncashment.leave_days || "",
        encashment_date: leaveEncashment.encashment_date
          ? new Date(leaveEncashment.encashment_date)
          : new Date(),
        encashment_amount: leaveEncashment.encashment_amount || "",
        approval_status: leaveEncashment.approval_status || "Panding",
      });
    } else {
      reset({
        employee_id: "",
        leave_type_id: "",
        leave_days: "",
        encashment_date: new Date(),
        encashment_amount: "",
        approval_status: "Panding",
      });
    }
  }, [leaveEncashment, reset]);

  // const approvedStatus = [
  //   { label: "Pending", value: "pending" },
  //   { label: "Approved", value: "approved" },
  //   { label: "Rejected", value: "rejected" },
  // ];

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      leaveEncashment
        ? await dispatch(
            updateLeaveEncashment({
              id: leaveEncashment.id,
              leaveEncashmentData: { ...data },
            })
          ).unwrap()
        : await dispatch(createLeaveEncashment({ ...data })).unwrap();
      closeButton.click();
      reset();
      setLeaveEncashment(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setLeaveEncashment(null);
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
  }, [setLeaveEncashment]);
  return (
    <>
      {/* Add New appointment */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{leaveEncashment ? "Update " : "Add  "} Leave Encashment</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setLeaveEncashment(null);
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
                        return (
                          <EmployeeSelect
                            {...field}
                            value={field.value}
                            onChange={(i) => field.onChange(i?.value)}
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
                  <div className="mb-3">
                    <label className="col-form-label">
                      Leave Type
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="leave_type_id"
                      control={control}
                      rules={{ required: "Leave type is required" }}
                      render={({ field }) => {
                        const selectedDeal = leaveTypes?.find(
                          (employee) => employee.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            placeholder="-- Select --"
                            options={[
                              { value: "", label: "-- Select --" },
                              ...leaveTypes,
                            ]}
                            isLoading={leaveTypeLoading}
                            value={selectedDeal || null}
                            classNamePrefix="react-select"
                          />
                        );
                      }}
                    />
                    {errors.leave_type_id && (
                      <small className="text-danger">
                        {errors.leave_type_id.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Leave Days<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="leave_days"
                      control={control}
                      rules={{ required: "Leave days is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="form-control"
                          placeholder="Enter Leave Days"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  {errors.leave_days && (
                    <small className="text-danger">
                      {errors.leave_days.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Encashment Date<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="encashment_date"
                      control={control}
                      rules={{ required: "Encashment date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          selected={field.value}
                          value={
                            field.value
                              ? moment(field.value).format("DD-MM-YYYY")
                              : null
                          }
                          onChange={field.onChange}
                          dateFormat="DD-MM-YYYY"
                          minDate={new Date()}
                        />
                      )}
                    />
                  </div>
                  {errors.encashment_date && (
                    <small className="text-danger">
                      {errors.encashment_date.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Encashment Amount<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-currency-dollar" />
                    </span>
                    <Controller
                      name="encashment_amount"
                      control={control}
                      rules={{ required: "Encashment amount is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className="form-control"
                          placeholder="Enter Encashment Amount"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  {errors.encashment_amount && (
                    <small className="text-danger">
                      {errors.encashment_amount.message}
                    </small>
                  )}
                </div>
                {/* <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Approval Status
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="approval_status"
                      control={control}
                      rules={{ required: "Approval Status is required" }}
                      render={({ field }) => {
                        const selectedDeal = approvedStatus?.find(
                          (employee) => employee.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={approvedStatus}
                            placeholder="Select Approval Status"
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
                    {errors.approval_status && (
                      <small className="text-danger">
                        {errors.approval_status.message}
                      </small>
                    )}
                  </div>
                </div> */}
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
                {leaveEncashment
                  ? loading
                    ? " Updating..."
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

export default ManageLeaveEncashment;
