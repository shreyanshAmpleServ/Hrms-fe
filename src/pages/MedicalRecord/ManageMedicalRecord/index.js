import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createMedicalRecord,
  updateMedicalRecord,
} from "../../../redux/MedicalRecord";
const medicalRecordTypes = [
  { label: "Pre-Employment Medical Checkup", value: "pre_employment_checkup" },
  { label: "Periodic Health Checkup", value: "periodic_checkup" },
  { label: "Occupational Health Record", value: "occupational_health" },
  { label: "Vaccination Record", value: "vaccination" },
  { label: "Medical Leave Certificate", value: "medical_leave_certificate" },
  { label: "Fitness for Duty Report", value: "fitness_duty" },
  { label: "Hospitalization Record", value: "hospitalization" },
  { label: "Health Insurance Claim", value: "insurance_claim" },
  { label: "Mental Health Report", value: "mental_health" },
  { label: "Return to Work Clearance", value: "return_to_work" },
  { label: "Chronic Illness Monitoring", value: "chronic_illness" },
  { label: "Accident/Injury Report", value: "accident_injury" },
  { label: "Drug/Alcohol Test Result", value: "drug_alcohol_test" },
];

const ManageMedicalRecord = ({ setMedicalRecord, medicalRecord }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.medicalRecord || {});

  React.useEffect(() => {
    reset({
      employee_id: medicalRecord?.medical_employee_id?.id || "",
      record_type: medicalRecord?.record_type || "",
      description: medicalRecord?.description || "",
      record_date: medicalRecord?.record_date || new Date().toISOString(),
      document_path: medicalRecord?.document_path || "",
      doctor_name: medicalRecord?.doctor_name || "",
      hospital_name: medicalRecord?.hospital_name || "",
      diagnosis: medicalRecord?.diagnosis || "",
      treatment: medicalRecord?.treatment || "",
      next_review_date:
        medicalRecord?.next_review_date || new Date().toISOString(),
      prescription_path: medicalRecord?.prescription_path || "",
    });
  }, [medicalRecord, reset]);

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
      medicalRecord
        ? await dispatch(
            updateMedicalRecord({
              id: medicalRecord.id,
              medicalRecordData: { ...data },
            })
          ).unwrap()
        : await dispatch(createMedicalRecord({ ...data })).unwrap();
      closeButton.click();
      reset();
      setMedicalRecord(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setMedicalRecord(null);
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
  }, [setMedicalRecord]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{medicalRecord ? "Update " : "Add "} Medical Record</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setMedicalRecord(null);
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
                  <label className="col-form-label">
                    Record Type <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="record_type"
                      control={control}
                      rules={{ required: "Record type is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={medicalRecordTypes}
                          placeholder="Select Record Type"
                          classNamePrefix="react-select"
                          value={medicalRecordTypes.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                    {errors.record_type && (
                      <small className="text-danger">
                        {errors.record_type.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Record Date <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="record_date"
                      control={control}
                      rules={{ required: "Record date is required!" }}
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
                          onChange={(date) => field.onChange(date)}
                          dateFormat="DD-MM-YYYY"
                        />
                      )}
                    />
                    {errors.record_date && (
                      <small className="text-danger">
                        {errors.record_date.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Document <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="document_path"
                      control={control}
                      rules={{ required: "Document is required!" }}
                      render={({ field }) => (
                        <input
                          type="file"
                          className="form-control"
                          placeholder="Upload Document"
                          onChange={(e) => field.onChange(e.target.files[0])}
                        />
                      )}
                    />
                    {errors.document_path && (
                      <small className="text-danger">
                        {errors.document_path.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Prescription <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="prescription_path"
                      control={control}
                      rules={{ required: "Prescription is required!" }}
                      render={({ field }) => (
                        <input
                          type="file"
                          className="form-control"
                          placeholder="Upload Prescription"
                          onChange={(e) => field.onChange(e.target.files[0])}
                        />
                      )}
                    />
                    {errors.prescription_path && (
                      <small className="text-danger">
                        {errors.prescription_path.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Doctor Name <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="doctor_name"
                      control={control}
                      rules={{ required: "Doctor name is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`form-control ${errors.doctor_name ? "is-invalid" : ""}`}
                          placeholder="Enter Doctor Name"
                        />
                      )}
                    />
                    {errors.doctor_name && (
                      <small className="text-danger">
                        {errors.doctor_name.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Hospital Name<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="hospital_name"
                      control={control}
                      rules={{ required: "Hospital name is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="form-control"
                          placeholder="Enter Hospital Name"
                        />
                      )}
                    />
                  </div>
                  {errors.hospital_name && (
                    <small className="text-danger">
                      {errors.hospital_name.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Diagnosis
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="diagnosis"
                      control={control}
                      rules={{ required: "Diagnosis is required" }}
                      render={({ field }) => {
                        return (
                          <input
                            {...field}
                            className="form-control"
                            placeholder="Enter Diagnosis"
                            value={field.value || null}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        );
                      }}
                    />
                    {errors.diagnosis && (
                      <small className="text-danger">
                        {errors.diagnosis.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <label className="col-form-label">
                  Treatment
                  <small className="text-muted"> (Max 255 characters)</small>
                </label>
                <div className="mb-3">
                  <Controller
                    name="treatment"
                    control={control}
                    rules={{ required: "Treatment is required!" }}
                    render={({ field }) => (
                      <textarea
                        rows={3}
                        {...field}
                        className={`form-control ${errors.treatment ? "is-invalid" : ""}`}
                        placeholder="Enter Treatment"
                      />
                    )}
                  />
                  {errors.treatment && (
                    <small className="text-danger">
                      {errors.treatment.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Next Review Date <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="next_review_date"
                      control={control}
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
                          onChange={(date) => field.onChange(date)}
                          dateFormat="DD-MM-YYYY"
                        />
                      )}
                    />
                    {errors.next_review_date && (
                      <small className="text-danger">
                        {errors.next_review_date.message}
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
                {medicalRecord
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

export default ManageMedicalRecord;
