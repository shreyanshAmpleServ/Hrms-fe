import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createSurveyResponse,
  updateSurveyResponse,
} from "../../../redux/SurveyResponse";
import { fetchsurvey } from "../../../redux/surveyMaster";
const ManageSurveyResponse = ({ setSurveyResponse, surveyResponse }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.surveyResponse || {});

  React.useEffect(() => {
    if (surveyResponse) {
      reset({
        employee_id: surveyResponse.survey_employee?.id || "",
        survey_id: surveyResponse.survey_id || "",
        submitted_on: surveyResponse.submitted_on || "",
        response_text: surveyResponse.response_text || "",
      });
    } else {
      reset({
        employee_id: "",
        survey_id: "",
        submitted_on: new Date().toISOString(),
        response_text: "",
      });
    }
  }, [surveyResponse, reset]);

  React.useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
  }, [dispatch, searchValue]);

  React.useEffect(() => {
    dispatch(fetchsurvey());
  }, [dispatch]);

  const { survey, loading: surveyLoading } = useSelector(
    (state) => state.surveyMaster
  );
  const surveyTypes = survey?.data?.map((i) => ({
    label: i?.survey_title,
    value: i?.id,
  }));

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
      surveyResponse
        ? await dispatch(
            updateSurveyResponse({
              id: surveyResponse.id,
              surveyResponseData: { ...data },
            })
          ).unwrap()
        : await dispatch(createSurveyResponse({ ...data })).unwrap();
      closeButton.click();
      reset();
      setSurveyResponse(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setSurveyResponse(null);
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
  }, [setSurveyResponse]);
  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{surveyResponse ? "Update " : "Add "} Survey Response</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setSurveyResponse(null);
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
                  <div className="mb-3">
                    <label className="col-form-label">
                      Survey Type
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="survey_id"
                      control={control}
                      rules={{ required: "Survey type is required" }}
                      render={({ field }) => {
                        const selectedDeal = surveyTypes?.find(
                          (surveyType) => surveyType.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={surveyTypes}
                            placeholder="Select Survey Type"
                            classNamePrefix="react-select"
                            isLoading={surveyLoading}
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
                    {errors.survey_id && (
                      <small className="text-danger">
                        {errors.survey_id.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Submitted On<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="submitted_on"
                      control={control}
                      rules={{ required: "Submitted on is required!" }}
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
                  {errors.submitted_on && (
                    <small className="text-danger">
                      {errors.submitted_on.message}
                    </small>
                  )}
                </div>
                <div className="col-md-12">
                  <label className="col-form-label">
                    Response Text<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="response_text"
                      control={control}
                      rules={{ required: "Response text is required!" }}
                      render={({ field }) => (
                        <textarea
                          rows={3}
                          {...field}
                          type="text"
                          className={`form-control ${errors.response_text ? "is-invalid" : ""}`}
                          placeholder="Enter Response Text"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.response_text && (
                      <small className="text-danger">
                        {errors.response_text.message}
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
                {surveyResponse
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

export default ManageSurveyResponse;
