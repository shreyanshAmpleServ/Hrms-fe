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
      training_date: new Date().toISOString(),
      location: "",
      training_type: "",
    },
  });

  const { loading } = useSelector((state) => state.trainingSession || {});
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (trainingSession) {
      reset({
        training_title: trainingSession.training_title || "",
        trainer_name: trainingSession.trainer_name || "",
        training_date:
          trainingSession.training_date || new Date().toISOString(),
        location: trainingSession.location || "",
        training_type: trainingSession.training_type || "",
      });
    } else {
      reset();
    }
  }, [trainingSession, reset]);

  useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
  }, [dispatch, searchValue]);

  useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
  }, [dispatch, searchValue]);

  // ✅ Get employee state from Redux
  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {}
  );

  // ✅ Format for react-select
  const employees =
    employee?.data?.map((i) => ({
      label: i?.full_name,
      value: i?.id,
    })) || [];

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
  }, []);

  console.log("trainingSession", trainingSession);
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
                name="employee_id"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => {
                  const selectedEmployee = employees.find(
                    (emp) => emp.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      className="select"
                      options={employees}
                      placeholder="Select Employee"
                      isLoading={employeeLoading}
                      classNamePrefix="react-select"
                      value={selectedEmployee || ""}
                      onInputChange={(inputValue) => setSearchValue(inputValue)}
                      onChange={(opt) => field.onChange(opt?.value)}
                      styles={{
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                      }}
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
