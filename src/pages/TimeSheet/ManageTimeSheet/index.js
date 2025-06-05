import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import DefaultEditor from "react-simple-wysiwyg";
import { fetchEmployee } from "../../../redux/Employee";
import { fetchLeaveType } from "../../../redux/LeaveType";
import { createTimeSheet, updateTimeSheet } from "../../../redux/TimeSheet";

const ManageTimeSheet = ({ setTimeSheet, timeSheet }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: "",
      project_name: "",
      hours_worked: "",
      work_date: new Date().toISOString(),
      task_description: "",
    },
  });

  const { loading } = useSelector((state) => state.leaveEncashment || {});

  React.useEffect(() => {
    if (timeSheet) {
      reset({
        employee_id: timeSheet.employee_id || "",
        project_name: timeSheet.project_name || "",
        hours_worked: timeSheet.hours_worked || "",
        work_date: timeSheet.work_date || new Date().toISOString(),
        task_description: timeSheet.task_description || "",
      });
    } else {
      reset({
        employee_id: "",
        project_name: "",
        hours_worked: "",
        work_date: new Date().toISOString(),
        task_description: "",
      });
    }
  }, [timeSheet, reset]);

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
    dispatch(fetchLeaveType({ searchValue }));
  }, [dispatch, searchValue]);

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      timeSheet
        ? await dispatch(
            updateTimeSheet({
              id: timeSheet.id,
              timeSheetData: { ...data },
            })
          ).unwrap()
        : await dispatch(createTimeSheet({ ...data })).unwrap();
      closeButton.click();
      reset();
      setTimeSheet(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setTimeSheet(null);
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
  }, [setTimeSheet]);
  return (
    <>
      {/* Add New appointment */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{timeSheet ? "Update " : "Add "} Time Sheet Entry</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setTimeSheet(null);
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
                      Project Name
                      <span className="text-danger"> *</span>
                    </label>
                    <Controller
                      name="project_name"
                      control={control}
                      rules={{ required: "Project name is required" }}
                      render={({ field }) => {
                        return (
                          <input
                            {...field}
                            className="form-control"
                            placeholder="Enter Project Name"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        );
                      }}
                    />
                    {errors.leave_type_id && (
                      <small className="text-danger">
                        {errors.leave_type_id.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Hours Worked<span className="text-danger"> *</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="hours_worked"
                      control={control}
                      rules={{ required: "Hours worked is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className="form-control"
                          placeholder="Enter Hours Worked"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  {errors.leave_days && (
                    <small className="text-danger">
                      {errors.leave_days.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Work Date<span className="text-danger"> *</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="work_date"
                      control={control}
                      rules={{ required: "Work date is required!" }}
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
                  {errors.encashment_date && (
                    <small className="text-danger">
                      {errors.encashment_date.message}
                    </small>
                  )}
                </div>

                <div className="col-md-12 mb-3">
                  <label className="col-form-label">
                    Work Date <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="work_date"
                    control={control}
                    rules={{
                      required: "work_date is required!",
                      maxLength: {
                        value: 255,
                        message:
                          "work_date must be less than or equal to 255 characters",
                      },
                    }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        maxLength={255}
                        className="form-control"
                        placeholder="Enter work_date "
                      />
                    )}
                  />
                  {errors.work_date && (
                    <small className="text-danger">
                      {errors.work_date.message}
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
                {timeSheet
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

export default ManageTimeSheet;
