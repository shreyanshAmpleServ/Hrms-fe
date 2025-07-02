import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchCurrencies } from "../../../redux/currency";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createtravelReimbursement,
  updatetravelReimbursement,
} from "../../../redux/TravelReimbursement";

const ManagetravelReimbursement = ({
  settravelReimbursement,
  travelReimbursement,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();

  const { currencies, loading: currencyLoading } = useSelector(
    (state) => state.currencies
  );
  const currencyOptions = currencies?.data?.map((currency) => ({
    label: currency.currency_code + " - " + currency.currency_name,
    value: currency.id,
  }));

  React.useEffect(() => {
    dispatch(fetchCurrencies({ is_active: true }));
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: "",
      travel_purpose: "",
      start_date: new Date(),
      end_date: new Date(),
      destination: "",
      total_amount: "",
      approval_status: "Panding",
      travel_mode: "",
      advance_amount: "",
      expense_breakdown: "",
      attachment_path: "",
      currency: "",
      exchange_rate: "",
      final_approved_amount: "",
      remarks: "",
    },
  });

  React.useEffect(() => {
    if (travelReimbursement) {
      reset({
        employee_id: travelReimbursement?.employee_id || "",
        travel_purpose: travelReimbursement?.travel_purpose || "",
        start_date: travelReimbursement?.start_date || "",
        end_date: travelReimbursement?.end_date || "",
        destination: travelReimbursement?.destination || "",
        total_amount: travelReimbursement?.total_amount || "",
        approval_status: travelReimbursement?.approval_status || "Panding",
        travel_mode: travelReimbursement?.travel_mode || "",
        advance_amount: travelReimbursement?.advance_amount || "",
        expense_breakdown: travelReimbursement?.expense_breakdown || "",
        attachment_path: travelReimbursement?.attachment_path || "",
        currency: travelReimbursement?.currency || "",
        exchange_rate: travelReimbursement?.exchange_rate || "",
        final_approved_amount: travelReimbursement?.final_approved_amount || "",
        remarks: travelReimbursement?.remarks || "",
      });
    } else {
      reset({
        employee_id: "",
        travel_purpose: "",
        start_date: new Date(),
        end_date: new Date(),
        destination: "",
        total_amount: "",
        approval_status: "Panding",
        travel_mode: "",
        advance_amount: "",
        expense_breakdown: "",
        attachment_path: "",
        currency: "",
        exchange_rate: "",
        final_approved_amount: "",
        remarks: "",
      });
    }
  }, [travelReimbursement, reset]);

  const { employee } = useSelector((state) => state.employee || {});

  const { loading } = useSelector((state) => state.travelReimbursement || {});

  const employeeOptions = employee?.data?.map((emp) => ({
    label: emp.full_name,
    value: emp.id,
  }));

  useEffect(() => {
    dispatch(fetchEmployee({ search: searchValue, status: "Active" }));
  }, [dispatch, searchValue]);
  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "attachment_path") {
          if (value && value.length > 0) {
            formData.append("attachment_path", value[0]); // Append only the first file
          }
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, value ?? "");
        }
      });

      if (travelReimbursement) {
        await dispatch(
          updatetravelReimbursement({
            id: travelReimbursement.id,
            travelReimbursementData: formData,
          })
        ).unwrap();
      } else {
        await dispatch(createtravelReimbursement(formData)).unwrap();
      }

      closeButton?.click();
      reset();
      settravelReimbursement(null);
    } catch (error) {
      console.error("Error in submission", error);
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        settravelReimbursement(null);
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
  }, [settravelReimbursement]);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{travelReimbursement ? "Update" : "Add"} Travel Reimbursement</h4>

        <button
          type="button"
          className="btn-close custom-btn-close border p-1"
          data-bs-dismiss="offcanvas"
          onClick={() => {
            settravelReimbursement(null);
            reset();
          }}
        />
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {/* Employee */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Employee<span className="text-danger">*</span>
              </label>
              <Controller
                name="employee_id"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => {
                  const selected = (employeeOptions || []).find(
                    (opt) => opt.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      options={employeeOptions}
                      placeholder="Select Employee"
                      value={selected || null}
                      onInputChange={setSearchValue}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
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

            {/* Approved By */}
            {/* <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Approved By<span className="text-danger">*</span>
              </label>
              <Controller
                name="approved_by"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => {
                  const selected = (employeeOptions || []).find(
                    (opt) => opt.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      options={employeeOptions}
                      placeholder="Select Employee"
                      value={selected || null}
                      onInputChange={setSearchValue}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                    />
                  );
                }}
              />
              {errors.approved_by && (
                <small className="text-danger">
                  {errors.approved_by.message}
                </small>
              )}
            </div> */}

            {/* Travel Mode */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Travel Mode</label>
              <Controller
                name="travel_mode"
                control={control}
                render={({ field }) => (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Travel Mode"
                    {...field}
                  />
                )}
              />
            </div>

            {/* Advance Amount */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Advance Amount</label>
              <Controller
                name="advance_amount"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Advance Amount"
                    {...field}
                  />
                )}
              />
            </div>

            {/* Attachment Path */}

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Attachment</label>
              <input
                type="file"
                className={`form-control ${errors.attachment_path ? "is-invalid" : ""}`}
                accept=".pdf"
                {...register("attachment_path", {
                  required: "Attachment file is required.",
                  validate: {
                    isPdf: (files) =>
                      files[0]?.type === "application/pdf" ||
                      "Only PDF files are allowed.",
                  },
                })}
              />
              {errors.attachment_path && (
                <small className="text-danger">
                  {errors.attachment_path.message}
                </small>
              )}
            </div>

            {/* Currency */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Currency</label>
              <Controller
                name="currency"
                control={control}
                rules={{ required: "Currency is required" }}
                render={({ field }) => {
                  const selected = currencyOptions?.find(
                    (opt) => opt.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      options={currencyOptions}
                      isLoading={currencyLoading}
                      placeholder="Select Currency"
                      value={selected || null}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                    />
                  );
                }}
              />
            </div>

            {/* Exchange Rate */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Exchange Rate</label>
              <Controller
                name="exchange_rate"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Exchange Rate"
                    {...field}
                  />
                )}
              />
            </div>

            {/* Final Approved Amount */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Final Approved Amount</label>
              <Controller
                name="final_approved_amount"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Approved Amount"
                    {...field}
                  />
                )}
              />
            </div>

            {/* Travel Purpose */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Travel Purpose<span className="text-danger">*</span>
              </label>
              <Controller
                name="travel_purpose"
                control={control}
                rules={{ required: "Purpose is required" }}
                render={({ field }) => (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Purpose"
                    {...field}
                  />
                )}
              />
              {errors.travel_purpose && (
                <small className="text-danger">
                  {errors.travel_purpose.message}
                </small>
              )}
            </div>

            {/* Destination */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Destination<span className="text-danger">*</span>
              </label>
              <Controller
                name="destination"
                control={control}
                rules={{ required: "Destination is required" }}
                render={({ field }) => (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Destination"
                    {...field}
                  />
                )}
              />
              {errors.destination && (
                <small className="text-danger">
                  {errors.destination.message}
                </small>
              )}
            </div>

            {/* Start Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Start Date<span className="text-danger">*</span>
              </label>
              <Controller
                name="start_date"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Start Date"
                  />
                )}
              />
              {errors.start_date && (
                <small className="text-danger">
                  {errors.start_date.message}
                </small>
              )}
            </div>

            {/* End Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                End Date<span className="text-danger">*</span>
              </label>
              <Controller
                name="end_date"
                control={control}
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select End Date"
                  />
                )}
              />
              {errors.end_date && (
                <small className="text-danger">{errors.end_date.message}</small>
              )}
            </div>

            {/* Total Amount */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Total Amount<span className="text-danger">*</span>
              </label>
              <Controller
                name="total_amount"
                control={control}
                rules={{
                  required: "Amount is required",
                  min: {
                    value: 0,
                    message: "Amount must be greater than or equal to 0",
                  },
                }}
                render={({ field }) => (
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Amount"
                    {...field}
                  />
                )}
              />
              {errors.total_amount && (
                <small className="text-danger">
                  {errors.total_amount.message}
                </small>
              )}
            </div>

            {/* Expense Breakdown */}
            <div className="col-md-12 mb-3">
              <label className="col-form-label">Expense Breakdown</label>
              <Controller
                name="expense_breakdown"
                control={control}
                render={({ field }) => (
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter Expense Details"
                    {...field}
                  />
                )}
              />
            </div>
            {/* Remarks */}
            <div className="col-md-12 mb-3">
              <label className="col-form-label">Remarks</label>
              <Controller
                name="remarks"
                control={control}
                render={({ field }) => (
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter Remarks"
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {travelReimbursement
                ? loading
                  ? "Updating..."
                  : "Update"
                : loading
                  ? "Creating..."
                  : "Create"}
              {loading && (
                <div className="spinner-border spinner-border-sm ms-2" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagetravelReimbursement;
