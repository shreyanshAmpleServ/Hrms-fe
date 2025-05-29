import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createtrainingSession, updatetrainingSession } from "../../../redux/trainingSessionSchedule";

const ManagetrainingSession = ({ settrainingSession, trainingSession }) => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      training_title: "",
      trainer_name: "",
      training_date: "",
      location: "",
      training_type: "",
    },
  });

  const { loading } = useSelector((state) => state.trainingSession || {});

  useEffect(() => {
    if (trainingSession) {
      reset({
        training_title: trainingSession.training_title || "",
        trainer_name: trainingSession.trainer_name || "",
        training_date: trainingSession.training_date || "",
        location: trainingSession.location || "",
        training_type: trainingSession.training_type || "",
      });
    } else {
      reset();
    }
  }, [trainingSession, reset]);

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      if (trainingSession) {
        await dispatch(
          updatetrainingSession({
            id: trainingSession.id,
            trainingSessionData: { ...data },
          })
        ).unwrap();
      } else {
        await dispatch(createtrainingSession(data)).unwrap();
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
      };
      offcanvasElement.addEventListener("hidden.bs.offcanvas", handleModalClose);
      return () => {
        offcanvasElement.removeEventListener("hidden.bs.offcanvas", handleModalClose);
      };
    }
  }, [settrainingSession]);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{trainingSession ? "Update " : "Add New "} Training Session</h4>
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
              <label className="col-form-label">Training Title <span className="text-danger">*</span></label>
              <Controller
                name="training_title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <input {...field} className="form-control" placeholder="Enter training title" />
                )}
              />
              {errors.training_title && <small className="text-danger">{errors.training_title.message}</small>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Trainer Name <span className="text-danger">*</span></label>
              <Controller
                name="trainer_name"
                control={control}
                rules={{ required: "Trainer name is required" }}
                render={({ field }) => (
                  <input {...field} className="form-control" placeholder="Enter trainer name" />
                )}
              />
              {errors.trainer_name && <small className="text-danger">{errors.trainer_name.message}</small>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Training Date <span className="text-danger">*</span></label>
              <Controller
                name="training_date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      // remove time by setting time to midnight and converting to ISO date only
                      const dateOnly = date ? new Date(date.setHours(0, 0, 0, 0)) : null;
                      field.onChange(dateOnly?.toISOString().split("T")[0]); // "yyyy-mm-dd"
                    }}
                    className="form-control"
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Date"
                  />
                )}
              />
              {errors.training_date && (
                <small className="text-danger">{errors.training_date.message}</small>
              )}
            </div>


            <div className="col-md-6 mb-3">
              <label className="col-form-label">Location</label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <input {...field} className="form-control" placeholder="Enter location" />
                )}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="col-form-label">Training Type</label>
              <Controller
                name="training_type"
                control={control}
                render={({ field }) => (
                  <select {...field} className="form-select">
                    <option value="">Select type</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
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
