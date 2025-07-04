import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createEmployeeSuggestion,
  updateEmployeeSuggestion,
} from "../../../redux/EmployeeSuggestion";
import EmployeeSelect from "../../../components/common/EmployeeSelect";

const ManageEmployeeSuggestion = ({
  setEmployeeSuggestion,
  employeeSuggestion,
}) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.employeeSuggestion || {});

  React.useEffect(() => {
    reset({
      employee_id: employeeSuggestion?.employee_id || "",
      suggestion_text: employeeSuggestion?.suggestion_text || "",
      votes: employeeSuggestion?.votes || "",
      submitted_on:
        employeeSuggestion?.submitted_on || new Date().toISOString(),
    });
  }, [employeeSuggestion, reset]);

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      employeeSuggestion
        ? await dispatch(
            updateEmployeeSuggestion({
              id: employeeSuggestion.id,
              employeeSuggestionData: { ...data },
            })
          ).unwrap()
        : await dispatch(createEmployeeSuggestion({ ...data })).unwrap();
      closeButton.click();
      reset();
      setEmployeeSuggestion(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setEmployeeSuggestion(null);
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
  }, [setEmployeeSuggestion]);
  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>
            {employeeSuggestion ? "Update " : "Add  "} Employee Suggestion
          </h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setEmployeeSuggestion(null);
              reset();
            }}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Employee
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="employee_id"
                      control={control}
                      rules={{ required: "Employee is required" }}
                      render={({ field }) => {
                        return (
                          <EmployeeSelect
                            {...field}
                            value={field.value}
                            onChange={(i) => field.onChange(i?.value)}
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
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Vote (1 to 5) <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="votes"
                      control={control}
                      rules={{
                        required: "Votes is required!",
                        min: {
                          value: 1,
                          message: "Votes must be between 1 and 5",
                        },
                        max: {
                          value: 5,
                          message: "Votes must be between 1 and 5",
                        },
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min={1}
                          max={5}
                          className={`form-control ${errors.votes ? "is-invalid" : ""}`}
                          placeholder="Enter Votes"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.votes && (
                      <small className="text-danger">
                        {errors.votes.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Submitted Date<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="submitted_on"
                      control={control}
                      rules={{ required: "Issued on is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          placeholderText="Select Submitted Date"
                          selected={field.value}
                          value={
                            field.value
                              ? moment(field.value).format("DD-MM-YYYY")
                              : null
                          }
                          onChange={field.onChange}
                          dateFormat="DD-MM-YYYY"
                        />
                      )}
                    />
                  </div>
                  {errors.submitted_on && (
                    <small className="text-danger">
                      {errors.submitted_on.message}
                    </small>
                  )}
                </div>
                <div className="col-md-12">
                  <label className="col-form-label">
                    Suggestions{" "}
                    <small className="text-muted">(Max 255 characters)</small>{" "}
                    <span className="text-danger">*</span>
                  </label>

                  <div className="mb-3">
                    <Controller
                      name="suggestion_text"
                      control={control}
                      rules={{
                        required: "Suggestions is required!",
                        maxLength: {
                          value: 255,
                          message:
                            "Suggestions must be less than or equal to 255 characters",
                        },
                      }}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={3}
                          maxLength={255}
                          className="form-control"
                          onChange={(option) => field.onChange(option)}
                          placeholder="Enter Suggestions"
                        />
                      )}
                    />
                    {errors.suggestion_text && (
                      <small className="text-danger">
                        {errors.suggestion_text.message}
                      </small>
                    )}
                  </div>
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
              <button type="submit" className="btn btn-primary">
                {employeeSuggestion
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
    </>
  );
};

export default ManageEmployeeSuggestion;
