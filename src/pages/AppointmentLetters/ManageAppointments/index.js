import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  createAppointment,
  updateAppointment,
} from "../../../redux/AppointmentLetters";
import { fetchCandidate } from "../../../redux/Candidate";
import { fetchdesignation } from "../../../redux/designation";

const ManageAppointments = ({ setAppointment, appointment, candidate_id }) => {
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
      candidate_id: candidate_id || "",
      issue_date: new Date().toISOString(),
      designation_id: "",
      terms_summary: "",
    },
  });

  const { loading } = useSelector((state) => state.appointment || {});

  React.useEffect(() => {
    if (appointment) {
      reset({
        candidate_id: appointment.candidate_id || "",
        issue_date: appointment.issue_date || new Date().toISOString(),
        designation_id: appointment.designation_id || "",
        terms_summary: appointment.terms_summary || "",
      });
    } else {
      reset({
        candidate_id: candidate_id || "",
        issue_date: new Date().toISOString(),
        designation_id: "",
        terms_summary: "",
      });
    }
  }, [appointment, reset]);

  React.useEffect(() => {
    if (!candidate_id) {
      dispatch(fetchCandidate({ search: searchValue }));
    }
  }, [searchValue, candidate_id]);

  const { candidate, loading: candidateLoading } = useSelector(
    (state) => state.candidate || {}
  );

  const candidates = candidate?.data?.data?.map((i) => ({
    label: i?.full_name,
    value: i?.id,
  }));

  React.useEffect(() => {
    dispatch(fetchdesignation({ searchValue: searchDesignation }));
  }, [searchDesignation]);

  const { designation, loading: designationLoading } = useSelector(
    (state) => state.designation || {}
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
            updateAppointment({ id: appointment.id, appointmentData: data })
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
    const offcanvasElement = document.getElementById(
      "offcanvas_add_appointment"
    );
    if (offcanvasElement) {
      const handleModalClose = () => {
        setAppointment(null);
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
  }, [setAppointment]);
  return (
    <>
      {/* Add New appointment */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add_appointment"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{appointment ? "Update " : "Add"} Appointment Letters</h4>
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
                {!candidate_id && (
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Candidate
                        <span className="text-danger"> *</span>
                      </label>
                      <Controller
                        name="candidate_id"
                        control={control}
                        rules={{ required: "Candidate is required" }}
                        render={({ field }) => {
                          const selectedDeal = candidates?.find(
                            (candidate) => candidate.value === field.value
                          );
                          return (
                            <Select
                              {...field}
                              className="select"
                              options={candidates}
                              classNamePrefix="react-select"
                              placeholder="Select Candidate"
                              isLoading={candidateLoading}
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
                      {errors.candidate_id && (
                        <small className="text-danger">
                          {errors.candidate_id.message}
                        </small>
                      )}
                    </div>
                  </div>
                )}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Designation
                      <span className="text-danger"> *</span>
                    </label>
                    <Controller
                      name="designation_id"
                      control={control}
                      rules={{ required: "Designation is required" }}
                      render={({ field }) => {
                        const selectedDeal = designations?.find(
                          (employee) => employee.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={designations}
                            isLoading={designationLoading}
                            placeholder="Select Designation"
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
                  <label className="col-form-label">
                    Appointment Date <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="issue_date"
                      control={control}
                      rules={{
                        required: "Appointment date is required!",
                      }}
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
                  {errors.start_date && (
                    <small className="text-danger">
                      {errors.start_date.message}
                    </small>
                  )}
                </div>

                <div className="col-md-12 mb-3">
                  <label className="col-form-label">
                    Terms Summary{" "}
                    <small className="text-muted">(Max 255 characters)</small>
                  </label>
                  <Controller
                    name="terms_summary"
                    control={control}
                    rules={{
                      required: "Description is required (max 255 characters)",
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
                  {/* {errors.terms_summary && (
                    <small className="text-danger">
                      {errors.terms_summary.message}
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
