import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../../../redux/Employee";
import { createHRLetter, updateHRLetter } from "../../../../../redux/HRLetters";
import { fetchlatter_type } from "../../../../../redux/letterType";

const AddEditModal = ({ mode = "add", initialData = null, setHrLetter }) => {
  const [searchValue, setSearchValue] = useState("");
  const { loading } = useSelector((state) => state.hrLetters);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  React.useEffect(() => {
    dispatch(fetchEmployee({ search: searchValue }));
    dispatch(fetchlatter_type({ search: searchValue }));
  }, [searchValue, dispatch]);

  const employee = useSelector((state) => state.employee.employee);

  const EmployeeList =
    employee?.data?.map((item) => ({
      value: item.id,
      label: item.full_name,
    })) || [];
  const { latter_type, loading: letterTypeLoading } = useSelector(
    (state) => state.letterTypeMaster
  );

  const letterTypeOptions = latter_type?.data?.map((item) => ({
    value: item.id,
    label: item.letter_name,
  }));

  const statusOptions = [
    { value: "P", label: "Pending" },
    { value: "A", label: "Approved" },
    { value: "R", label: "Rejected" },
  ];

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        letter_subject: initialData.letter_subject || "",
        letter_content: initialData.letter_content || "",
        letter_type: initialData.letter_type || "",
        employee_id: initialData.employee_id || "",
        issue_date: initialData.issue_date || new Date().toISOString(),
        document_path: initialData.document_path || null,
        request_date: initialData.request_date || new Date().toISOString(),
        status: initialData.status || "P",
      });
    } else {
      reset({
        letter_subject: "",
        letter_content: "",
        letter_type: "",
        employee_id: "",
        issue_date: new Date().toISOString(),
        document_path: null,
        request_date: new Date().toISOString(),
        status: "P",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_hr_letter_offcanvas");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (mode === "add") {
      dispatch(createHRLetter(formData));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateHRLetter({
          id: initialData.id,
          hrLetterData: formData,
        })
      );
    }
    reset();
    closeButton?.click();
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setHrLetter(null);
        reset();
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
  }, [reset, setHrLetter]);
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      id="offcanvas_add"
      tabIndex={-1}
    >
      <div className="offcanvas-header border-bottom">
        <h4>{mode === "add" ? "Add HR Letter" : "Edit HR Letter"}</h4>
        <button
          className="btn-close custom-btn-close border p-1 me-0 text-dark"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          id="close_hr_letter_offcanvas"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Employee Name
                  <span className="text-danger">*</span>
                </label>
                <Controller
                  name="employee_id"
                  control={control}
                  rules={{ required: "Employee Name is required" }}
                  render={({ field }) => {
                    const selectedEmployee = EmployeeList?.find(
                      (option) => option.value === field.value
                    );
                    return (
                      <Select
                        {...field}
                        className="select"
                        options={[
                          { value: "", label: "-- Select --" },
                          ...EmployeeList,
                        ]}
                        placeholder="-- Select --"
                        classNamePrefix="react-select"
                        onInputChange={(inputValue) =>
                          setSearchValue(inputValue)
                        }
                        value={selectedEmployee || null}
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption.value)
                        }
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
                  Letter Type
                  <span className="text-danger">*</span>
                </label>
                <Controller
                  name="letter_type"
                  control={control}
                  rules={{ required: "Letter Type is required" }}
                  render={({ field }) => {
                    const selectedLetterType = letterTypeOptions?.find(
                      (option) => option.value === field.value
                    );
                    return (
                      <Select
                        {...field}
                        className="select"
                        options={[
                          { value: "", label: "-- Select --" },
                          ...letterTypeOptions,
                        ]}
                        placeholder="-- Select --"
                        isLoading={letterTypeLoading}
                        classNamePrefix="react-select"
                        onInputChange={(inputValue) =>
                          setSearchValue(inputValue)
                        }
                        value={selectedLetterType || null}
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption.value)
                        }
                      />
                    );
                  }}
                />
                {errors.letter_type && (
                  <small className="text-danger">
                    {errors.letter_type.message}
                  </small>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Document</label>
                <Controller
                  name="document_path"
                  control={control}
                  render={({ field }) => {
                    return (
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="form-control"
                        onChange={(e) => {
                          field.onChange(e.target.files[0]);
                        }}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Status</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        className="select"
                        options={statusOptions}
                        classNamePrefix="react-select"
                        placeholder="Choose Status"
                        value={
                          statusOptions?.find(
                            (option) => option.value === field.value
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption.value)
                        }
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Request Date</label>
                <div className="mb-3 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-calendar-check" />
                  </span>
                  <Controller
                    name="request_date"
                    control={control}
                    rules={{ required: "Request Date is required!" }}
                    render={({ field }) => (
                      <ReactDatePicker
                        {...field}
                        className="form-control"
                        placeholderText="Select Request Date"
                        selected={field.value}
                        value={
                          field.value
                            ? moment(field.value).format("DD-MM-YYYY")
                            : null
                        }
                        onChange={(date) => field.onChange(date)}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Issue Date</label>
                <div className="mb-3 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-calendar-check" />
                  </span>
                  <Controller
                    name="issue_date"
                    control={control}
                    render={({ field }) => {
                      return (
                        <ReactDatePicker
                          className="form-control"
                          placeholderText="Enter Issue Date"
                          {...field}
                          value={
                            field.value
                              ? moment(field.value).format("DD-MM-YYYY")
                              : null
                          }
                          onChange={(date) => field.onChange(date)}
                        />
                      );
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3 col-md-12">
              <label className="col-form-label">
                Letter Subject <span className="text-danger">*</span>
              </label>
              <Controller
                name="letter_subject"
                control={control}
                rules={{ required: "Letter Subject is required" }}
                render={({ field }) => {
                  return (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Letter Subject"
                      {...field}
                    />
                  );
                }}
              />

              {errors.letter_subject && (
                <small className="text-danger">
                  {errors.letter_subject.message}
                </small>
              )}
            </div>
            <div className="col-md-12">
              <div className="mb-3">
                <label className="col-form-label">
                  Letter Content <span className="text-danger">*</span>
                </label>
                <Controller
                  name="letter_content"
                  control={control}
                  rules={{ required: "Letter Content is required" }}
                  render={({ field }) => {
                    return (
                      <textarea
                        className="form-control"
                        placeholder="Enter Letter Content"
                        {...field}
                        rows={3}
                      />
                    );
                  }}
                />
                {errors.letter_content && (
                  <small className="text-danger">
                    {errors.letter_content.message}
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
              {mode !== "add"
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
  );
};

export default AddEditModal;
