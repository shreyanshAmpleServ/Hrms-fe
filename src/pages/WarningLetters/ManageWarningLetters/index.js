import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createWarningLetters,
  updateWarningLetters,
} from "../../../redux/WarningLetters";
import { fetchlatter_type } from "../../../redux/letterType";

const ManageWarningLetters = ({ setWarningLetters, warningLetters }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.warningLetters || {});

  const severityLevels = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Critical", label: "Critical" },
  ];

  React.useEffect(() => {
    reset({
      employee_id: warningLetters?.employee_id,
      letter_type: warningLetters?.letter_type || "",
      reason: warningLetters?.reason || "",
      issued_date: warningLetters?.issued_date || moment().toISOString(),
      issued_by: warningLetters?.issued_by,
      severity_level: warningLetters?.severity_level || "",
      remarks: warningLetters?.remarks || "",
      attachment_path: "",
    });
  }, [warningLetters, reset]);

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

  React.useEffect(() => {
    dispatch(fetchlatter_type({ is_active: true }));
  }, [dispatch]);

  const { latter_type } = useSelector((state) => state.letterTypeMaster);

  const letterTypes = latter_type?.data?.map((i) => ({
    label: i?.letter_name,
    value: i?.id,
  }));

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');

    const file = data?.attachment_path;
    const formData = new FormData();
    formData.append("attachment_path", file);
    formData.append("employee_id", data?.employee_id);
    formData.append("issued_by", data?.issued_by);
    formData.append("issued_date", data?.issued_date);
    formData.append("letter_type", data?.letter_type);
    formData.append("reason", data?.reason);
    formData.append("remarks", data?.remarks);
    formData.append("severity_level", data?.severity_level);

    try {
      warningLetters
        ? await dispatch(
            updateWarningLetters({
              id: warningLetters.id,
              helpdeskTicketData: formData,
            })
          ).unwrap()
        : await dispatch(createWarningLetters(formData)).unwrap();
      closeButton.click();
      reset();
      setWarningLetters(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setWarningLetters(null);
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
  }, [setWarningLetters]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{warningLetters ? "Update " : "Add "} Warning Letters</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setWarningLetters(null);
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
                      Issued By
                      <span className="text-danger"> *</span>
                    </label>
                    <Controller
                      name="issued_by"
                      control={control}
                      rules={{ required: "Issued by is required" }}
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
                    {errors.issued_by && (
                      <small className="text-danger">
                        {errors.issued_by.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Severity Level <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="severity_level"
                      control={control}
                      rules={{ required: "Severity Level is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={severityLevels}
                          placeholder="Select Severity Level"
                          classNamePrefix="react-select"
                          value={severityLevels.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                    {errors.severity_level && (
                      <small className="text-danger">
                        {errors.severity_level.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Attachment <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="attachment_path"
                      control={control}
                      rules={{ required: "Attachment is required!" }}
                      render={({ field: { _, onChange, ...field } }) => (
                        <input
                          {...field}
                          type="file"
                          className={`form-control ${errors.attachment_path ? "is-invalid" : ""}`}
                          onChange={(option) =>
                            onChange(option.target.files[0])
                          }
                        />
                      )}
                    />
                    {errors.attachment_path && (
                      <small className="text-danger">
                        {errors.attachment_path.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Letter Type <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="letter_type"
                      control={control}
                      rules={{ required: "Ticket type is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={letterTypes}
                          placeholder="Select Ticket Type"
                          classNamePrefix="react-select"
                          value={letterTypes?.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                    {errors.letter_type && (
                      <small className="text-danger">
                        {errors.letter_type.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-12">
                  <label className="col-form-label">
                    Reason <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="reason"
                      control={control}
                      rules={{
                        required: "Reason is required!",
                        maxLength: {
                          value: 255,
                          message: "Reason must be less than 255 characters",
                        },
                      }}
                      render={({ field }) => (
                        <textarea
                          rows={3}
                          {...field}
                          className={`form-control ${errors.description ? "is-invalid" : ""}`}
                          placeholder="Enter Reason"
                        />
                      )}
                    />
                    {errors.reason && (
                      <small className="text-danger">
                        {errors.reason.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-12">
                  <label className="col-form-label">
                    Remarks <span className="text-danger">*</span>
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
                      }}
                      render={({ field }) => (
                        <textarea
                          rows={3}
                          {...field}
                          className={`form-control ${errors.remarks ? "is-invalid" : ""}`}
                          placeholder="Enter Remarks"
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
                {warningLetters
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

export default ManageWarningLetters;
