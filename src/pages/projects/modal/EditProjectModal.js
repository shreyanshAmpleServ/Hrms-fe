import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import { updateProject } from "../../../redux/projects";

const lockedStatus = [
  { value: "Y", label: "Yes" },
  { value: "N", label: "No" },
];
const EditProjectModal = ({ project }) => {
  const dispatch = useDispatch();
  const [valid_from, setValidFrom] = useState(new Date());
  const [valid_to, setValidTo] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const { loading } = useSelector((state) => state.projects);

  const {
    control,
    handleSubmit,
    watch,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: project?.employee_id || null,
      name: project?.name || "",
      code: project?.code || "",
      locked: project?.locked || "",
      valid_from: project?.valid_from ? new Date(project.valid_from) : null,
      valid_to: project?.valid_to ? new Date(project.valid_to) : null,
      is_active: project?.is_active || "Y",
    },
  });
  useEffect(() => {
    reset({
      employee_id: project?.employee_id || null,
      name: project?.name || "",
      code: project?.code || "",
      locked: project?.locked || "",
      valid_from: project?.valid_from ? new Date(project.valid_from) : null,
      valid_to: project?.valid_to ? new Date(project.valid_to) : null,
      is_active: project?.is_active || "Y",
    });
  }, [project, reset]);

  React.useEffect(() => {
    dispatch(fetchEmployee({ search: searchValue, is_active: true }));
  }, [dispatch, searchValue]);

  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {}
  );

  const employees = employee?.data?.map((i) => ({
    label: i?.full_name,
    value: i?.id,
  }));
  useEffect(() => {
    setSearchValue(project?.projects_employee_detail?.full_name || "");
  }, [project]);
  const onSubmit = async (data) => {
    const closeButton = document.getElementById("close_offcanvas_edit_project");

    try {
      const transformedData = {
        ...data,
        valid_to: data.valid_to?.toISOString() || null,
        valid_from: data.valid_from?.toISOString() || null,
        code: data.code || null,
        locked: data?.locked || "",
      };
      await dispatch(
        updateProject({ id: project.id, projectData: transformedData })
      ).unwrap();
      closeButton.click();
      reset();
    } catch (error) {
      closeButton.click();
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_edit_project"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">Edit Project</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          id="close_offcanvas_edit_project"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="accordion" id="project_accordion">
            <div className="accordion-item rounded mb-3">
              <div className="accordion-header">
                <button
                  type="button"
                  className="accordion-button accordion-custom-button bg-white rounded fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#project_basic"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-briefcase fs-20" />
                  </span>
                  Project Info
                </button>
              </div>
              <div
                className="accordion-collapse collapse show"
                id="project_basic"
                data-bs-parent="#project_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Project Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("name", {
                            required: "Project name is required",
                          })}
                        />
                        {errors.name && (
                          <small className="text-danger">
                            {errors.name.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Code</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("code", {
                            required: "Project code is required",
                          })}
                        />
                        {errors.code && (
                          <small className="text-danger">
                            {errors.code.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 ">
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
                          Valid From <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="valid_from"
                          control={control}
                          rules={{ required: "Valid from is required" }}
                          render={({ field }) => (
                            <DatePicker
                              className="form-control"
                              selected={valid_from}
                              onChange={(date) => {
                                setValidFrom(date);
                                field.onChange(date);
                              }}
                              dateFormat="yyyy-MM-dd"
                            />
                          )}
                        />
                        {errors.valid_from && (
                          <small className="text-danger">
                            {errors.valid_from.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Valid To</label>
                        <Controller
                          name="valid_to"
                          control={control}
                          render={({ field }) => (
                            <DatePicker
                              className="form-control"
                              selected={valid_to}
                              onChange={(date) => {
                                setValidTo(date);
                                field.onChange(date);
                              }}
                              dateFormat="yyyy-MM-dd"
                            />
                          )}
                        />
                      </div>
                    </div>
                    {/* is loced  */}
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Is locked <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="locked"
                          rules={{ required: "Locked is required" }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={lockedStatus}
                              placeholder="Select Gender"
                              classNamePrefix="react-select"
                              value={
                                lockedStatus?.find(
                                  (option) => option.value === watch("locked")
                                ) || ""
                              }
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value || null);
                              }}
                            />
                          )}
                        />
                        {errors.locked && (
                          <small className="text-danger">
                            {errors.locked.message}
                          </small>
                        )}
                      </div>
                    </div>
                    {/* Status  */}
                    <div className="col-md-12">
                      <div className="mb-0">
                        <label className="col-form-label">Status</label>
                        <div className="d-flex flex-wrap">
                          <div className="me-2">
                            <input
                              type="radio"
                              className="status-radio"
                              id="edit-active"
                              value="Y"
                              {...register("is_active")}
                            />
                            <label htmlFor="edit-active">Active</label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              className="status-radio"
                              id="edit-inactive"
                              value="N"
                              {...register("is_active")}
                            />
                            <label htmlFor="edit-inactive">Inactive</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;
