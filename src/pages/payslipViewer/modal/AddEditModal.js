import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addpayslip, updatepayslip } from "../../../redux/payslipViewer";
import { fetchEmployee } from "../../../redux/Employee";
import { Controller } from "react-hook-form";
import Select from "react-select";
import React, { useEffect, useMemo } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
// import { Modal, Button } from 'react-bootstrap';

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.payslip);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    dispatch(fetchEmployee());
  }, [dispatch]);

  const employee = useSelector((state) => state.employee.employee);

  const EmployeeList = useMemo(
    () =>
      employee?.data?.map((item) => ({
        value: item.id,
        label: item.first_name, // or item.full_name or item.employee_name, depending on your API
      })) || [],
    [employee]
  );

  // Prefill form in edit mode
  useEffect(() => {
    console.log("InitialData:", initialData); // Check what's coming
    if (mode === "edit" && initialData) {
      reset({
        employee_id: initialData?.employee_id || "",
        month: initialData?.month || "",
        year: initialData?.year || "", // check if this is getting value
        net_salary: initialData?.net_salary || "",
        uploaded_on: initialData?.uploaded_on
          ? new Date(initialData.uploaded_on).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      reset({
        employee_id: "",
        resume_path: "",
        month: "",
        year: "",
        net_salary: "",
        uploaded_on: new Date().toISOString().split("T")[0],
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_payslip_modal");
    const pdfFile = data.pdf_path?.[0];

    if (!pdfFile) {
      alert("Please upload PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("employee_id", data.employee_id || "");
    formData.append("month", data.month || "");
    formData.append("year", data.year || ""); // ✅ Year added here
    formData.append("net_salary", data.net_salary || "");
    formData.append("uploaded_on", new Date(data.uploaded_on).toISOString());
    formData.append("pdf_path", pdfFile);

    if (mode === "add") {
      dispatch(addpayslip(formData));
    } else if (mode === "edit" && initialData) {
      dispatch(updatepayslip({ id: initialData.id, payslipData: formData }));
    }

    reset();
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_payslip_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add Goal Category " : "Edit Goal Category"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_payslip_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Employee ID */}
              <div className="mb-3">
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
                      placeholder="Choose Employee"
                      isDisabled={!EmployeeList.length}
                      classNamePrefix="react-select"
                      className="select2"
                      onChange={(option) => field.onChange(option?.value || "")}
                      value={EmployeeList.find(
                        (option) => option.value === watch("employee_id")
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

              {/* Month */}
              {/* <div className="mb-3">
                <label className="col-form-label">
                  Month <span className="text-danger">*</span>
                </label>
                <input
                  type="month"
                  className={`form-control ${errors.month ? "is-invalid" : ""}`}
                  {...register("month", { required: "Month is required" })}
                />
                {errors.month && <small className="text-danger">{errors.month.message}</small>}
              </div> */}

              <div className="mb-3">
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
                  <small className="text-danger">{errors.month.message}</small>
                )}
              </div>

              <div className="mb-3">
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
              <div className="mb-3">
                <label className="col-form-label">
                  Net Salary <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control ${errors.net_salary ? "is-invalid" : ""}`}
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
              <div className="mb-3">
                <label className="col-form-label">Payslip PDF (Only PDF)</label>
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

              {/* Uploaded On */}
              <div className="mb-3">
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
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <div className="d-flex align-items-center justify-content-end m-0">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary"
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditModal;
