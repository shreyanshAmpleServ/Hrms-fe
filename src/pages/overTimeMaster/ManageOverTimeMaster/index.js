import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  createOverTimeMaster,
  updateOverTimeMaster,
} from "../../../redux/overTimeMaster";

const ManageOvertimeMaster = ({ setOvertimeMaster, overtimeMaster }) => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      days_code: "",
      wage_type: "",
      hourly_rate_hike: "",
      maximum_overtime_allowed: "",
      createdate: new Date().toISOString(),
    },
  });

  useEffect(() => {
    if (overtimeMaster) {
      reset({
        days_code: overtimeMaster.days_code || "",
        wage_type: overtimeMaster.wage_type || "",
        hourly_rate_hike: overtimeMaster.hourly_rate_hike || "",
        maximum_overtime_allowed: overtimeMaster.maximum_overtime_allowed || "",
        createdate: overtimeMaster.createdate || new Date().toISOString(),
      });
    } else {
      reset({
        days_code: "",
        wage_type: "",
        hourly_rate_hike: "",
        maximum_overtime_allowed: "",
        createdate: new Date().toISOString(),
      });
    }
  }, [overtimeMaster, reset]);

  const { loading } = useSelector((state) => state.overtimeMaster || {});

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      if (overtimeMaster) {
        await dispatch(
          updateOverTimeMaster({
            id: overtimeMaster.id,
            overtimeMasterData: { ...data },
          })
        ).unwrap();
      } else {
        await dispatch(createOverTimeMaster({ ...data })).unwrap();
      }
      closeButton?.click();
      reset();
      setOvertimeMaster(null);
    } catch (error) {
      console.error("Submission error:", error);
      closeButton?.click();
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setOvertimeMaster(null);
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
  }, [setOvertimeMaster]);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{overtimeMaster ? "Update" : "Add"} Overtime Master</h4>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {/* Days Code */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Days Code<span className="text-danger">*</span>
              </label>
              <Controller
                name="days_code"
                control={control}
                rules={{ required: "Days Code is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="form-control"
                    placeholder="Enter Days Code"
                  />
                )}
              />
              {errors.days_code && (
                <small className="text-danger">
                  {errors.days_code.message}
                </small>
              )}
            </div>

            {/* Wage Type */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Wage Type<span className="text-danger">*</span>
              </label>
              <Controller
                name="wage_type"
                control={control}
                rules={{ required: "Wage Type is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="form-control"
                    placeholder="Enter Wage Type"
                  />
                )}
              />
              {errors.wage_type && (
                <small className="text-danger">
                  {errors.wage_type.message}
                </small>
              )}
            </div>

            {/* Hourly Rate Hike */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Hourly Rate Hike</label>
              <Controller
                name="hourly_rate_hike"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="form-control"
                    placeholder="Enter Hourly Rate Hike"
                  />
                )}
              />
            </div>

            {/* Maximum Overtime Allowed */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Maximum Overtime Allowed</label>
              <Controller
                name="maximum_overtime_allowed"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="form-control"
                    placeholder="Enter Maximum Overtime Allowed"
                  />
                )}
              />
            </div>

            {/* Created Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Created Date</label>
              <Controller
                name="createdate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className="form-control"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="yyyy-MM-dd"
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
              {overtimeMaster
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

export default ManageOvertimeMaster;
