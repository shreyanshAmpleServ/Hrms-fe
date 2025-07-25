import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import {
  createArrearAdjustments,
  updateArrearAdjustments,
} from "../../../redux/ArrearAdjustments";

const ManageArrearAdjustments = ({
  setArrearAdjustments,
  arrearAdjustments,
}) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.arrearAdjustments || {});

  React.useEffect(() => {
    if (arrearAdjustments) {
      reset({
        employee_id: arrearAdjustments.employee_id,
        payroll_month:
          arrearAdjustments.payroll_month || moment().toISOString(),
        arrear_reason: arrearAdjustments.arrear_reason || "",
        arrear_amount: arrearAdjustments.arrear_amount
          ? arrearAdjustments.arrear_amount
          : 0,
        adjustment_type: arrearAdjustments.adjustment_type || "",
        remarks: arrearAdjustments.remarks || "",
      });
    } else {
      reset({
        employee_id: "",
        payroll_month: moment().toISOString(),
        arrear_reason: "",
        arrear_amount: 0,
        adjustment_type: "",
        remarks: "",
      });
    }
  }, [arrearAdjustments, reset]);

  const adjustmentTypes = [
    { value: "", label: "-- Select --" },
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
      arrearAdjustments
        ? await dispatch(
            updateArrearAdjustments({
              id: arrearAdjustments.id,
              arrearAdjustmentsData: { ...data },
            })
          ).unwrap()
        : await dispatch(createArrearAdjustments({ ...data })).unwrap();
      closeButton.click();
      reset();
      setArrearAdjustments(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setArrearAdjustments(null);
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
  }, [setArrearAdjustments]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{arrearAdjustments ? "Update " : "Add"} Arrear Adjustments</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setArrearAdjustments(null);
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
                          placeholder="-- Select --"
                          classNamePrefix="react-select"
                          value={adjustmentTypes.find(
                            (x) => x.value === field.value
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
                  <label className="col-form-label">
                    Arrear Reason
                    <small className="text-muted">
                      (Max 255 characters)
                    </small>{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="arrear_reason"
                      control={control}
                      rules={{
                        required: "Arrear Reason is required!",
                        maxLength: {
                          value: 255,
                          message:
                            "Description must be less than or equal to 255 characters",
                        },
                      }}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={3}
                          maxLength={255}
                          className="form-control"
                          placeholder="Enter Arrear Reason "
                        />
                      )}
                    />
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
                        maxLength: {
                          value: 255,
                          message:
                            "Description must be less than or equal to 255 characters",
                        },
                      }}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={3}
                          maxLength={255}
                          className="form-control"
                          placeholder="Enter Remarks"
                        />
                      )}
                    />
                    {errors.remarks && (
                      <small className="text-danger">
                        {errors.remarks.message}
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
                {arrearAdjustments
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

export default ManageArrearAdjustments;
