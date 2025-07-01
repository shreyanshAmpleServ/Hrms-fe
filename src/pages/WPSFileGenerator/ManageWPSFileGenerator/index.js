import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { createWPSFile, updateWPSFile } from "../../../redux/WPSFileGenerator";

const ManageWPSFileGenerator = ({ setSelected, selected }) => {
  const dispatch = useDispatch();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payroll_month: "",
      file_path: "",
      generated_on: new Date().toISOString(),
      submitted_to_bank: false,
    },
  });

  const monthsOptions = [
    { label: "January", value: "January" },
    { label: "February", value: "February" },
    { label: "March", value: "March" },
    { label: "April", value: "April" },
    { label: "May", value: "May" },
    { label: "June", value: "June" },
    { label: "July", value: "July" },
    { label: "August", value: "August" },
    { label: "September", value: "September" },
    { label: "October", value: "October" },
    { label: "November", value: "November" },
    { label: "December", value: "December" },
  ];

  const { loading } = useSelector((state) => state.wpsFileGenerator || {});

  React.useEffect(() => {
    if (selected) {
      reset({
        payroll_month: selected.payroll_month || "",
        file_path: "",
        generated_on: selected.generated_on || new Date().toISOString(),
        submitted_to_bank: selected.submitted_to_bank || false,
      });
    } else {
      reset({
        payroll_month: "",
        file_path: "",
        generated_on: new Date().toISOString(),
        submitted_to_bank: false,
      });
    }
  }, [selected, reset]);

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    const formData = new FormData();
    formData.append("payroll_month", data.payroll_month);
    formData.append("file_path", data.file_path[0]); // get the actual file
    formData.append("generated_on", data.generated_on);
    formData.append("submitted_to_bank", data.submitted_to_bank);

    try {
      selected
        ? await dispatch(
            updateWPSFile({
              id: selected.id,
              wpsFileData: { ...data, rating: Number(data.rating) },
            })
          ).unwrap()
        : await dispatch(
            createWPSFile({
              ...data,
              rating: Number(data.rating),
            })
          ).unwrap();
      closeButton.click();
      reset();
      setSelected(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setSelected(null);
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
  }, [setSelected]);
  return (
    <>
      {/* Add New appointment */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{selected ? "Update " : "Add "} Appraisal Entries</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setSelected(null);
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
                      Payroll Month
                      <span className="text-danger"> *</span>
                    </label>
                    <Controller
                      name="payroll_month"
                      control={control}
                      rules={{ required: "Payroll month is required" }}
                      render={({ field }) => {
                        const selectedMonth = monthsOptions?.find(
                          (month) => month.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={monthsOptions}
                            placeholder="Select Payroll Month"
                            classNamePrefix="react-select"
                            value={selectedMonth || null}
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
                    {errors.payroll_month && (
                      <small className="text-danger">
                        {errors.payroll_month.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3 ">
                    <label className="col-form-label">File Path</label>
                    <input
                      type="file"
                      className={`form-control ${errors.file_path ? "is-invalid" : ""}`}
                      accept=".pdf"
                      {...register("file_path", {
                        required: "File Path is required.",
                        validate: {
                          isPdf: (files) =>
                            files[0]?.type === "application/pdf" ||
                            "Only PDF files are allowed.",
                        },
                      })}
                    />
                    {errors.file_path && (
                      <small className="text-danger">
                        {errors.file_path.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Generated On<span className="text-danger"> *</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="generated_on"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          type="date"
                          className="form-control"
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
                  {errors.generated_on && (
                    <small className="text-danger">
                      {errors.generated_on.message}
                    </small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="col-form-label">
                    Submitted To Bank
                    <span className="text-danger"> *</span>
                  </label>
                  <Controller
                    name="submitted_to_bank"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="checkbox"
                        className="form-check-input"
                        checked={field.value || false}
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
                {selected
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

export default ManageWPSFileGenerator;
