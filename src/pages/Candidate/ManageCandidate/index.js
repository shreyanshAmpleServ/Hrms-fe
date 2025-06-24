import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { createCandidate, updateCandidate } from "../../../redux/Candidate";
import { fetchdesignation } from "../../../redux/designation";
import { fetchApplicationSource } from "../../../redux/ApplicationSource";
import { fetchInterviewStages } from "../../../redux/InterviewStages";

const ManageCandidate = ({ setCandidate, candidate }) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.candidate || {});

  const statusOptions = [
    { value: "P", label: "Pending" },
    { value: "A", label: "Approved" },
    { value: "R", label: "Rejected" },
  ];

  const genderOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
    { value: "O", label: "Other" },
  ];

  const { designation, loading: designationLoading } = useSelector(
    (state) => state.designation || {}
  );
  useEffect(() => {
    dispatch(fetchdesignation());
  }, []);

  const designationOptions = designation?.data?.map((i) => ({
    label: i?.designation_name,
    value: i?.id,
  }));

  const { applicationSource, loading: applicationSourceLoading } = useSelector(
    (state) => state.applicationSource || {}
  );
  useEffect(() => {
    dispatch(fetchApplicationSource());
  }, []);

  const applicationSourceOptions = applicationSource?.data?.map((i) => ({
    label: i?.source_name,
    value: i?.id,
  }));

  const { interviewStages, loading: interviewStagesLoading } = useSelector(
    (state) => state.interviewStages || {}
  );
  useEffect(() => {
    dispatch(fetchInterviewStages());
  }, []);

  const interviewStageOptions = interviewStages?.data?.map((i) => ({
    label: i?.stage_name,
    value: i?.id,
  }));

  const noShowFlagOptions = [
    { value: "N", label: "No" },
    { value: "Y", label: "Yes" },
  ];

  React.useEffect(() => {
    reset({
      full_name: candidate?.full_name || "",
      email: candidate?.email || "",
      phone: candidate?.phone || "",
      resume_path: candidate?.resume_path || "",
      status: candidate?.status || "",
      gender: candidate?.gender || "",
      status_remarks: candidate?.status_remarks || "",
      interview_stage: candidate?.interview_stage || "",
      interview1_remarks: candidate?.interview1_remarks || "",
      interview2_remarks: candidate?.interview2_remarks || "",
      interview3_remarks: candidate?.interview3_remarks || "",
      expected_joining_date: candidate?.expected_joining_date
        ? new Date(candidate.expected_joining_date).toISOString()?.slice(0, 10)
        : new Date().toISOString()?.slice(0, 10),
      actual_joining_date: candidate?.actual_joining_date
        ? new Date(candidate.actual_joining_date).toISOString()?.slice(0, 10)
        : new Date().toISOString()?.slice(0, 10),
      no_show_flag: candidate?.no_show_flag || "",
      no_show_marked_date: candidate?.no_show_marked_date
        ? new Date(candidate.no_show_marked_date).toISOString()?.slice(0, 10)
        : new Date().toISOString()?.slice(0, 10),
      no_show_remarks: candidate?.no_show_remarks || "",
      offer_accepted_date: candidate?.offer_accepted_date
        ? new Date(candidate.offer_accepted_date).toISOString()?.slice(0, 10)
        : new Date().toISOString()?.slice(0, 10),
      date_of_birth: candidate?.date_of_birth
        ? new Date(candidate.date_of_birth).toISOString()?.slice(0, 10)
        : new Date(new Date().setFullYear(new Date().getFullYear() - 18))
            .toISOString()
            ?.slice(0, 10),
      nationality: candidate?.nationality || "",
      applied_position_id: candidate?.applied_position_id?.toString() || "",
      application_source: candidate?.application_source || "",
    });
  }, [candidate, reset]);

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    try {
      candidate
        ? await dispatch(
            updateCandidate({
              id: candidate.id,
              candidateData: formData,
            })
          ).unwrap()
        : await dispatch(createCandidate(formData)).unwrap();
      closeButton.click();
      reset();
      setCandidate(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setCandidate(null);
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
  }, [setCandidate]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{candidate ? "Update " : "Add "} Candidate</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setCandidate(null);
              reset();
            }}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <label className="col-form-label">
                  Full Name <span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <Controller
                    name="full_name"
                    control={control}
                    rules={{ required: "Full name is required!" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
                        placeholder="Enter Full Name"
                      />
                    )}
                  />
                  {errors.full_name && (
                    <small className="text-danger">
                      {errors.full_name.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label className="col-form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required!",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        placeholder="Enter Email"
                      />
                    )}
                  />
                  {errors.email && (
                    <small className="text-danger">
                      {errors.email.message}
                    </small>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label className="col-form-label">
                  Phone <span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: "Phone is required!" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                        placeholder="Enter Phone"
                      />
                    )}
                  />
                  {errors.phone && (
                    <small className="text-danger">
                      {errors.phone.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label className="col-form-label">
                  Gender <span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender is required!" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="select"
                        placeholder="Select Gender"
                        options={genderOptions}
                        classNamePrefix="react-select"
                        value={genderOptions.find(
                          (x) => x.value === field.value
                        )}
                        onChange={(option) => field.onChange(option.value)}
                      />
                    )}
                  />
                  {errors.gender && (
                    <small className="text-danger">
                      {errors.gender.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <label className="col-form-label">Date of Birth</label>
                <div className="mb-3">
                  <Controller
                    name="date_of_birth"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        className="form-control"
                        placeholderText="Select Date of Birth"
                        value={
                          field.value
                            ? moment(field.value).format("DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => field.onChange(date)}
                        dateFormat="DD-MM-YYYY"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        maxDate={new Date()}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="col-form-label">Nationality</label>
                <div className="mb-3">
                  <Controller
                    name="nationality"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`form-control ${errors.nationality ? "is-invalid" : ""}`}
                        placeholder="Enter Nationality"
                      />
                    )}
                  />
                  {errors.nationality && (
                    <small className="text-danger">
                      {errors.nationality.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <label className="col-form-label">
                  Resume <span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <Controller
                    name="resume_path"
                    control={control}
                    rules={{ required: "Resume is required!" }}
                    render={({ field }) => (
                      <input
                        type="file"
                        className={`form-control ${errors.resume_path ? "is-invalid" : ""}`}
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          field.onChange(e.target.files[0]);
                        }}
                      />
                    )}
                  />
                  {errors.resume_path && (
                    <small className="text-danger">
                      {errors.resume_path.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label className="col-form-label">
                  Status <span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Status is required!" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="select"
                        placeholder="Select Status"
                        options={statusOptions}
                        classNamePrefix="react-select"
                        value={statusOptions.find(
                          (x) => x.value === field.value
                        )}
                        onChange={(option) => field.onChange(option.value)}
                      />
                    )}
                  />
                  {errors.status && (
                    <small className="text-danger">
                      {errors.status.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <label className="col-form-label">
                  Source <span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <Controller
                    name="application_source"
                    control={control}
                    rules={{ required: "Source is required!" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="select"
                        placeholder="Select Source"
                        options={applicationSourceOptions}
                        classNamePrefix="react-select"
                        isLoading={applicationSourceLoading}
                        value={applicationSourceOptions?.find(
                          (x) => x.value === field.value
                        )}
                        onChange={(option) => field.onChange(option.value)}
                      />
                    )}
                  />
                  {errors.application_source && (
                    <small className="text-danger">
                      {errors.application_source.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label className="col-form-label">
                  Applied Position <span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <Controller
                    name="applied_position_id"
                    control={control}
                    rules={{
                      required: "Applied position is required!",
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="select"
                        placeholder="Select Applied Position"
                        options={designationOptions || []}
                        classNamePrefix="react-select"
                        isLoading={designationLoading}
                        value={designationOptions?.find(
                          (x) => x.value === field.value
                        )}
                        onChange={(option) => field.onChange(option.value)}
                      />
                    )}
                  />
                  {errors.applied_position_id && (
                    <small className="text-danger">
                      {errors.applied_position_id.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <label className="col-form-label">
                  Interview Stage <span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <Controller
                    name="interview_stage"
                    control={control}
                    rules={{ required: "Interview stage is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="select"
                        options={interviewStageOptions}
                        placeholder="Select Interview Stage"
                        classNamePrefix="react-select"
                        value={interviewStageOptions?.find(
                          (x) => x.value === field.value
                        )}
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption.value)
                        }
                      />
                    )}
                  />
                  {errors.interview_stage && (
                    <small className="text-danger">
                      {errors.interview_stage.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label className="col-form-label">Expected Joining Date</label>
                <div className="mb-3 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-calendar-check" />
                  </span>
                  <Controller
                    name="expected_joining_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        className="form-control"
                        placeholderText="Select Expected Joining Date"
                        value={
                          field.value
                            ? moment(field.value).format("DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => field.onChange(date)}
                        dateFormat="DD-MM-YYYY"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        minDate={new Date()}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <label className="col-form-label">Actual Joining Date</label>
                <div className="mb-3 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-calendar-check" />
                  </span>
                  <Controller
                    name="actual_joining_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        className="form-control"
                        placeholderText="Select Actual Joining Date"
                        value={
                          field.value
                            ? moment(field.value).format("DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => field.onChange(date)}
                        dateFormat="DD-MM-YYYY"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="col-form-label">Offer Accepted Date</label>
                <div className="mb-3 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-calendar-check" />
                  </span>
                  <Controller
                    name="offer_accepted_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        className="form-control"
                        placeholderText="Select Offer Accepted Date"
                        value={
                          field.value
                            ? moment(field.value).format("DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => field.onChange(date)}
                        dateFormat="DD-MM-YYYY"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                      />
                    )}
                  />
                  {errors.offer_accepted_date && (
                    <small className="text-danger">
                      {errors.offer_accepted_date.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <label className="col-form-label">
                  Status Remarks{" "}
                  <span className="text-muted">(max 255 characters)</span>{" "}
                  <span className="text-danger">*</span>
                </label>
                <div className="mb-3">
                  <Controller
                    name="status_remarks"
                    control={control}
                    rules={{
                      required: "Status remarks is required!",

                      maxLength: {
                        value: 255,
                        message:
                          "Status remarks must be less than 255 characters long",
                      },
                    }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        className={`form-control ${errors.status_remarks ? "is-invalid" : ""}`}
                        placeholder="Enter Status Remarks"
                      />
                    )}
                  />
                  {errors.status_remarks && (
                    <small className="text-danger">
                      {errors.status_remarks.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* <div className="row">
              <div className="col-md-12">
                <label className="col-form-label">
                  Interview 1 Remarks{" "}
                  <span className="text-muted">(5 - 255 characters)</span>{" "}
                </label>
                <div className="mb-3">
                  <Controller
                    name="interview1_remarks"
                    control={control}
                    rules={{
                      minLength: {
                        value: 5,
                        message:
                          "Interview 1 remarks must be at least 5 characters long",
                      },
                      maxLength: {
                        value: 255,
                        message:
                          "Interview 1 remarks must be less than 255 characters long",
                      },
                    }}
                    render={({ field }) => (
                      <textarea
                        rows={3}
                        {...field}
                        className={`form-control ${errors.interview1_remarks ? "is-invalid" : ""}`}
                        placeholder="Enter Interview 1 Remarks"
                      />
                    )}
                  />
                  {errors.interview1_remarks && (
                    <small className="text-danger">
                      {errors.interview1_remarks.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <label className="col-form-label">
                  Interview 2 Remarks{" "}
                  <span className="text-muted">(5 - 255 characters)</span>{" "}
                </label>
                <div className="mb-3">
                  <Controller
                    name="interview2_remarks"
                    control={control}
                    rules={{
                      minLength: {
                        value: 5,
                        message:
                          "Interview 2 remarks must be at least 5 characters long",
                      },
                      maxLength: {
                        value: 255,
                        message:
                          "Interview 2 remarks must be less than 255 characters long",
                      },
                    }}
                    render={({ field }) => (
                      <textarea
                        rows={3}
                        {...field}
                        className={`form-control ${errors.interview2_remarks ? "is-invalid" : ""}`}
                        placeholder="Enter Interview 2 Remarks"
                      />
                    )}
                  />
                  {errors.interview2_remarks && (
                    <small className="text-danger">
                      {errors.interview2_remarks.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <label className="col-form-label">
                  Interview 3 Remarks{" "}
                  <span className="text-muted">(5 - 255 characters)</span>{" "}
                </label>
                <div className="mb-3">
                  <Controller
                    name="interview3_remarks"
                    control={control}
                    rules={{
                      minLength: {
                        value: 5,
                        message:
                          "Interview 3 remarks must be at least 5 characters long",
                      },
                      maxLength: {
                        value: 255,
                        message:
                          "Interview 3 remarks must be less than 255 characters long",
                      },
                    }}
                    render={({ field }) => (
                      <textarea
                        rows={3}
                        {...field}
                        className={`form-control ${errors.interview3_remarks ? "is-invalid" : ""}`}
                        placeholder="Enter Interview 3 Remarks"
                      />
                    )}
                  />
                  {errors.interview3_remarks && (
                    <small className="text-danger">
                      {errors.interview3_remarks.message}
                    </small>
                  )}
                </div>
              </div>
            </div> */}

            <div className="row">
              <div className="col-md-6">
                <label className="col-form-label">No Show Flag</label>
                <div className="mb-3">
                  <Controller
                    name="no_show_flag"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className="select"
                        placeholder="Select No Show Flag"
                        options={noShowFlagOptions}
                        classNamePrefix="react-select"
                        value={noShowFlagOptions.find(
                          (x) => x.value === field.value
                        )}
                        onChange={(option) => field.onChange(option.value)}
                      />
                    )}
                  />
                  {errors.no_show_flag && (
                    <small className="text-danger">
                      {errors.no_show_flag.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label className="col-form-label">No Show Marked Date</label>
                <div className="mb-3 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-calendar-check" />
                  </span>
                  <Controller
                    name="no_show_marked_date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        className="form-control"
                        placeholderText="Select No Show Marked Date"
                        value={
                          field.value
                            ? moment(field.value).format("DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => field.onChange(date)}
                        dateFormat="DD-MM-YYYY"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <label className="col-form-label">
                  No Show Remarks{" "}
                  <span className="text-muted">(5 - 255 characters)</span>{" "}
                </label>
                <div className="mb-3">
                  <Controller
                    name="no_show_remarks"
                    control={control}
                    rules={{
                      minLength: {
                        value: 5,
                        message:
                          "No show remarks must be at least 5 characters long",
                      },
                      maxLength: {
                        value: 255,
                        message:
                          "No show remarks must be less than 255 characters long",
                      },
                    }}
                    render={({ field }) => (
                      <textarea
                        rows={3}
                        {...field}
                        className={`form-control ${errors.no_show_remarks ? "is-invalid" : ""}`}
                        placeholder="Enter No Show Remarks"
                      />
                    )}
                  />
                  {errors.no_show_remarks && (
                    <small className="text-danger">
                      {errors.no_show_remarks.message}
                    </small>
                  )}
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
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {candidate
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
                    className="spinner-border ms-2 text-light"
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

export default ManageCandidate;
