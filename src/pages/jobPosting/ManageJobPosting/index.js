import moment from "moment";
import React, { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm, } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  fetchdepartment

} from "../../../redux/department"; // Update path as needed
import { fetchdesignation } from "../../../redux/designation"
import {
  createJobPosting,
  updateJobPosting,
} from "../../../redux/JobPosting"; // You need to create this

const ManageJobPosting = ({ setJobPosting, JobPosting }) => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const department = useSelector((state) => state.department.department);
  const designation = useSelector((state) => state.designation.designation);
  const { loading } = useSelector((state) => state.JobPosting || {});


  const DepartmentList = useMemo(
    () =>
      department?.data?.map((item) => ({
        value: item.id,
        label: item.department_name,
      })) || [],
    [department]
  );

  const DesignationList = useMemo(
    () =>
      designation?.data?.map((item) => ({
        value: item.id,
        label: item.designation_name,
      })) || [],
    [designation]
  );


  useEffect(() => {
    reset({
      department_id: JobPosting?.department_id || "",
      designation_id: JobPosting?.designation_id || "",
      job_title: JobPosting?.job_title || "",
      description: JobPosting?.description || "",
      required_experience: JobPosting?.required_experience || "",
      posting_date: JobPosting?.posting_date ? new Date(JobPosting.posting_date) : new Date(),
      closing_date: JobPosting?.closing_date ? new Date(JobPosting.closing_date) : new Date(),
      is_internal: JobPosting?.is_internal || false,
    });
  }, [JobPosting, reset]);

  useEffect(() => {
    dispatch(fetchdepartment());
    dispatch(fetchdesignation());
  }, [dispatch]);

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      JobPosting
        ? await dispatch(updateJobPosting({ id: JobPosting.id, JobPostingData: data })).unwrap()
        : await dispatch(createJobPosting(data)).unwrap();
      closeButton.click();
      reset();
      setJobPosting(null);
    } catch (error) {
      closeButton.click();
    }
  };

  return (
    <div className="offcanvas offcanvas-end offcanvas-large" tabIndex={-1} id="offcanvas_add">
      <div className="offcanvas-header border-bottom">
        <h4>{JobPosting ? "Update" : "Add New"} Job Posting</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => {
            setJobPosting(null);
            reset();
          }}
        >
          <i className="ti ti-x" />
        </button>
      </div>

      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Department <span className="text-danger">*</span></label>
              <Controller
                name="department_id"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="select"
                    options={DepartmentList}
                    placeholder="Select Department"
                    classNamePrefix="react-select"
                    value={DepartmentList.find((opt) => opt.value === field.value)}
                    onChange={(opt) => field.onChange(opt.value)}
                  />
                )}
              />
              {errors.department_id && <small className="text-danger">{errors.department_id.message}</small>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Designation <span className="text-danger">*</span></label>
              <Controller
                name="designation_id"
                control={control}
                rules={{ required: "Designation is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="select"
                    options={DesignationList}
                    placeholder="Select Designation"
                    classNamePrefix="react-select"
                    value={DesignationList.find((opt) => opt.value === field.value)}
                    onChange={(opt) => field.onChange(opt.value)}
                  />
                )}
              />
              {errors.designation_id && <small className="text-danger">{errors.designation_id.message}</small>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Job Title <span className="text-danger">*</span></label>
              <Controller
                name="job_title"
                control={control}
                rules={{ required: "Job title is required" }}
                render={({ field }) => (
                  <input {...field} className="form-control" placeholder="Enter Job Title" />
                )}
              />
              {errors.job_title && <small className="text-danger">{errors.job_title.message}</small>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Experience <span className="text-danger">*</span></label>
              <Controller
                name="required_experience"
                control={control}
                rules={{ required: "Experience is required" }}
                render={({ field }) => (
                  <input {...field} className="form-control" placeholder="Required Experience" />
                )}
              />
              {errors.required_experience && <small className="text-danger">{errors.required_experience.message}</small>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Posting Date <span className="text-danger">*</span></label>
              <Controller
                name="posting_date"
                control={control}
                rules={{ required: "Posting date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="form-control"
                    selected={field.value}
                    dateFormat="dd-MM-yyyy"
                    onChange={(date) => field.onChange(date)}
                  />
                )}
              />
              {errors.posting_date && <small className="text-danger">{errors.posting_date.message}</small>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Closing Date <span className="text-danger">*</span></label>
              <Controller
                name="closing_date"
                control={control}
                rules={{ required: "Closing date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="form-control"
                    selected={field.value}
                    dateFormat="dd-MM-yyyy"
                    onChange={(date) => field.onChange(date)}
                  />
                )}
              />
              {errors.closing_date && <small className="text-danger">{errors.closing_date.message}</small>}
            </div>

            <div className="col-md-12 mb-3">
              <label className="col-form-label">Description <span className="text-danger">*</span></label>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <textarea {...field} rows={4} className="form-control" placeholder="Enter Description" />
                )}
              />
              {errors.description && <small className="text-danger">{errors.description.message}</small>}
            </div>

            <div className="col-md-12 mb-3 form-check ms-3 ">
              <Controller
                name="is_internal"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
              <label className="form-check-label ms-2">Is Internal Job?</label>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-light me-2" data-bs-dismiss="offcanvas">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {JobPosting ? (loading ? "Updating..." : "Update") : loading ? "Creating..." : "Create"}
              {loading && (
                <div className="spinner-border text-light ms-2" style={{ height: "15px", width: "15px" }} role="status" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageJobPosting;
