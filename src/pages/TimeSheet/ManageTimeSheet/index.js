import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import { createTimeSheet, updateTimeSheet } from "../../../redux/TimeSheet";
import { fetchProjects } from "../../../redux/projects";

const ManageTimeSheet = ({ setTimeSheet, timeSheet }) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: "",
      project_id: "",
      hours_worked: "",
      work_date: new Date().toISOString(),
      task_description: "",
    },
  });

  const { loading } = useSelector((state) => state.timeSheet || {});

  const { projects, loading: projectLoading } = useSelector(
    (state) => state.projects || {}
  );

  const projectOptions = projects?.data?.map((i) => ({
    label: i?.name || "",
    value: i?.id,
  }));

  React.useEffect(() => {
    reset({
      employee_id: timeSheet?.employee_id || "",
      work_date: timeSheet?.work_date || new Date().toISOString(),
      project_name: timeSheet?.project_name || "",
      task_description: timeSheet?.task_description || "",
      hours_worked: timeSheet?.hours_worked || "",
      approved_by: timeSheet?.approved_by || "",
      approved_on: timeSheet?.approved_on || "",
      project_id: timeSheet?.project_id || "",
      remarks: timeSheet?.remarks || "",
      status: timeSheet?.status || "Draft",
      task_id: timeSheet?.task_id || "",
      billable_flag: timeSheet?.billable_flag || "",
      work_location: timeSheet?.work_location || "",
      submission_date: timeSheet?.submission_date || "",
      approval_status: timeSheet?.approval_status || "P",
      timesheet_type: timeSheet?.timesheet_type || "",
    });
  }, [timeSheet, reset]);

  useEffect(() => {
    dispatch(fetchProjects({ is_active: true }));
  }, [dispatch]);

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
                        return (
                          <EmployeeSelect
                            {...field}
                            value={field.value}
                            onChange={(opt) => field.onChange(opt?.value)}
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
                      name="project_id"
                      control={control}
                      rules={{ required: "Project name is required" }}
                      render={({ field }) => {
                        return (
                          <Select
                            {...field}
                            options={projectOptions}
                            placeholder="Select Project"
                            classNamePrefix="react-select"
                            isLoading={projectLoading}
                            value={
                              projectOptions?.find(
                                (opt) => opt.value === field.value
                              ) || null
                            }
                            onChange={(opt) => field.onChange(opt?.value)}
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

                <div className="col-md-6 mb-3">
                  <label className="col-form-label"> Work Date</label>
                  <Controller
                    name="work_date"
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
                        onChange={(date) => {
                          field.onChange(date);
                        }}
                        className="form-control"
                        placeholderText="Select Uploaded Date"
                      />
                    )}
                  />
                  {errors.work_date && (
                    <small className="text-danger">
                      {errors.work_date.message}
                    </small>
                  )}
                </div>

                <div className="col-md-12 mb-3">
                  <label className="col-form-label">
                    Descriptionk{" "}
                    <small className="text-muted">(Max 255 characters)</small>
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{
                      required: "Description is required!",
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
                        placeholder="Enter Description "
                      />
                    )}
                  />
                  {/* {errors.description && (
                      <small className="text-danger">
                        {errors.description.message}
                      </small>
                    )} */}
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
