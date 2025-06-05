import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createMonthlyPayroll,
  updateMonthlyPayroll,
} from "../../../redux/MonthlyPayroll";

const ManageMonthlyPayroll = ({ setMonthlyPayroll, monthlyPayroll }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.monthlyPayroll || {});

  const statusOptions = [
    { value: "pending", label: "Pending Processing" },
    { value: "processing", label: "Processing" },
    { value: "approved", label: "Processing Complete" },
    { value: "rejected", label: "Processing Failed" },
  ];

  React.useEffect(() => {
    if (monthlyPayroll) {
      reset({
        employee_id: monthlyPayroll?.employee_id,
        payroll_month:
          monthlyPayroll?.payroll_month || moment().format("MMM YYYY"),
        basic_salary: monthlyPayroll?.basic_salary || 0,
        total_earnings: monthlyPayroll?.total_earnings || 0,
        total_deductions: monthlyPayroll?.total_deductions || 0,
        net_pay: monthlyPayroll?.net_pay || 0,
        status: monthlyPayroll?.status || "pending",
        processed_on: monthlyPayroll?.processed_on
          ? monthlyPayroll.processed_on
          : moment().toISOString(),
        remarks: monthlyPayroll?.remarks || "",
      });
    } else {
      reset({
        employee_id: "",
        payroll_month: moment().format("MMM YYYY"),
        basic_salary: 0,
        total_earnings: 0,
        total_deductions: 0,
        net_pay: 0,
        status: "pending",
        processed_on: moment().toISOString(),
        remarks: "",
      });
    }
  }, [monthlyPayroll, reset]);

  React.useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
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
      monthlyPayroll
        ? await dispatch(
            updateMonthlyPayroll({
              id: monthlyPayroll.id,
              monthlyPayrollData: { ...data },
            })
          ).unwrap()
        : await dispatch(createMonthlyPayroll({ ...data })).unwrap();
      closeButton.click();
      reset();
      setMonthlyPayroll(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setMonthlyPayroll(null);
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
  }, [setMonthlyPayroll]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{monthlyPayroll ? "Update " : "Add  "} Monthly Payroll</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setMonthlyPayroll(null);
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
                    Payroll Month<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="payroll_month"
                      control={control}
                      rules={{ required: "Payroll Month is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          placeholderText="Select Payroll Month"
                          selected={field.value}
                          value={
                            field.value
                              ? moment(field.value).format("MM-YYYY")
                              : null
                          }
                          onChange={(date) => field.onChange(date)}
                          dateFormat="MM-YYYY"
                          showMonthYearPicker
                          showFullMonthYearPicker
                        />
                      )}
                    />
                  </div>
                  {errors.payroll_month && (
                    <small className="text-danger">
                      {errors.payroll_month.message}
                    </small>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Basic Salary <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="basic_salary"
                      control={control}
                      rules={{ required: "Basic Salary is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className={`form-control ${errors.basic_salary ? "is-invalid" : ""}`}
                          placeholder="Enter Basic Salary"
                        />
                      )}
                    />
                    {errors.basic_salary && (
                      <small className="text-danger">
                        {errors.basic_salary.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Total Earnings <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="total_earnings"
                      control={control}
                      rules={{ required: "Total Earnings is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className={`form-control ${errors.total_earnings ? "is-invalid" : ""}`}
                          placeholder="Enter Total Earnings"
                        />
                      )}
                    />
                    {errors.total_earnings && (
                      <small className="text-danger">
                        {errors.total_earnings.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Total Deductions <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="total_deductions"
                      control={control}
                      rules={{ required: "Total Deductions is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className={`form-control ${errors.total_deductions ? "is-invalid" : ""}`}
                          placeholder="Enter Total Deductions"
                        />
                      )}
                    />
                    {errors.total_deductions && (
                      <small className="text-danger">
                        {errors.total_deductions.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Net Pay <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="net_pay"
                      control={control}
                      rules={{ required: "Net Pay is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className={`form-control ${errors.net_pay ? "is-invalid" : ""}`}
                          placeholder="Enter Net Pay"
                        />
                      )}
                    />
                    {errors.net_pay && (
                      <small className="text-danger">
                        {errors.net_pay.message}
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
                            (x) => x.value === field.value
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
                    Processed On<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="processed_on"
                      control={control}
                      rules={{ required: "Processed On is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          placeholderText="Select Processed On"
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
                  {errors.processed_on && (
                    <small className="text-danger">
                      {errors.processed_on.message}
                    </small>
                  )}
                </div>
                <div className="col-md-12">
                  <label className="col-form-label">Remarks</label>
                  <div className="mb-3">
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          className="form-control"
                          placeholder="Enter Remarks"
                          rows={2}
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
                {monthlyPayroll
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

export default ManageMonthlyPayroll;
