import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import DefaultEditor from "react-simple-wysiwyg";
import {
  createAppointment,
  updateAppointment,
} from "../../../redux/AppointmentLetters";
import { fetchEmployee } from "../../../redux/Employee";
import { fetchdesignation } from "../../../redux/designation";

const ManageAppointments = ({ setAppointment, appointment }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchDesignation, setSearchDesignation] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: "",
      issue_date: new Date().toISOString(),
      designation_id: "",
      terms_summary: "",
    },
  });

  const { loading } = useSelector((state) => state.appointment || {});

  React.useEffect(() => {
    if (appointment) {
      reset({
        employee_id: appointment.employee_id || "",
        issue_date: appointment.issue_date || new Date().toISOString(),
        designation_id: appointment.designation_id || "",
        terms_summary: appointment.terms_summary || "",
      });
    } else {
      reset({
        employee_id: "",
        issue_date: new Date().toISOString(),
        designation_id: "",
        terms_summary: "",
      });
    }
  }, [appointment, reset]);

  React.useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
  }, [dispatch, searchValue]);

  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {},
  );

  const employees = employee?.data?.map((i) => ({
    label: i?.full_name,
    value: i?.id,
  }));

  React.useEffect(() => {
    dispatch(fetchdesignation({ searchValue: searchDesignation }));
  }, [dispatch, searchDesignation]);

  const { designation, loading: designationLoading } = useSelector(
    (state) => state.designation || {},
  );

  const designations = designation?.data?.map((i) => ({
    label: i?.designation_name,
    value: i?.id,
  }));

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      appointment
        ? await dispatch(
            updateAppointment({ id: appointment.id, appointmentData: data }),
          ).unwrap()
        : await dispatch(createAppointment(data)).unwrap();
      closeButton.click();
      reset();
      setAppointment(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setAppointment(null);
      };
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose,
      );
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleModalClose,
        );
      };
    }
  }, [setAppointment]);
  return (
    <>
      {/* Add New appointment */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{appointment ? "Update " : "Add New "} Appointment Letters</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setAppointment(null);
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
                          (employee) => employee.value === field.value,
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={employees}
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
                      Designation
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="designation_id"
                      control={control}
                      rules={{ required: "Designation is required" }}
                      render={({ field }) => {
                        const selectedDeal = designations?.find(
                          (employee) => employee.value === field.value,
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={designations}
                            isLoading={designationLoading}
                            classNamePrefix="react-select"
                            onInputChange={(inputValue) =>
                              setSearchDesignation(inputValue)
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
                    {errors.designation_id && (
                      <small className="text-danger">
                        {errors.designation_id.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">Appointment Date</label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="issue_date"
                      control={control}
                      rules={{ required: "Appointment date is required!" }}
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
                  {errors.start_date && (
                    <small className="text-danger">
                      {errors.start_date.message}
                    </small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="col-form-label">Terms Summary</label>
                  <Controller
                    name="terms_summary"
                    control={control}
                    render={({ field }) => (
                      <DefaultEditor
                        className="summernote"
                        {...field}
                        value={field.value || ""}
                        onChange={(content) => field.onChange(content)}
                      />
                    )}
                  />
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
                {appointment
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

export default ManageAppointments;
