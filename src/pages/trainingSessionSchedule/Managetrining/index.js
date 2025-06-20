import moment from "moment";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createtrainingSession,
  updatetrainingSession,
} from "../../../redux/trainingSessionSchedule";
import { fetchEmployee } from "../../../redux/Employee";
import Select from "react-select";
import { fetchdepartment } from "../../../redux/department";

const ManagetrainingSession = ({ settrainingSession, trainingSession }) => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      trainer_id: "",
      training_title: "",
      trainer_id: "",
      training_date: new Date().toISOString(),
      location: "",
      training_type: "",
      training_objective: "",
      department_id: "",
      audience_level: "",
      participant_limit: "",
      duration_hours: "",
      training_material_path: "",
      evaluation_required: "",
      feedback_required: "",
      training_status: "Panding",
    },
  });

  const { loading } = useSelector((state) => state.trainingSession || {});
  const [searchValue, setSearchValue] = useState("");

  React.useEffect(() => {
    if (trainingSession) {
      reset({
        training_title: trainingSession.training_title || "",
        trainer_id: trainingSession.trainer_id || "",
        training_date:
          trainingSession.training_date || new Date().toISOString(),
        location: trainingSession.location || "",
        training_type: trainingSession.training_type || "",
        training_objective: trainingSession.training_objective || "",
        department_id: trainingSession.department_id || "",
        audience_level: trainingSession.audience_level || "",
        participant_limit: trainingSession.participant_limit || "",
        duration_hours: trainingSession.duration_hours || "",
        training_material_path: trainingSession.training_material_path || "",
        evaluation_required: trainingSession.evaluation_required || "",
        feedback_required: trainingSession.feedback_required || "",
        training_status: trainingSession.training_status || "Panding",
      });
    } else {
      reset({
        trainer_id: "",
        training_title: "",
        trainer_id: "",
        training_date: new Date().toISOString(),
        location: "",
        training_type: "",
        training_objective: "",
        department_id: "",
        audience_level: "",
        participant_limit: "",
        duration_hours: "",
        training_material_path: "",
        evaluation_required: "",
        feedback_required: "",
        training_status: "Panding",
      });
    }
  }, [trainingSession]);

  const trainingOptions = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
    { value: "Hybrid", label: "Hybrid" },
  ];
  // const trainingStatusOptions = [
  //   { label: "Planned", value: "planned" },
  //   { label: "Ongoing", value: "ongoing" },
  //   { label: "Completed", value: "completed" },
  //   { label: "Cancelled", value: "cancelled" },
  // ];
  const audienceLevelOptions = [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ];

  useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
    dispatch(fetchdepartment({ searchValue }));
  }, [dispatch, searchValue]);

  useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
  }, [dispatch, searchValue]);

  // ✅ Get employee state from Redux
  const { employee } = useSelector((state) => state.employee || {});

  const { department } = useSelector((state) => state.department);

  const departmentOptions = department?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.department_name,
  }));

  // ✅ Format for react-select
  const employeeOptions = employee?.data?.map((emp) => ({
    label: emp.full_name,
    value: emp.id,
  }));

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');

    const resumeFile = data.training_material_path?.[0];

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        if (key === "training_material_path") {
          formData.append(key, resumeFile); // Append the actual file
        } else if (data[key] instanceof Date) {
          formData.append(key, new Date(data[key]).toISOString());
        } else {
          formData.append(
            key,
            typeof data[key] === "object"
              ? JSON.stringify(data[key])
              : data[key]
          );
        }
      }
    });
    try {
      if (trainingSession) {
        await dispatch(
          updatetrainingSession({
            id: trainingSession.id,
            trainingSessionData: formData,
          })
        ).unwrap();
      } else {
        await dispatch(createtrainingSession(formData)).unwrap();
      }
      closeButton?.click();
      reset();
      settrainingSession(null);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        settrainingSession(null);
        reset();
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
  }, [settrainingSession, reset]);

  console.log("trainingSession", trainingSession);
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{trainingSession ? "Update " : "Add  "} Training Session</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => {
            settrainingSession(null);
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
              <label className="col-form-label">
                Training Title <span className="text-danger">*</span>
              </label>
              <Controller
                name="training_title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field?.value}
                    className="form-control"
                    placeholder="Enter Training Litle"
                  />
                )}
              />
              {errors.training_title && (
                <small className="text-danger">
                  {errors.training_title.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Trainer Name <span className="text-danger">*</span>
              </label>
              <Controller
                name="trainer_id"
                control={control}
                rules={{ required: "Potential successor is required" }}
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

              {errors.trainer_id && (
                <small className="text-danger">
                  {errors.trainer_id.message}
                </small>
              )}
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Department
                  <span className="text-danger">*</span>
                </label>
                <Controller
                  name="department_id"
                  rules={{ required: "Department is required" }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={departmentOptions}
                      placeholder="Choose Department"
                      classNamePrefix="react-select"
                      value={
                        departmentOptions?.find(
                          (option) => option.value === watch("department_id")
                        ) || ""
                      }
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value || null);
                      }}
                    />
                  )}
                />
                {errors.department_id && (
                  <small className="text-danger">
                    {errors.department_id.message}
                  </small>
                )}
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Training Date <span className="text-danger">*</span>
              </label>
              <Controller
                name="training_date"
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
                    placeholderText="Select Date"
                  />
                )}
              />
              {errors.training_date && (
                <small className="text-danger">
                  {errors.training_date.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Location</label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    className="form-control"
                    placeholder="Enter Location"
                  />
                )}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Training Type</label>
              <Controller
                name="training_type"
                control={control}
                rules={{ required: "training_type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className="select"
                    options={trainingOptions}
                    placeholder="Select Training Type "
                    classNamePrefix="react-select"
                    value={trainingOptions.find((x) => x.value === field.value)}
                    onChange={(option) => field.onChange(option.value)}
                  />
                )}
              />
              {errors.training_type && (
                <small className="text-danger">
                  {errors.training_type.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Training Objective</label>
              <input
                type="text"
                className="form-control"
                placeholder="Training Objective"
                {...register("training_objective", {
                  required: "Training Objective is required",
                })}
              />
              {errors.training_objective && (
                <small className="text-danger">
                  {errors.training_objective.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Audience Level</label>
              <Controller
                name="audience_level"
                control={control}
                rules={{ required: "Audience Level is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={audienceLevelOptions}
                    placeholder="Select Audience Level"
                    classNamePrefix="react-select"
                    value={audienceLevelOptions.find(
                      (x) => x.value === field.value
                    )}
                    onChange={(option) => field.onChange(option.value)}
                  />
                )}
              />
              {errors.audience_level && (
                <small className="text-danger">
                  {errors.audience_level.message}
                </small>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Participant Limit</label>
              <input
                type="number"
                className="form-control"
                placeholder="Participant Limit"
                {...register("participant_limit", {
                  required: "Participant limit is required",
                })}
              />
              {errors.participant_limit && (
                <small className="text-danger">
                  {errors.participant_limit.message}
                </small>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Duration (Hours)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Duration (Hours)"
                {...register("duration_hours", {
                  required: "Duration is required",
                })}
              />
              {errors.duration_hours && (
                <small className="text-danger">
                  {errors.duration_hours.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Training Material</label>
              <input
                type="file"
                className={`form-control ${errors.training_material_path ? "is-invalid" : ""}`}
                accept=".pdf"
                {...register("training_material_path", {
                  required: "Resume file is required.",
                  validate: {
                    isPdf: (files) =>
                      files[0]?.type === "application/pdf" ||
                      "Only PDF files are allowed.",
                  },
                })}
              />
              {errors.training_material_path && (
                <small className="text-danger">
                  {errors.training_material_path.message}
                </small>
              )}
            </div>

            {/* <div className="col-md-6 mb-3">
              <label className="col-form-label">Training Status</label>
              <Controller
                name="training_status"
                control={control}
                rules={{ required: "Training status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={trainingStatusOptions}
                    placeholder="Select Training Status"
                    classNamePrefix="react-select"
                    value={trainingStatusOptions.find(
                      (x) => x.value === field.value
                    )}
                    onChange={(option) => field.onChange(option.value)}
                  />
                )}
              />
              {errors.training_status && (
                <small className="text-danger">
                  {errors.training_status.message}
                </small>
              )}
            </div> */}

            <div className="col-12 mb-3">
              <label className="form-label">
                Feedback Required{" "}
                <small className="text-muted">(Max 255 characters)</small>
              </label>

              <Controller
                name="feedback_required"
                control={control}
                rules={{
                  required: "Feedback Required  is required!",
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
                    onChange={(option) => field.onChange(option)}
                    placeholder="Enter Feedback Required "
                  />
                )}
              />
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">
                Evaluation Required{" "}
                <small className="text-muted">(Max 255 characters)</small>
              </label>

              <Controller
                name="evaluation_required"
                control={control}
                rules={{
                  required: "Evaluation Required   is required!",
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
                    onChange={(option) => field.onChange(option)}
                    className="form-control"
                    placeholder="Enter Evaluation Required"
                  />
                )}
              />
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
              {trainingSession
                ? loading
                  ? "Updating..."
                  : "Update"
                : loading
                  ? "Creating..."
                  : "Create"}
              {loading && (
                <div
                  style={{ height: "15px", width: "15px" }}
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
  );
};

export default ManagetrainingSession;
