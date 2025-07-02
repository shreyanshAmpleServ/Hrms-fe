import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import { fetchgoalSheet } from "../../../redux/GoalSheetAssignment";
import {
  createKPIProgress,
  updateKPIProgress,
} from "../../../redux/KPIProgress";
import { Slider } from "antd";

const ManageKPIProgress = ({ setKPIProgress, kpiProgress }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.kpiProgress || {});
  const { goalSheet } = useSelector((state) => state.goalSheet || {});

  const goalSheetOptions = goalSheet?.data?.map((item) => ({
    label: item?.goal_description,
    value: item?.id,
  }));

  React.useEffect(() => {
    dispatch(fetchgoalSheet());
  }, [dispatch]);

  React.useEffect(() => {
    if (kpiProgress) {
      reset({
        employee_id: kpiProgress.employee_id || "",
        goal_id: kpiProgress.goal_id || "",
        entry_date: kpiProgress.entry_date || moment().toISOString(),
        progress_value: Number(kpiProgress.progress_value) || 0,
        remarks: kpiProgress.remarks || "",
        reviewed_by: kpiProgress.reviewed_by ? kpiProgress.reviewed_by : null,
        reviewed_on: kpiProgress.reviewed_on || moment.toISOString(),
      });
    } else {
      reset({
        employee_id: "",
        goal_id: "",
        entry_date: moment().toISOString(),
        progress_value: 0,
        remarks: "",
        reviewed_by: null,
        reviewed_on: moment().toISOString(),
      });
    }
  }, [kpiProgress, reset]);

  React.useEffect(() => {
    dispatch(fetchEmployee({ search: searchValue, status: "Active" }));
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
      kpiProgress
        ? await dispatch(
            updateKPIProgress({
              id: kpiProgress.id,
              kpiProgressData: {
                ...data,
                progress_value: String(data.progress_value),
              },
            })
          ).unwrap()
        : await dispatch(
            createKPIProgress({
              ...data,
              progress_value: String(data.progress_value),
            })
          ).unwrap();
      closeButton.click();
      reset();
      setKPIProgress(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setKPIProgress(null);
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
  }, [setKPIProgress]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{kpiProgress ? "Update " : "Add  "} KPI Progress</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setKPIProgress(null);
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
                      <span className="text-danger"> *</span>
                    </label>
                    <Controller
                      name="employee_id"
                      control={control}
                      rules={{ required: "Employee is required" }}
                      render={({ field }) => {
                        const selectedEmployee = employees?.find(
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
                            value={selectedEmployee || null}
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
                      Goal
                      <span className="text-danger"> *</span>
                    </label>
                    <Controller
                      name="goal_id"
                      control={control}
                      rules={{ required: "Goal is required" }}
                      render={({ field }) => {
                        const selectedGoal = goalSheetOptions?.find(
                          (goal) => goal.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={goalSheetOptions}
                            placeholder="Select Goal"
                            classNamePrefix="react-select"
                            isLoading={employeeLoading}
                            onInputChange={(inputValue) =>
                              setSearchValue(inputValue)
                            }
                            value={selectedGoal || null}
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
                    {errors.goal_id && (
                      <small className="text-danger">
                        {errors.goal_id.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Reviewed By
                      <span className="text-danger"> *</span>
                    </label>
                    <Controller
                      name="reviewed_by"
                      control={control}
                      rules={{ required: "Reviewed By is required" }}
                      render={({ field }) => {
                        const selectedEmployee = employees?.find(
                          (employee) => employee.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={employees}
                            placeholder="Select Reviewed By"
                            classNamePrefix="react-select"
                            isLoading={employeeLoading}
                            onInputChange={(inputValue) =>
                              setSearchValue(inputValue)
                            }
                            value={selectedEmployee || null}
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
                    {errors.reviewed_by && (
                      <small className="text-danger">
                        {errors.reviewed_by.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Reviewed On<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="reviewed_on"
                      control={control}
                      rules={{ required: "Reviewed On is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          placeholderText="Select Reviewed On"
                          selected={field.value}
                          value={
                            field.value
                              ? moment(field.value).format("DD-MM-YYYY")
                              : null
                          }
                          onChange={(date) => field.onChange(date)}
                          dateFormat="DD-MM-YYYY"
                          maxDate={new Date()}
                        />
                      )}
                    />
                  </div>
                  {errors.reviewed_on && (
                    <small className="text-danger">
                      {errors.reviewed_on.message}
                    </small>
                  )}
                </div>

                <div className="col-md-12">
                  <label className="col-form-label">
                    Progress Value <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="progress_value"
                      control={control}
                      rules={{ required: "Progress Value is required!" }}
                      render={({ field }) => (
                        <Slider
                          {...field}
                          min={0}
                          max={100}
                          marks={{
                            0: "0",
                            10: "10",
                            20: "20",
                            30: "30",
                            40: "40",
                            50: "50",
                            60: "60",
                            70: "70",
                            80: "80",
                            90: "90",
                            100: "100",
                          }}
                          onChange={(value) => field.onChange(value)}
                        />
                      )}
                    />
                    {errors.progress_value && (
                      <small className="text-danger">
                        {errors.progress_value.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-12">
                  <label className="col-form-label">
                    Remarks{" "}
                    <small className="text-muted">(Max 255 characters)</small>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="remarks"
                      control={control}
                      rules={{
                        maxLength: {
                          value: 255,
                          message: "Remarks must be less than 255 characters",
                        },
                        required: "Remarks is required!",
                      }}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          className="form-control"
                          placeholder="Enter Remarks"
                          rows={3}
                        />
                      )}
                    />
                    {errors.remarks && (
                      <small className="text-danger">
                        {errors.remarks.message}
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
                {kpiProgress
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

export default ManageKPIProgress;
