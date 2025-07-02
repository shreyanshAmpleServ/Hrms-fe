import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchCurrencies } from "../../../redux/currency";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createOverTimePayroll,
  updateOverTimePayroll,
} from "../../../redux/OverTimePayroll";
import { fetchpay_component } from "../../../redux/pay-component";

const ManageOverTimePayroll = ({ setOverTimePayroll, overtimePayroll }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    register,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.overtimePayroll || {});

  const { pay_component } = useSelector((state) => state.payComponent);
  const { currencies } = useSelector((state) => state.currencies);

  useEffect(() => {
    dispatch(fetchpay_component({ is_active: true }));
    dispatch(fetchCurrencies({ is_active: true }));
  }, []);

  useEffect(() => {
    if (watch("employee_id")) {
      setSelectedEmployee(watch("employee_id"));
    }
  }, [watch("employee_id")]);

  const payComponentOptions = pay_component?.data?.map((item) => ({
    value: item?.id,
    label: item?.component_name,
  }));

  const currencyList =
    currencies?.data?.map((item) => ({
      value: item.id,
      label: item.currency_name + " (" + item.currency_code + ")",
    })) || [];

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  const payrollMonthOptions = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
  ];

  const overtimeCategoryOptions = [
    { value: "Extra Hours", label: "Extra Hours" },
    { value: "Overtime", label: "Overtime" },
    { value: "Holiday", label: "Holiday" },
    { value: "Weekend", label: "Weekend" },
    { value: "Public Holiday", label: "Public Holiday" },
  ];

  React.useEffect(() => {
    reset({
      employee_id: overtimePayroll?.employee_id,
      payroll_month: overtimePayroll?.payroll_month || 0,
      payroll_year: overtimePayroll?.payroll_year || new Date().getFullYear(),
      pay_date: overtimePayroll?.pay_date || new Date().toISOString(),
      overtime_pay: overtimePayroll?.overtime_pay || 0,
      pay_currency: overtimePayroll?.pay_currency || "",
      component_id: overtimePayroll?.component_id || "",
      overtime_category: overtimePayroll?.overtime_category || "",
      overtime_hours: overtimePayroll?.overtime_hours || 0,
      overtime_rate_multiplier: overtimePayroll?.overtime_rate_multiplier || 0,
      overtime_formula: overtimePayroll?.overtime_formula || "",
      overtime_type: overtimePayroll?.overtime_type || "",
      overtime_date: overtimePayroll?.overtime_date || new Date().toISOString(),
      start_time:
        overtimePayroll?.start_time ||
        new Date("1970-01-01 18:00:00").toLocaleTimeString(),
      end_time:
        overtimePayroll?.end_time ||
        new Date("1970-01-01 21:00:00").toLocaleTimeString(),
      calculation_basis: overtimePayroll?.calculation_basis || "",
      processed: overtimePayroll?.processed || "N",
      remarks: overtimePayroll?.remarks || "",
      status: overtimePayroll?.status || "Pending",
      execution_date:
        overtimePayroll?.execution_date || new Date().toISOString(),
    });
  }, [overtimePayroll, reset]);

  React.useEffect(() => {
    dispatch(fetchEmployee({ search: searchValue, status: "Active" }));
  }, [dispatch, searchValue]);

  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {}
  );

  const employees = employee?.data?.map((i) => ({
    label: i?.full_name,
    value: i?.id,
    record: i,
  }));

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      overtimePayroll
        ? await dispatch(
            updateOverTimePayroll({
              id: overtimePayroll.id,
              overtimePayrollData: {
                ...data,
                employee_email: selectedEmployee?.email,
              },
            })
          ).unwrap()
        : await dispatch(
            createOverTimePayroll({
              ...data,
              employee_email: selectedEmployee?.email,
            })
          ).unwrap();
      closeButton.click();
      reset();
      setOverTimePayroll(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setOverTimePayroll(null);
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
  }, [setOverTimePayroll]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{overtimePayroll ? "Update " : "Add "} Over Time Payroll</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setOverTimePayroll(null);
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
                      <span className="text-danger"> *</span>
                    </label>
                    <Controller
                      name="employee_id"
                      control={control}
                      rules={{ required: "Employee is required" }}
                      render={({ field }) => {
                        const selectedEmployee = employees?.find(
                          (employee) => employee.value === field.value
                        );
                        setSelectedEmployee(selectedEmployee?.record);
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
                    Component <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="component_id"
                      control={control}
                      rules={{ required: "Component is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={payComponentOptions}
                          placeholder="Select Component"
                          classNamePrefix="react-select"
                          value={payComponentOptions?.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                    {errors.component_id && (
                      <small className="text-danger">
                        {errors.component_id.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Payroll Month <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="payroll_month"
                      control={control}
                      rules={{ required: "Payroll Month is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          placeholder="Select Payroll Month"
                          options={payrollMonthOptions}
                          classNamePrefix="react-select"
                          value={payrollMonthOptions?.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Payroll Year <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="payroll_year"
                      control={control}
                      rules={{ required: "Payroll Year is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          placeholderText="Select Payroll Year"
                          showYearPicker
                          dateFormat="yyyy"
                          selected={
                            field.value ? new Date(field.value, 0) : null
                          }
                          onChange={(date) =>
                            field.onChange(date ? date.getFullYear() : null)
                          }
                        />
                      )}
                    />
                  </div>
                  {errors.payroll_year && (
                    <small className="text-danger">
                      {errors.payroll_year.message}
                    </small>
                  )}
                </div>
                <div className="mb-3 col-md-6">
                  <label className="col-form-label">
                    Overtime Category <span className="text-danger">*</span>
                  </label>
                  <div>
                    <Controller
                      name="overtime_category"
                      control={control}
                      rules={{ required: "Overtime Category is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={overtimeCategoryOptions}
                          placeholder="Select Overtime Category"
                          classNamePrefix="react-select"
                          value={overtimeCategoryOptions?.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                  </div>
                  {errors.overtime_category && (
                    <small className="text-danger">
                      {errors.overtime_category.message}
                    </small>
                  )}
                </div>
                <div className="mb-3 col-md-6">
                  <label className="col-form-label">
                    Overtime Hours <span className="text-danger">*</span>
                  </label>

                  <Controller
                    name="overtime_hours"
                    control={control}
                    rules={{ required: "Overtime Hours is required!" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className="form-control"
                        placeholder="Enter Overtime Hours"
                      />
                    )}
                  />

                  {errors.overtime_hours && (
                    <small className="text-danger">
                      {errors.overtime_hours.message}
                    </small>
                  )}
                </div>
                <div className="col-md-12">
                  <label className="col-form-label">
                    Overtime Formula <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="overtime_formula"
                      control={control}
                      rules={{ required: "Overtime Formula is required!" }}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={2}
                          className="form-control"
                          placeholder="Enter Overtime Formula"
                        />
                      )}
                    />
                  </div>
                  {errors.overtime_formula && (
                    <small className="text-danger">
                      {errors.overtime_formula.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Overtime Rate Multiplier{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="overtime_rate_multiplier"
                      control={control}
                      rules={{
                        required: "Overtime Rate Multiplier is required!",
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className="form-control"
                          placeholder="Enter Overtime Rate Multiplier"
                        />
                      )}
                    />
                  </div>
                  {errors.overtime_rate_multiplier && (
                    <small className="text-danger">
                      {errors.overtime_rate_multiplier.message}
                    </small>
                  )}
                </div>

                <div className="col-md-6">
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
                        <DatePicker
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

                <div className="mb-3 col-md-6">
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
                        <DatePicker
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

                <div className="col-md-6">
                  <label className="col-form-label">
                    Currency <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="pay_currency"
                      control={control}
                      rules={{ required: "Currency is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={currencyList}
                          placeholder="Select Currency"
                          classNamePrefix="react-select"
                          value={currencyList?.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                  </div>
                  {errors.pay_currency && (
                    <small className="text-danger">
                      {errors.pay_currency.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Overtime Pay <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="overtime_pay"
                      control={control}
                      rules={{ required: "Overtime Pay is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className="form-control"
                          placeholder="Enter Overtime Pay"
                        />
                      )}
                    />
                  </div>
                  {errors.overtime_pay && (
                    <small className="text-danger">
                      {errors.overtime_pay.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Pay Date <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="pay_date"
                      control={control}
                      rules={{ required: "Pay Date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          placeholder="Select Pay Date"
                          value={
                            field.value
                              ? moment(field.value).format("DD-MM-YYYY")
                              : null
                          }
                          onChange={(date) => field.onChange(date)}
                        />
                      )}
                    />
                  </div>
                  {errors.pay_date && (
                    <small className="text-danger">
                      {errors.pay_date.message}
                    </small>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">Execution Date</label>
                  <div className="mb-3">
                    <Controller
                      name="execution_date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          placeholder="Select Execution Date"
                          value={
                            field.value
                              ? moment(field.value).format("DD-MM-YYYY")
                              : null
                          }
                          onChange={(date) => field.onChange(date)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Status</label>
                  <div className="mb-3">
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={statusOptions}
                          placeholder="Select Status"
                          classNamePrefix="react-select"
                          value={statusOptions?.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Processed</label>
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <input
                        type="radio"
                        className="status-radio"
                        id="active"
                        value="Y"
                        {...register("processed")}
                      />
                      <label htmlFor="active">Processed</label>
                    </div>
                    <div className="me-2">
                      <input
                        type="radio"
                        className="status-radio"
                        id="inactive"
                        value="N"
                        {...register("processed")}
                      />
                      <label htmlFor="inactive">Not Processed</label>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <label className="col-form-label">
                    Remarks{" "}
                    <small className="text-muted">(Max 255 characters)</small>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="remarks"
                      control={control}
                      rules={{
                        required: "Remarks is required!",
                        maxLength: {
                          value: 255,
                          message:
                            "Remarks must be less than or equal to 255 characters",
                        },
                      }}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={3}
                          maxLength={255}
                          className="form-control"
                          placeholder="Enter Remarks "
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
                {overtimePayroll
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

export default ManageOverTimePayroll;
