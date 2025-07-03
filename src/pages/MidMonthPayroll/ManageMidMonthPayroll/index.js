import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import { fetchCostCenter } from "../../../redux/costCenter";
import { fetchCurrencies } from "../../../redux/currency";
import {
  createMidMonthPayroll,
  updateMidMonthPayroll,
} from "../../../redux/MidMonthPayroll";
import { fetchpay_component } from "../../../redux/pay-component";
import { fetchProjects } from "../../../redux/projects";

const ManageMidMonthPayroll = ({ setMidMonthPayroll, midMonthPayroll }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.midMonthPayroll || {});

  const { projects } = useSelector((state) => state.projects);
  const { costCenter } = useSelector((state) => state.costCenter);
  const { pay_component } = useSelector((state) => state.payComponent);
  const { currencies } = useSelector((state) => state.currencies);

  useEffect(() => {
    dispatch(fetchProjects({ is_active: true }));
    dispatch(fetchCostCenter({ is_active: true }));
    dispatch(fetchpay_component({ is_active: true }));
    dispatch(fetchCurrencies({ is_active: true }));
  }, []);

  const projectOptions = projects?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));

  const costCenterOptions = costCenter?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));

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

  const payrollWeekOptions = [
    { value: 1, label: "Week 1" },
    { value: 2, label: "Week 2" },
    { value: 3, label: "Week 3" },
    { value: 4, label: "Week 4" },
  ];

  React.useEffect(() => {
    reset({
      employee_id: midMonthPayroll?.employee_id,
      payroll_month: midMonthPayroll?.payroll_month || 0,
      payroll_week: midMonthPayroll?.payroll_week || 1,
      payroll_year: midMonthPayroll?.payroll_year || new Date().getFullYear(),
      pay_date: midMonthPayroll?.pay_date || new Date().toISOString(),
      net_pay: midMonthPayroll?.net_pay || 0,
      pay_currency: midMonthPayroll?.pay_currency || "",
      project_id: midMonthPayroll?.project_id || "",
      cost_center1_id: midMonthPayroll?.cost_center1_id || "",
      cost_center2_id: midMonthPayroll?.cost_center2_id || "",
      cost_center3_id: midMonthPayroll?.cost_center3_id || "",
      cost_center4_id: midMonthPayroll?.cost_center4_id || "",
      cost_center5_id: midMonthPayroll?.cost_center5_id || "",
      component_id: midMonthPayroll?.component_id || "",
      processed: midMonthPayroll?.processed || "N",
      execution_date:
        midMonthPayroll?.execution_date || new Date().toISOString(),
      remarks: midMonthPayroll?.remarks || "",
      status: midMonthPayroll?.status || "Pending",
    });
  }, [midMonthPayroll, reset]);

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      midMonthPayroll
        ? await dispatch(
            updateMidMonthPayroll({
              id: midMonthPayroll.id,
              midMonthPayrollData: {
                ...data,
                employee_email: selectedEmployee?.email,
              },
            })
          ).unwrap()
        : await dispatch(
            createMidMonthPayroll({
              ...data,
              employee_email: selectedEmployee?.email,
            })
          ).unwrap();
      closeButton.click();
      reset();
      setMidMonthPayroll(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setMidMonthPayroll(null);
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
  }, [setMidMonthPayroll]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{midMonthPayroll ? "Update " : "Add "} Mid Month Payroll</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setMidMonthPayroll(null);
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
                        return (
                          <EmployeeSelect
                            {...field}
                            value={field.value}
                            onChange={(i) => {
                              field.onChange(i?.value);
                              setSelectedEmployee(i?.meta);
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
                    Project <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="project_id"
                      control={control}
                      rules={{ required: "Project is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={projectOptions}
                          placeholder="Select Project"
                          classNamePrefix="react-select"
                          value={projectOptions?.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                    {errors.project_id && (
                      <small className="text-danger">
                        {errors.project_id.message}
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
                    Payroll Week <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="payroll_week"
                      control={control}
                      rules={{ required: "Payroll Week is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          placeholder="Select Payroll Week"
                          options={payrollWeekOptions}
                          classNamePrefix="react-select"
                          value={payrollWeekOptions?.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                  </div>
                  {errors.payroll_week && (
                    <small className="text-danger">
                      {errors.payroll_week.message}
                    </small>
                  )}
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
                          className="form-control"
                          placeholder="Enter Net Pay"
                        />
                      )}
                    />
                  </div>
                  {errors.net_pay && (
                    <small className="text-danger">
                      {errors.net_pay.message}
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
                  <label className="col-form-label">Cost Center 1</label>
                  <div className="mb-3">
                    <Controller
                      name="cost_center1_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={costCenterOptions}
                          placeholder="Select Cost Center 1"
                          classNamePrefix="react-select"
                          value={costCenterOptions?.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Cost Center 2</label>
                  <div className="mb-3">
                    <Controller
                      name="cost_center2_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={costCenterOptions}
                          placeholder="Select Cost Center 2"
                          classNamePrefix="react-select"
                          value={costCenterOptions?.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Cost Center 3</label>
                  <div className="mb-3">
                    <Controller
                      name="cost_center3_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={costCenterOptions}
                          placeholder="Select Cost Center 3"
                          classNamePrefix="react-select"
                          value={costCenterOptions?.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Cost Center 4</label>
                  <div className="mb-3">
                    <Controller
                      name="cost_center4_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={costCenterOptions}
                          placeholder="Select Cost Center 4"
                          classNamePrefix="react-select"
                          value={costCenterOptions?.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">Cost Center 5</label>
                  <div className="mb-3">
                    <Controller
                      name="cost_center5_id"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={costCenterOptions}
                          placeholder="Select Cost Center 5"
                          classNamePrefix="react-select"
                          value={costCenterOptions?.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                  </div>
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
                {midMonthPayroll
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

export default ManageMidMonthPayroll;
