import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createWorkLifeEventLog,
  updateWorkLifeEventLog,
} from "../../../redux/WorkLifeEventLog";
import { fetchwork_life } from "../../../redux/workLifeEventTypeMaster";
import { Checkbox } from "antd";

const ManageWorkLifeEventLog = ({ setWorkLifeEventLog, workLifeEventLog }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.workLifeEventLog || {});

  React.useEffect(() => {
    if (workLifeEventLog) {
      reset({
        employee_id: workLifeEventLog.employee_id || "",
        event_type: workLifeEventLog.event_type || "",
        event_date: workLifeEventLog.event_date || new Date().toISOString(),
        requires_followup: workLifeEventLog.requires_followup || false,
        notes: workLifeEventLog.notes || "",
      });
    } else {
      reset({
        employee_id: "",
        event_type: "",
        event_date: new Date().toISOString(),
        requires_followup: false,
        notes: "",
      });
    }
  }, [workLifeEventLog, reset]);

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

  useEffect(() => {
    dispatch(fetchwork_life({ searchValue }));
  }, [dispatch, searchValue]);

  const { work_life, loading: workLifeEventTypeLoading } = useSelector(
    (state) => state.workLifeEvent || {}
  );

  const workLifeEventTypes = work_life?.data?.map((i) => ({
    label: i?.event_type_name,
    value: i?.id,
  }));

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      workLifeEventLog
        ? await dispatch(
            updateWorkLifeEventLog({
              id: workLifeEventLog.id,
              workLifeEventLogData: { ...data },
            })
          ).unwrap()
        : await dispatch(createWorkLifeEventLog({ ...data })).unwrap();
      closeButton.click();
      reset();
      setWorkLifeEventLog(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setWorkLifeEventLog(null);
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
  }, [setWorkLifeEventLog]);
  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{workLifeEventLog ? "Update " : "Add "} Work Life Event Log</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setWorkLifeEventLog(null);
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
                      Event Type
                      <span className="text-danger"> *</span>
                    </label>
                    <Controller
                      name="event_type"
                      control={control}
                      rules={{ required: "Work life event type is required" }}
                      render={({ field }) => {
                        const selectedDeal = workLifeEventTypes?.find(
                          (workLifeEventType) =>
                            workLifeEventType.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            placeholder="Select Event Type"
                            options={workLifeEventTypes}
                            isLoading={workLifeEventTypeLoading}
                            value={selectedDeal || null}
                            classNamePrefix="react-select"
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
                    {errors.event_type && (
                      <small className="text-danger">
                        {errors.event_type.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Event Date<span className="text-danger"> *</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="event_date"
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
                  {errors.event_date && (
                    <small className="text-danger">
                      {errors.event_date.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6 mt-3 d-flex align-items-center gap-2">
                  <div className="mb-1">
                    <Controller
                      name="requires_followup"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </div>
                  <label className="col-form-label">Requires Follow Up</label>
                </div>
                <div className="col-md-12">
                  <label className="col-form-label">
                    Notes{" "}
                    <small className="text-muted">(Max 255 characters)</small>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="notes"
                      control={control}
                      rules={{
                        required: "Notes is required!",
                        maxLength: {
                          value: 255,
                          message:
                            "Notes must be less than or equal to 255 characters",
                        },
                      }}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={3}
                          maxLength={255}
                          className="form-control"
                          placeholder="Enter Notes "
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
                {workLifeEventLog
                  ? loading
                    ? " Updating..."
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

export default ManageWorkLifeEventLog;
