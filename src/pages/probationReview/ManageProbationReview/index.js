import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createprobationReview,
  updateprobationReview,
} from "../../../redux/ProbationReview";

const ManageProbationReview = ({ setprobationReview, probationReview }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: "",
      probation_end_date: new Date().toISOString(),
      review_notes: "",
      confirmation_status: "",
      confirmation_date: new Date().toISOString(),
      review_meeting_date: new Date().toISOString(),
      performance_rating: "",
      extension_required: "",
      extension_reason: "",
      extended_till_date: new Date().toISOString(),
      next_review_date: new Date().toISOString(),
      final_remarks: "",
      reviewer_id: "",
    },
  });

  useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
  }, [dispatch, searchValue]);

  useEffect(() => {
    if (probationReview) {
      reset({
        employee_id: probationReview.employee_id || "",
        probation_end_date:
          probationReview.probation_end_date || new Date().toISOString(),
        review_notes: probationReview.review_notes || "",
        confirmation_status: probationReview.confirmation_status || "",
        confirmation_date:
          probationReview.confirmation_date || new Date().toISOString(),
        review_meeting_date:
          probationReview.review_meeting_date || new Date().toISOString(),
        performance_rating: probationReview.performance_rating || "",
        extension_required: probationReview.extension_required || "",
        extension_reason: probationReview.extension_reason || "",
        extended_till_date:
          probationReview.extended_till_date || new Date().toISOString(),

        next_review_date:
          probationReview.next_review_date || new Date().toISOString(),
        final_remarks: probationReview.final_remarks || "",
        reviewer_id: probationReview.reviewer_id || "",
      });
    } else {
      reset({
        employee_id: "",
        probation_end_date: new Date().toISOString(),
        review_notes: "",
        confirmation_status: "",
        confirmation_date: new Date().toISOString(),
        review_meeting_date: new Date().toISOString(),
        performance_rating: "",
        extension_required: "",
        extension_reason: "",
        extended_till_date: new Date().toISOString(),
        next_review_date: new Date().toISOString(),
        final_remarks: "",
        reviewer_id: "",
      });
    }
  }, [probationReview, reset]);

  const { employee } = useSelector((state) => state.employee || {});
  const { loading } = useSelector((state) => state.probationReview || {});

  const employeeOptions = employee?.data?.map((emp) => ({
    label: emp.full_name,
    value: emp.id,
  }));

  const statusOptions = [
    { label: "Confirmed", value: "Confirmed" },
    { label: "Extended", value: "Extended" },
    { label: "Terminated", value: "Terminated" },
  ];
  const statusOption = [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      if (probationReview) {
        await dispatch(
          updateprobationReview({
            id: probationReview.id,
            probationReviewData: { ...data },
          })
        ).unwrap();
      } else {
        await dispatch(createprobationReview({ ...data })).unwrap();
      }
      closeButton?.click();
      reset();
      setprobationReview(null);
    } catch (error) {
      console.error("Submission error:", error);
      closeButton?.click();
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setprobationReview(null);
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
  }, [setprobationReview]);
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{probationReview ? "Update" : "Add"} Probation Review</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1"
          data-bs-dismiss="offcanvas"
          onClick={() => {
            setprobationReview(null);
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
                  const selected = employeeOptions?.find(
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
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Reviewer<span className="text-danger">*</span>
              </label>
              <Controller
                name="reviewer_id"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => {
                  const selected = employeeOptions?.find(
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
              {errors.reviewer_id && (
                <small className="text-danger">
                  {errors.reviewer_id.message}
                </small>
              )}
            </div>
            {/* Probation End Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Probation End Date<span className="text-danger">*</span>
              </label>
              <Controller
                name="probation_end_date"
                control={control}
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <DatePicker
                    className="form-control"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select End Date"
                  />
                )}
              />
              {errors.probation_end_date && (
                <small className="text-danger">
                  {errors.probation_end_date.message}
                </small>
              )}
            </div>

            {/* Confirmation Status */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Confirmation Status<span className="text-danger">*</span>
              </label>
              <Controller
                name="confirmation_status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => {
                  const selected = statusOptions.find(
                    (opt) => opt.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      options={statusOptions}
                      value={selected || null}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                      placeholder="Select Status"
                    />
                  );
                }}
              />
              {errors.confirmation_status && (
                <small className="text-danger">
                  {errors.confirmation_status.message}
                </small>
              )}
            </div>

            {/* Confirmation Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Confirmation Date</label>
              <Controller
                name="confirmation_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className="form-control"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select Confirmation Date"
                  />
                )}
              />
            </div>
            {/* Review Meeting Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Review Meeting Date</label>
              <Controller
                name="review_meeting_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className="form-control"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select Confirmation Date"
                  />
                )}
              />
            </div>

            {/* Performance Rating */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Performance Rating</label>
              <Controller
                name="performance_rating"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="form-control"
                    placeholder="Enter Performance Rating"
                  />
                )}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Extension Required<span className="text-danger">*</span>
              </label>
              <Controller
                name="extension_required"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => {
                  const selected = statusOption.find(
                    (opt) => opt.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      options={statusOption}
                      value={selected || null}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                      placeholder="Select Status"
                    />
                  );
                }}
              />
              {errors.extension_required && (
                <small className="text-danger">
                  {errors.extension_required.message}
                </small>
              )}
            </div>

            {/* Extended Till Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Extended Till Date</label>
              <Controller
                name="extended_till_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className="form-control"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select Confirmation Date"
                  />
                )}
              />
            </div>

            {/* Next Review Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Next Review Date</label>
              <Controller
                name="next_review_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className="form-control"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select Confirmation Date"
                  />
                )}
              />
            </div>

            {/* Final Remarks */}
            <div className="col-12 mb-3">
              <label className="col-form-label">
                Final Remarks{" "}
                <small className="text-muted">(Max 255 characters)</small>
              </label>
              <Controller
                name="final_remarks"
                control={control}
                rules={{
                  maxLength: {
                    value: 255,
                    message:
                      "Final remarks must be less than or equal to 255 characters",
                  },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    maxLength={255}
                    className="form-control"
                    placeholder="Enter Final Remarks"
                  />
                )}
              />
            </div>

            {/* Review Notes */}
            <div className="col-12 mb-3">
              <label className="col-form-label">
                Review Notes{" "}
                <small className="text-muted">(Max 255 characters)</small>
              </label>
              <Controller
                name="review_notes"
                control={control}
                rules={{
                  required: " Review Notes is required!",
                  maxLength: {
                    value: 255,
                    message:
                      " Review Notes must be less than or equal to 255 characters",
                  },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    maxLength={255}
                    className="form-control"
                    placeholder="Enter  Review Notes "
                  />
                )}
              />
            </div>

            <div className="col-12 mb-3">
              <label className="col-form-label">
                Extension Required{" "}
                <small className="text-muted">(Max 255 characters)</small>
              </label>
              <Controller
                name="extension_reason"
                control={control}
                rules={{
                  required: "Extension Required is required!",
                  maxLength: {
                    value: 255,
                    message:
                      "Extension Required must be less than or equal to 255 characters",
                  },
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    maxLength={255}
                    className="form-control"
                    placeholder="Enter Extension Required"
                  />
                )}
              />
            </div>
          </div>

          {/* Submit/Cancel Buttons */}
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {probationReview
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

export default ManageProbationReview;
