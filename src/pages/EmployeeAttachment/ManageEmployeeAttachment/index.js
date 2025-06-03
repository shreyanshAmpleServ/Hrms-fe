import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createEmployeeAttachment,
  updateEmployeeAttachment,
} from "../../../redux/EmployeeAttachment";

const ManageEmployeeAttachment = ({
  setEmployeeAttachment,
  employeeAttachment,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.employeeAttachment || {});

  React.useEffect(() => {
    reset({
      employee_id: employeeAttachment?.employee_id || "",
      document_type: employeeAttachment?.document_type || "",
      document_path: "",
    });
  }, [employeeAttachment, reset]);

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

  const employeeAttachmentTypes = [
    { value: "Resume", label: "Resume" },
    { value: "Offer Letter", label: "Offer Letter" },
    { value: "Joining Letter", label: "Joining Letter" },
    { value: "ID Proof", label: "ID Proof" },
    { value: "Address Proof", label: "Address Proof" },
    { value: "Experience Letter", label: "Experience Letter" },
    { value: "Educational Certificates", label: "Educational Certificates" },
    { value: "Salary Slips", label: "Salary Slips" },
    { value: "Relieving Letter", label: "Relieving Letter" },
    { value: "Promotion Letter", label: "Promotion Letter" },
    { value: "Other", label: "Other" },
  ];

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    const formData = new FormData();
    formData.append("employee_id", data.employee_id);
    formData.append("document_type", data.document_type);
    formData.append("document_path", data.document_path);
    if (employeeAttachment) {
      formData.append("id", employeeAttachment?.id);
    }
    try {
      employeeAttachment
        ? await dispatch(updateEmployeeAttachment(formData)).unwrap()
        : await dispatch(createEmployeeAttachment(formData)).unwrap();
      closeButton.click();
      reset();
      setEmployeeAttachment(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setEmployeeAttachment(null);
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
  }, [setEmployeeAttachment]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>
            {employeeAttachment ? "Update " : "Add New "} Employee Attachment
          </h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setEmployeeAttachment(null);
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
                    Attachment Type <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="document_type"
                      control={control}
                      rules={{ required: "Attachment type is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className="select"
                          options={employeeAttachmentTypes}
                          placeholder="Select Attachment Type"
                          classNamePrefix="react-select"
                          value={employeeAttachmentTypes.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                    {errors.status && (
                      <small className="text-danger">
                        {errors.status.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-12">
                  <label className="col-form-label">
                    Attachment <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="document_path"
                      control={control}
                      rules={{ required: "Attachment is required!" }}
                      render={({ field: { onChange, value, ...field } }) => (
                        <input
                          {...field}
                          type="file"
                          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          className="form-control"
                          onChange={(e) => onChange(e.target.files[0])}
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
                {employeeAttachment
                  ? loading
                    ? "Updating..."
                    : "Update"
                  : loading
                    ? "Uploading..."
                    : "Upload"}
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

export default ManageEmployeeAttachment;
