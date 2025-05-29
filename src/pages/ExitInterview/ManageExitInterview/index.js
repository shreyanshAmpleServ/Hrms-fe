import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createExitInterview,
  updateExitInterview,
} from "../../../redux/ExitInterview";

const ManageExitInterview = ({ setExitInterview, exitInterview }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.exitInterview || {});

  React.useEffect(() => {
    if (exitInterview) {
      reset({
        employee_id: exitInterview.exit_interview_employee?.id || "",
        feedback: exitInterview.feedback || "",
        suggestions: exitInterview.suggestions || "",
        reason_for_leaving: exitInterview.reason_for_leaving || "",
        interview_date: exitInterview.interview_date || "",
      });
    } else {
      reset({
        employee_id: "",
        feedback: "",
        suggestions: "",
        reason_for_leaving: "",
        interview_date: new Date().toISOString(),
      });
    }
  }, [exitInterview, reset]);

  React.useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
  }, [dispatch, searchValue]);

  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {}
  );

  const employees = employee?.data?.map((i) => ({
    label: i?.full_name,
    value: i?.id,
  }));

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      exitInterview
        ? await dispatch(
            updateExitInterview({
              id: exitInterview.id,
              exitInterviewData: { ...data },
            })
          ).unwrap()
        : await dispatch(createExitInterview({ ...data })).unwrap();
      closeButton.click();
      reset();
      setExitInterview(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setExitInterview(null);
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
  }, [setExitInterview]);
  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{exitInterview ? "Update " : "Add New "} Exit Interview</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setExitInterview(null);
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
                        const selectedDeal = employees?.find(
                          (employee) => employee.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={employees}
                            placeholder="Select Employee"
                            classNamePrefix="react-select"
                            isLoading={employeeLoading}
                            onInputChange={(inputValue) =>
                              setSearchValue(inputValue)
                            }
                            value={selectedDeal || null}
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption.value)
                            }
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                              }),
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
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Interview Date<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="interview_date"
                      control={control}
                      rules={{ required: "Interview date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
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
                  {errors.interview_date && (
                    <small className="text-danger">
                      {errors.interview_date.message}
                    </small>
                  )}
                </div>
                <div className="col-md-12">
                  <label className="col-form-label">
                    Reason for Leaving<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="reason_for_leaving"
                      control={control}
                      rules={{ required: "Reason for leaving is required!" }}
                      render={({ field }) => (
                        <textarea
                          rows={2}
                          {...field}
                          type="text"
                          className={`form-control ${errors.reason_for_leaving ? "is-invalid" : ""}`}
                          placeholder="Enter Reason for Leaving"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.reason_for_leaving && (
                      <small className="text-danger">
                        {errors.reason_for_leaving.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-12">
                  <label className="col-form-label">
                    Feedback<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="feedback"
                      control={control}
                      rules={{ required: "Feedback is required!" }}
                      render={({ field }) => (
                        <textarea
                          rows={2}
                          {...field}
                          type="text"
                          className={`form-control ${errors.feedback ? "is-invalid" : ""}`}
                          placeholder="Enter Feedback"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.feedback && (
                      <small className="text-danger">
                        {errors.feedback.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-12">
                  <label className="col-form-label">
                    Suggestions<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="suggestions"
                      control={control}
                      rules={{ required: "Suggestions is required!" }}
                      render={({ field }) => (
                        <textarea
                          rows={2}
                          {...field}
                          type="text"
                          className={`form-control ${errors.suggestions ? "is-invalid" : ""}`}
                          placeholder="Enter Suggestions"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.suggestions && (
                      <small className="text-danger">
                        {errors.suggestions.message}
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
                {exitInterview
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

export default ManageExitInterview;
