import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import {
  createSurveyResponse,
  updateSurveyResponse,
} from "../../../redux/SurveyResponse";
import { fetchsurvey } from "../../../redux/surveyMaster";
const ManageSurveyResponse = ({ setSurveyResponse, surveyResponse }) => {
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
    dispatch(fetchsurvey({ is_active: true }));
  }, [dispatch]);

  const { survey, loading: surveyLoading } = useSelector(
    (state) => state.surveyMaster
  );
  const surveyTypes =
    survey?.data?.map((i) => ({
      label: i?.survey_title,
      value: i?.id,
    })) || [];

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
                      render={({ field }) => (
                        <EmployeeSelect
                          {...field}
                          value={field.value}
                          onChange={(opt) => field.onChange(opt?.value)}
                        />
                      )}
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
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={[
                              { value: "", label: "-- Select --" },
                              ...surveyTypes,
                            ]}
                            placeholder="-- Select --"
                            classNamePrefix="react-select"
                            isLoading={surveyLoading}
                            value={field.value}
                            onChange={(selectedOption) =>
                              field.onChange(selectedOption.value)
                            }
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
                    Response Text
                    <small className="text-muted">(Max 255 characters)</small>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="response_text"
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
                          placeholder="Enter Response Text"
                        />
                      )}
                    />
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
