import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createtrainingFeedback,
  updatetrainingFeedback,
} from "../../../redux/trainingFeedbackEntry";
import { fetchtrainingSession } from "../../../redux/trainingSessionSchedule";

const ManagetrainingFeedback = ({ settrainingFeedback, trainingFeedback }) => {
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
      training_id: "",
      feedback_text: "",
      rating: null,
    },
  });

  useEffect(() => {
    dispatch(fetchEmployee({ search: searchValue, is_active: true }));
    dispatch(fetchtrainingSession({ is_active: true }));
  }, [dispatch, searchValue]);

  useEffect(() => {
    if (trainingFeedback) {
      reset({
        employee_id: trainingFeedback.employee_id || "",
        training_id: trainingFeedback.training_id || "",
        feedback_text: trainingFeedback.feedback_text || "",
        rating: trainingFeedback.rating || null,
      });
    } else {
      reset({
        employee_id: "",
        training_id: "",
        feedback_text: "",
        rating: null,
      });
    }
  }, [trainingFeedback, reset]);

  const { employee } = useSelector((state) => state.employee || {});
  const { trainingSession } = useSelector(
    (state) => state.trainingSession || {}
  );
  const { loading } = useSelector((state) => state.trainingFeedback || {});

  const employeeOptions = employee?.data?.map((emp) => ({
    label: emp.full_name,
    value: emp.id,
  }));

  const trainingOptions = trainingSession?.data?.map((t) => ({
    label: t.training_title,
    value: t.id,
  }));

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      if (trainingFeedback) {
        await dispatch(
          updatetrainingFeedback({
            id: trainingFeedback.id,
            trainingFeedbackData: { ...data },
          })
        ).unwrap();
      } else {
        await dispatch(createtrainingFeedback({ ...data })).unwrap();
      }
      closeButton?.click();
      reset();
      settrainingFeedback(null);
    } catch (error) {
      console.error("Submission error:", error);
      closeButton?.click();
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        settrainingFeedback(null);
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
  }, [settrainingFeedback, reset]);
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{trainingFeedback ? "Update" : "Add "} Training Feedback</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1"
          data-bs-dismiss="offcanvas"
          onClick={() => {
            settrainingFeedback(null);
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

            {/* Training */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Training Session<span className="text-danger">*</span>
              </label>
              <Controller
                name="training_id"
                control={control}
                rules={{ required: "Training is required" }}
                render={({ field }) => {
                  const selected = (trainingOptions || []).find(
                    (opt) => opt.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      options={trainingOptions}
                      placeholder="Select Training"
                      value={selected || null}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                    />
                  );
                }}
              />
              {errors.training_id && (
                <small className="text-danger">
                  {errors.training_id.message}
                </small>
              )}
            </div>

            <div className="col-md-6">
              <label className="col-form-label">
                Rating<span className="text-danger"> *</span>
              </label>
              <div className="mb-3">
                <Controller
                  name="rating"
                  control={control}
                  rules={{
                    required: "Rating is required!",
                    min: {
                      value: 1,
                      message: "Rating must be at least 1",
                    },
                    max: {
                      value: 5,
                      message: "Rating cannot exceed 5",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min={1}
                      max={5}
                      className="form-control"
                      placeholder="Enter Rating (1-5)"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.rating && (
                <small className="text-danger">{errors.rating.message}</small>
              )}
            </div>
            {/* Feedback */}
            <div className="col-12 mb-3">
              <label className="form-label">
                Feedback{" "}
                <small className="text-muted">(Max 255 characters)</small>
              </label>

              <Controller
                name="feedback_text"
                control={control}
                rules={{
                  required: "feedback is required!",
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
                    placeholder="Enter Feedback Text"
                  />
                )}
              />
            </div>

            {/* Rating */}
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
              {trainingFeedback
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

export default ManagetrainingFeedback;
