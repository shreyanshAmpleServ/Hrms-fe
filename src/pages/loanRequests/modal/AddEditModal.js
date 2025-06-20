import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  addloan_requests,
  updateloan_requests,
} from "../../../redux/loanRequests";
import { fetchEmployee } from "../../../redux/Employee";
import { fetchloan_type } from "../../../redux/loneType"; // assume you have fetchloan_type redux
import moment from "moment";
import DatePicker from "react-datepicker";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.loan_requests);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch employees
  useEffect(() => {
    dispatch(fetchEmployee());
    dispatch(fetchloan_type()); // fetch loan types
  }, [dispatch]);

  const employee = useSelector((state) => state.employee.employee);
  const loan_type = useSelector((state) => state.loan_type?.loan_type);

  const EmployeeList = useMemo(
    () =>
      employee?.data?.map((item) => ({
        value: item.id,
        label: item.first_name + " " + (item.last_name || ""),
      })) || [],
    [employee]
  );

  const LoanTypeList = useMemo(
    () =>
      loan_type?.data?.map((item) => ({
        value: item.id,
        label: item.loan_name,
      })) || [],
    [loan_type]
  );
  // const Status = [
  //   { label: "Pending", value: "pending" },
  //   { label: "Approved", value: "approved" },
  //   { label: "Rejected", value: "rejected" },
  // ];

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        employee_id: initialData.employee_id || "",
        loan_type_id: initialData.loan_type_id || "",
        amount: initialData.amount || "",
        emi_months: initialData.emi_months || "",
        status: initialData.status || "pending",
        request_date: initialData.request_date || new Date(),
      });
    } else {
      reset({
        employee_id: "",
        loan_type_id: "",
        amount: "",
        emi_months: "",
        status: "pending",
        request_date: new Date(),
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');

    const formattedData = {
      ...data,
      request_date: data.request_date ? new Date(data.request_date) : null,
      amount: Number(data.amount),
      emi_months: Number(data.emi_months),
    };

    if (mode === "add") {
      dispatch(addloan_requests(formattedData));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateloan_requests({
          id: initialData.id,
          loan_requestsData: formattedData,
        })
      );
    }

    reset();
    closeButton?.click();
  };

  // console.log("Employee : ", EmployeeList)
  // console.log("LoanTypeList : ", LoanTypeList)

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="add_edit_loan_requests_modal"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {mode === "add" ? "Add" : "Update"} Loan Request
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
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
                  isDisabled={!EmployeeList.length}
                  classNamePrefix="react-select"
                  onChange={(option) => field.onChange(option?.value || null)}
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

          {/* Loan Type */}
          <div className="col-md-6 mb-3">
            <label className="col-form-label">
              Loan Type <span className="text-danger">*</span>
            </label>
            <Controller
              name="loan_type_id"
              control={control}
              rules={{ required: "Loan Type is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={LoanTypeList}
                  placeholder="Select Loan Type"
                  isDisabled={!LoanTypeList.length}
                  classNamePrefix="react-select"
                  onChange={(option) => field.onChange(option?.value || "")}
                  value={LoanTypeList.find(
                    (option) => option.value === watch("loan_type_id")
                  )}
                />
              )}
            />
            {errors.loan_type_id && (
              <small className="text-danger">
                {errors.loan_type_id.message}
              </small>
            )}
          </div>

          {/* Amount */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Amount <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              placeholder="Amount"
              className="form-control"
              {...register("amount", {
                required: "Amount is required",
                min: 1,
              })}
            />
            {errors.amount && (
              <small className="text-danger">{errors.amount.message}</small>
            )}
          </div>

          {/* EMI Months */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              EMI Months <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              placeholder="EMI Months"
              className="form-control"
              {...register("emi_months", {
                required: "EMI months is required",
                min: 1,
              })}
            />
            {errors.emi_months && (
              <small className="text-danger">{errors.emi_months.message}</small>
            )}
          </div>

          {/* Request Date */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Request Date <span className="text-danger">*</span>
            </label>
            <Controller
              name="request_date"
              control={control}
              rules={{ required: "Date is required" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={
                    field.value ? moment(field.value).format("DD-MM-YYYY") : ""
                  }
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                  className="form-control"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Request Date"
                />
              )}
            />
            {errors.request_date && (
              <small className="text-danger">
                {errors.request_date.message}
              </small>
            )}
          </div>

          {/* Status */}
          {/* <div className="col-md-6 mb-3">
            <label className="form-label">Status</label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Approved Status is required" }}
              render={({ field }) => {
                const selectedDeal = Status?.find(
                  (employee) => employee.value === field.value
                );
                return (
                  <Select
                    {...field}
                    className="select"
                    options={Status}
                    placeholder="Select  Status"
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
          </div> */}

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
