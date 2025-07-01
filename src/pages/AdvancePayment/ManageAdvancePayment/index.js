import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  createAdvancePayment,
  updateAdvancePayment,
} from "../../../redux/AdvancePayment";
import { fetchEmployee } from "../../../redux/Employee";

const ManageAdvancePayment = ({ setAdvancePayment, advancePayment }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.advancePayment || {});

  React.useEffect(() => {
    if (advancePayment) {
      reset({
        employee_id: advancePayment?.employee_id,
        request_date: advancePayment?.request_date || moment().toISOString(),
        amount_requested: advancePayment?.amount_requested,
        amount_approved: advancePayment?.amount_approved || "",
        approval_status: advancePayment?.approval_status || "pending",
        reason: advancePayment?.reason,
        approval_date: advancePayment.approval_date || moment().toISOString(),

        repayment_schedule:
          advancePayment?.repayment_schedule ||
          moment().add(1, "month").toISOString(),
      });
    } else {
      reset({
        request_date: moment().toISOString(),
        repayment_schedule: moment().add(1, "month").toISOString(),
        approval_status: "pending",
        amount_requested: "",
        amount_approved: "",
        reason: "",
        approval_date: moment().toISOString(),
        employee_id: "",
      });
    }
  }, [advancePayment, reset]);

  React.useEffect(() => {
    dispatch(fetchEmployee({ search: searchValue, is_active: true }));
  }, [dispatch, searchValue]);

  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {}
  );

  const employees = employee?.data?.map((i) => ({
    label: i?.full_name,
    value: i?.id,
  }));

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      advancePayment
        ? await dispatch(
            updateAdvancePayment({
              id: advancePayment.id,
              advancePaymentData: { ...data },
            })
          ).unwrap()
        : await dispatch(createAdvancePayment({ ...data })).unwrap();
      closeButton.click();
      reset();
      setAdvancePayment(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setAdvancePayment(null);
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
  }, [setAdvancePayment]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{advancePayment ? "Update " : "Add "} Advance Payment</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setAdvancePayment(null);
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
                          (employee) => employee.value === field.value
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

                {/* <div className="col-md-6">
                  <label className="col-form-label">
                    Approval Status <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="approval_status"
                      control={control}
                      rules={{ required: "Approval Status is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={statusOptions}
                          placeholder="Select Approval Status"
                          classNamePrefix="react-select"
                          value={statusOptions.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                    {errors.approval_status && (
                      <small className="text-danger">
                        {errors.approval_status.message}
                      </small>
                    )}
                  </div>
                </div> */}

                <div className="col-md-6">
                  <label className="col-form-label">
                    Amount Requested <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="amount_requested"
                      control={control}
                      rules={{ required: "Amount Requested is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className={`form-control ${errors.amount_requested ? "is-invalid" : ""}`}
                          placeholder="Enter Amount Requested"
                        />
                      )}
                    />
                    {errors.amount_requested && (
                      <small className="text-danger">
                        {errors.amount_requested.message}
                      </small>
                    )}
                  </div>
                </div>
                {/* <div className="col-md-6">
                  <label className="col-form-label">
                    Amount Approved <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="amount_approved"
                      control={control}
                      rules={{ required: "Amount Approved is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className={`form-control ${errors.amount_approved ? "is-invalid" : ""}`}
                          placeholder="Enter Amount Approved"
                        />
                      )}
                    />
                    {errors.amount_approved && (
                      <small className="text-danger">
                        {errors.amount_approved.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Approval Date<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="approval_date"
                      control={control}
                      rules={{ required: "Request date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          placeholderText="Select Request Date"
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
                  {errors.approval_date && (
                    <small className="text-danger">
                      {errors.approval_date.message}
                    </small>
                  )}
                </div> */}

                <div className="col-md-6">
                  <label className="col-form-label">
                    Request Date<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="request_date"
                      control={control}
                      rules={{ required: "Request date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          placeholderText="Select Request Date"
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
                  {errors.request_date && (
                    <small className="text-danger">
                      {errors.request_date.message}
                    </small>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Due Date
                    <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="repayment_schedule"
                      control={control}
                      rules={{ required: "Due Date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          placeholderText="Select Due Date"
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
                  {errors.repayment_schedule && (
                    <small className="text-danger">
                      {errors.repayment_schedule.message}
                    </small>
                  )}
                </div>

                <div className="col-md-12">
                  <label className="col-form-label">
                    Reason{" "}
                    <small className="text-muted">(Max 255 characters)</small>
                  </label>
                  <div className="mb-3">
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
                          placeholder="Enter Reason "
                        />
                      )}
                    />
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
                {advancePayment
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

export default ManageAdvancePayment;
