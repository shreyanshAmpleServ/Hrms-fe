import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  createKPIProgress,
  updateKPIProgress,
} from "../../../redux/KPIProgress";
import { fetchEmployee } from "../../../redux/Employee";

const ManageKPIProgress = ({ setKPIProgress, kpiProgress }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.kpiProgress || {});

  React.useEffect(() => {
    if (kpiProgress) {
      reset({
        employee_id: kpiProgress.employee_id || "",
        goal_id: kpiProgress.goal_id || "",
        entry_date: kpiProgress.entry_date || moment().toISOString(),
        progress_value: kpiProgress.progress_value || "",
        remarks: kpiProgress.remarks || "",
        reviewed_by: kpiProgress.reviewed_by ? kpiProgress.reviewed_by : null,
        reviewed_on: kpiProgress.reviewed_on || moment.toISOString(),
      });
    } else {
      reset({
        employee_id: "",
        goal_id: "",
        entry_date: moment().toISOString(),
        progress_value: "",
        remarks: "",
        reviewed_by: null,
        reviewed_on: moment().toISOString(),
      });
    }
  }, [kpiProgress, reset]);

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

  const adjustmentTypes = [
    { value: "Bonus", label: "Bonus" },
    { value: "Incentive", label: "Incentive" },
    { value: "Overtime", label: "Overtime" },
    { value: "Leave Encashment", label: "Leave Encashment" },
    { value: "Salary Advance", label: "Salary Advance" },
    { value: "Loan Deduction", label: "Loan Deduction" },
    { value: "Tax Adjustment", label: "Tax Adjustment" },
    { value: "Reimbursement", label: "Reimbursement" },
    { value: "Correction", label: "Correction" },
    { value: "Other", label: "Other" },
  ];

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      kpiProgress
        ? await dispatch(
            updateKPIProgress({
              id: kpiProgress.id,
              kpiProgressData: { ...data },
            }),
          ).unwrap()
        : await dispatch(createKPIProgress({ ...data })).unwrap();
      closeButton.click();
      reset();
      setKPIProgress(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setKPIProgress(null);
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
  }, [setKPIProgress]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{kpiProgress ? "Update " : "Add New "} KPI Progress</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setKPIProgress(null);
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
                    Arrear Amount <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="arrear_amount"
                      control={control}
                      rules={{ required: "Arrear Amount is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className={`form-control ${errors.arrear_amount ? "is-invalid" : ""}`}
                          placeholder="Enter Arrear Amount"
                        />
                      )}
                    />
                    {errors.arrear_amount && (
                      <small className="text-danger">
                        {errors.arrear_amount.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Adjustment Type <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="adjustment_type"
                      control={control}
                      rules={{ required: "Adjustment Type is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={adjustmentTypes}
                          placeholder="Select Adjustment Type"
                          classNamePrefix="react-select"
                          value={adjustmentTypes.find(
                            (x) => x.value === field.value,
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                    {errors.adjustment_type && (
                      <small className="text-danger">
                        {errors.adjustment_type.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-12">
                  <label className="col-form-label">Arrear Reason</label>
                  <div className="mb-3">
                    <Controller
                      name="arrear_reason"
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          className="form-control"
                          placeholder="Enter Arrear Reason"
                          rows={2}
                        />
                      )}
                    />
                  </div>
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
                {kpiProgress
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

export default ManageKPIProgress;
