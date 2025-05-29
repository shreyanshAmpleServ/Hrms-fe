import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DefaultEditor from "react-simple-wysiwyg";
import { fetchEmployee } from "../../../redux/Employee";
import { createprobationReview, updateprobationReview } from "../../../redux/ProbationReview";

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
      probation_end_date: "",
      review_notes: "",
      confirmation_status: "",
      confirmation_date: "",
    },
  });

  useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
  }, [dispatch, searchValue]);

  useEffect(() => {
    if (probationReview) {
      reset({
        employee_id: probationReview.employee_id || "",
        probation_end_date: probationReview.probation_end_date || "",
        review_notes: probationReview.review_notes || "",
        confirmation_status: probationReview.confirmation_status || "",
        confirmation_date: probationReview.confirmation_date || "",
      });
    } else {
      reset({
        employee_id: "",
        probation_end_date: "",
        review_notes: "",
        confirmation_status: "",
        confirmation_date: "",
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

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      if (probationReview) {
        await dispatch(updateprobationReview({
          id: probationReview.id,
          probationReviewData: { ...data },
        })).unwrap();
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

  return (
    <div className="offcanvas offcanvas-end offcanvas-large" tabIndex={-1} id="offcanvas_add">
      <div className="offcanvas-header border-bottom">
        <h4>{probationReview ? "Update" : "Add New"} Probation Review</h4>
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
              <label className="col-form-label">Employee<span className="text-danger">*</span></label>
              <Controller
                name="employee_id"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => {
                  const selected = employeeOptions?.find(opt => opt.value === field.value);
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
              {errors.employee_id && <small className="text-danger">{errors.employee_id.message}</small>}
            </div>

            {/* Probation End Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Probation End Date<span className="text-danger">*</span></label>
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
                    placeholderText="Select end date"
                  />
                )}
              />
              {errors.probation_end_date && <small className="text-danger">{errors.probation_end_date.message}</small>}
            </div>

            {/* Confirmation Status */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Confirmation Status<span className="text-danger">*</span></label>
              <Controller
                name="confirmation_status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => {
                  const selected = statusOptions.find(opt => opt.value === field.value);
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
              {errors.confirmation_status && <small className="text-danger">{errors.confirmation_status.message}</small>}
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
                    placeholderText="Select confirmation date"
                  />
                )}
              />
            </div>

            {/* Review Notes */}
            <div className="col-12 mb-3">
              <label className="col-form-label">Review Notes</label>
              <Controller
                name="review_notes"
                control={control}
                render={({ field }) => (
                  <DefaultEditor value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </div>

          {/* Submit/Cancel Buttons */}
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-light me-2" data-bs-dismiss="offcanvas">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {probationReview ? (loading ? "Updating..." : "Update") : loading ? "Creating..." : "Create"}
              {loading && <div className="spinner-border spinner-border-sm ms-2" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageProbationReview;
