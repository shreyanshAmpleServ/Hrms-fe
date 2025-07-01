import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { createpayslip, updatepayslip } from "../../../redux/payslipViewer";
import { fetchEmployee } from "../../../redux/Employee";

const AddEditModal = ({ setpayslip, payslip }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    register,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.payslip || {});

  React.useEffect(() => {
    if (payslip) {
      reset({
        employee_id: payslip?.employee_id || "",
        month: payslip?.month || "",
        year: payslip?.year || "",
        net_salary: payslip?.net_salary || "",
        gross_salary: payslip?.gross_salary || "",
        total_earnings: payslip?.total_earnings || "",
        total_deductions: payslip?.total_deductions || "",
        pay_component_summary: payslip?.pay_component_summary || "",
        tax_deductions: payslip?.tax_deductions || "",
        loan_deductions: payslip?.loan_deductions || "",
        other_adjustments: payslip?.other_adjustments || "",
        remarks: payslip?.remarks || "",
        uploaded_on: payslip?.uploaded_on
          ? new Date(payslip.uploaded_on).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      reset({
        employee_id: "",
        resume_path: "",
        month: "",
        year: "",
        net_salary: "",
        gross_salary: "",
        total_earnings: "",
        total_deductions: "",
        pay_component_summary: "",
        tax_deductions: "",
        loan_deductions: "",
        other_adjustments: "",
        remarks: "",
        uploaded_on: new Date().toISOString().split("T")[0],
      });
    }
  }, [payslip, reset]);

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
      payslip
        ? await dispatch(
            updatepayslip({
              id: payslip.id,
              payslipData: { ...data },
            })
          ).unwrap()
        : await dispatch(createpayslip({ ...data })).unwrap();
      closeButton.click();
      reset();
      setpayslip(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setpayslip(null);
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
  }, [setpayslip]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{payslip ? "Update " : "Add"} Payslip</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setpayslip(null);
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
                <div className="col-md-6 ">
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
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Month <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-control ${errors.month ? "is-invalid" : ""}`}
                    {...register("month", { required: "Month is required" })}
                  >
                    <option value="">Select Month</option>
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  {errors.month && (
                    <small className="text-danger">
                      {errors.month.message}
                    </small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Year <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-control ${errors.year ? "is-invalid" : ""}`}
                    {...register("year", { required: "Year is required" })}
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 110 }, (_, i) => 1990 + i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                  {errors.year && (
                    <small className="text-danger">{errors.year.message}</small>
                  )}
                </div>

                {/* Net Salary */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Net Salary <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={`form-control ${errors.net_salary ? "is-invalid" : ""}`}
                    placeholder="Net Salary"
                    {...register("net_salary", {
                      required: "Net salary is required",
                    })}
                  />
                  {errors.net_salary && (
                    <small className="text-danger">
                      {errors.net_salary.message}
                    </small>
                  )}
                </div>

                {/* PDF Path (Upload PDF) */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Payslip PDF</label>
                  <input
                    type="file"
                    className={`form-control ${errors.pdf_path ? "is-invalid" : ""}`}
                    accept=".pdf"
                    {...register("pdf_path", {
                      required: "PDF file is required.",
                      validate: {
                        isPdf: (files) =>
                          files[0]?.type === "application/pdf" ||
                          "Only PDF files are allowed.",
                      },
                    })}
                  />
                  {errors.pdf_path && (
                    <small className="text-danger">
                      {errors.pdf_path.message}
                    </small>
                  )}
                </div>
                {/* Gross Salary */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Gross Salary</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="Gross Salary"
                    {...register("gross_salary")}
                  />
                </div>

                {/* Total Earnings */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Total Earnings</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="Total Earnings"
                    {...register("total_earnings")}
                  />
                </div>

                {/* Total Deductions */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Total Deductions</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="Total Deductions"
                    {...register("total_deductions")}
                  />
                </div>

                {/* Tax Deductions */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Tax Deductions</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="Tax Deductions"
                    {...register("tax_deductions")}
                  />
                </div>

                {/* Loan Deductions */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Loan Deductions</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="Loan Deductions"
                    {...register("loan_deductions")}
                  />
                </div>

                {/* Other Adjustments */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Other Adjustments</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    placeholder="Other Adjustments"
                    {...register("other_adjustments")}
                  />
                </div>

                {/* Uploaded On */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Uploaded On</label>
                  <Controller
                    name="uploaded_on"
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        value={
                          field.value
                            ? moment(field.value).format("DD-MM-YYYY")
                            : ""
                        }
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => {
                          field.onChange(date);
                        }}
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select Uploaded Date"
                      />
                    )}
                  />
                  {errors.uploaded_on && (
                    <small className="text-danger">
                      {errors.uploaded_on.message}
                    </small>
                  )}
                </div>
                {/* Remarks */}
                <div className="md-3">
                  <label className="col-form-label">Remarks</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Remarks"
                    {...register("remarks")}
                  ></textarea>
                </div>
                {/* Remarks */}
                <div className="md-3">
                  <label className="col-form-label">
                    Pay Component Summary
                  </label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Pay Component Summary"
                    {...register("pay_component_summary")}
                  ></textarea>
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
                {payslip
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

export default AddEditModal;
