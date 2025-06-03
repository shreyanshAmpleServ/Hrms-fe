import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  createCompetencyTracking,
  updateCompetencyTracking,
} from "../../../redux/CompetencyTracking";
import { fetchEmployee } from "../../../redux/Employee";

const ManageCompetencyTracking = ({
  setCompetencyTracking,
  competencyTracking,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.competencyTracking || {});

  React.useEffect(() => {
    if (competencyTracking) {
      reset({
        employee_id: competencyTracking.competency_employee?.id || "",
        skill_name: competencyTracking.skill_name || "",
        proficiency_level: competencyTracking.proficiency_level || "",
        last_assessed_date:
          competencyTracking.last_assessed_date || new Date().toISOString(),
      });
    } else {
      reset({
        employee_id: "",
        skill_name: "",
        proficiency_level: "",
        last_assessed_date: new Date().toISOString(),
      });
    }
  }, [competencyTracking, reset]);

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
      competencyTracking
        ? await dispatch(
            updateCompetencyTracking({
              id: competencyTracking.id,
              competencyTrackingData: { ...data },
            })
          ).unwrap()
        : await dispatch(createCompetencyTracking({ ...data })).unwrap();
      closeButton.click();
      reset();
      setCompetencyTracking(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setCompetencyTracking(null);
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
  }, [setCompetencyTracking]);
  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>
            {competencyTracking ? "Update " : "Add New "} Competency Tracking
          </h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setCompetencyTracking(null);
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
                    Proficiency Level<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="proficiency_level"
                      control={control}
                      rules={{ required: "Proficiency level is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`form-control ${errors.proficiency_level ? "is-invalid" : ""}`}
                          placeholder="Enter Proficiency Level"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.proficiency_level && (
                      <small className="text-danger">
                        {errors.proficiency_level.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Skill Name<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="skill_name"
                      control={control}
                      rules={{ required: "Skill name is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`form-control ${errors.skill_name ? "is-invalid" : ""}`}
                          placeholder="Enter Skill Name"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.skill_name && (
                      <small className="text-danger">
                        {errors.skill_name.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Last Assessed Date<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="last_assessed_date"
                      control={control}
                      rules={{ required: "Event date is required!" }}
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
                          minDate={new Date()}
                        />
                      )}
                    />
                  </div>
                  {errors.last_assessed_date && (
                    <small className="text-danger">
                      {errors.last_assessed_date.message}
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
              <button type="submit" className="btn btn-primary">
                {competencyTracking
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

export default ManageCompetencyTracking;
