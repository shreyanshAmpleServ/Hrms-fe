import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";

import { fetchLoanRequest } from "../../../redux/loanRequests";
import { fetchEmployee } from "../../../redux/Employee";
import { addloanEmi, updateloanEmi } from "../../../redux/LoanEmi";
import { fetchLoanRequest } from "../../../redux/loanRequests";
import { fetchpayslip } from "../../../redux/payslipViewer";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.loan_requests);
  const employee = useSelector((state) => state.employee.employee);
  const loan_requests = useSelector(
    (state) => state.loan_requests?.loan_requests
  );
  const payslip = useSelector((state) => state.payslip?.payslip);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    dispatch(fetchEmployee());
    dispatch(fetchLoanRequest());
    dispatch(fetchpayslip());
  }, [dispatch]);

  React.useEffect(() => {
    if (initialData) {
      reset({
        employee_id: initialData.employee_id || "",
        loan_request_id: initialData.loan_request_id || "",
        payslip_id: initialData.payslip_id || "",
        emi_amount: initialData.emi_amount || "",
        due_month: initialData.due_month || "",
      });
    } else {
      reset({
        employee_id: "",
        loan_request_id: "",
        payslip_id: "",
        emi_amount: "",
        due_month: "",
      });
    }
  }, [initialData, reset]);

  const EmployeeList = useMemo(
    () =>
      employee?.data?.map((item) => ({
        value: item.id,
        label: `${item.first_name} ${item.last_name || ""}`,
      })) || [],
    [employee]
  );

  const LoanList = useMemo(
    () =>
      loan_requests?.data?.map((item) => ({
        value: item.id,
        label: `₹${item.amount}`,
      })) || [],
    [loan_requests]
  );

  const PayslipList = useMemo(
    () =>
      payslip?.data?.map((item) => ({
        value: item.id,
        label: item.month,
      })) || [],
    [payslip]
  );

  const onSubmit = (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');

    const formattedData = {
      ...data,
      request_date: data.request_date ? new Date(data.request_date) : null,
      emi_amount: Number(data.emi_amount),
      emi_months: Number(data.emi_months),
    };

    if (mode === "add") {
      dispatch(addloanEmi(formattedData));
    } else {
      dispatch(
        updateloanEmi({
          id: initialData.id,
          loanEmiData: formattedData,
        })
      );
    }

    reset();
    closeButton?.click();
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        initialData(null);
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
  }, [initialData]);
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="add_edit_loanEmi_modal"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {mode === "add" ? "Add" : "Update"} Loan EMI
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 rounded-circle"
          data-bs-dismiss="offcanvas"
        >
          <i className="ti ti-x" />
        </button>
      </div>

      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)} className="row">
          {/* Employee */}
          <div className="col-md-6 mb-3">
            <label className="col-form-label">
              Employee <span className="text-danger">*</span>
            </label>
            <Controller
              name="employee_id"
              control={control}
              rules={{ required: "Employee is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={EmployeeList}
                  placeholder="Select Employee"
                  classNamePrefix="react-select"
                  onChange={(option) => field.onChange(option?.value)}
                  value={EmployeeList.find(
                    (opt) => opt.value === watch("employee_id")
                  )}
                />
              )}
            />
            {errors.employee_id && (
              <small className="text-danger">
                {errors.employee_id.message}
              </small>
            )}
          </div>

          {/* Loan Type */}
          <div className="col-md-6 mb-3">
            <label className="col-form-label">
              Amount<span className="text-danger">*</span>
            </label>
            <Controller
              name="loan_request_id"
              control={control}
              rules={{ required: "Loan type is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={LoanList}
                  placeholder="Select Loan Type"
                  classNamePrefix="react-select"
                  onChange={(option) => field.onChange(option?.value)}
                  value={LoanList.find(
                    (opt) => opt.value === watch("loan_request_id")
                  )}
                />
              )}
            />
            {errors.loan_request_id && (
              <small className="text-danger">
                {errors.loan_request_id.message}
              </small>
            )}
          </div>

          {/* Due Month */}
          <div className="col-md-6 mb-3">
            <label className="col-form-label">
              Due Month <span className="text-danger">*</span>
            </label>
            <Controller
              name="payslip_id"
              control={control}
              rules={{ required: "Due month is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={PayslipList}
                  placeholder="Select Due Month"
                  classNamePrefix="react-select"
                  onChange={(option) => field.onChange(option?.value)}
                  value={PayslipList.find(
                    (opt) => opt.value === watch("payslip_id")
                  )}
                />
              )}
            />
            {errors.payslip_id && (
              <small className="text-danger">{errors.payslip_id.message}</small>
            )}
          </div>

          {/* Buttons */}
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
