import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import { fetchCountries } from "../../../../../redux/country";
import {
  addstatutory_rates,
  updatestatutory_rates,
} from "../../../../../redux/statutoryRate";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.reviewTemplateMaster);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm();

  React.useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const { countries } = useSelector((state) => state.countries);

  const CountriesList = countries.map((emnt) => ({
    value: String(emnt.id),
    label: "(" + emnt.code + ") " + emnt.name,
  }));

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        country_code: initialData.country_code || "",
        lower_limit: initialData.lower_limit || "",
        statutory_type: initialData.statutory_type || "",
        upper_limit: initialData.upper_limit || "",
        rate_percent: initialData.rate_percent || "",
        effective_from: initialData.effective_from || "",
        is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        country_code: "",
        lower_limit: "",
        statutory_type: "",
        upper_limit: "",
        rate_percent: "",
        effective_from: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_statutory_rates_modal");
    if (mode === "add") {
      dispatch(addstatutory_rates(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updatestatutory_rates({
          id: initialData.id,
          statutory_ratesData: data,
        }),
      );
    }
    reset();
    setSelected(null);
    closeButton?.click();
  };

  return (
    <div
      className="modal fade"
      id="add_edit_statutory_rates_modal"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add"
                ? "Add New Statutory Rates"
                : "Edit Statutory Rates"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_statutory_rates_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                {/* Country Code */}

                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Statutory Type <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.statutory_type ? "is-invalid" : ""}`}
                    {...register("statutory_type", {
                      required: "Statutory type is required.",
                    })}
                  />
                  {errors.statutory_type && (
                    <small className="text-danger">
                      {errors.statutory_type.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Effective From <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="effective_from"
                    control={control}
                    rules={{ required: "effective_from" }}
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="Select date"
                        className={`form-control ${errors.valid_from ? "is-invalid" : ""}`}
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="dd-MM-yyyy"
                      />
                    )}
                  />
                  {errors.valid_from && (
                    <small className="text-danger">
                      {errors.valid_from.message}
                    </small>
                  )}
                </div>
                {/* Lower Limit */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Lower Limit <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.lower_limit ? "is-invalid" : ""}`}
                    {...register("lower_limit", {
                      required: "Lower limit is required.",
                    })}
                  />
                  {errors.lower_limit && (
                    <small className="text-danger">
                      {errors.lower_limit.message}
                    </small>
                  )}
                </div>

                {/* Statutory Type */}

                {/* Upper Limit */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Upper Limit <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.upper_limit ? "is-invalid" : ""}`}
                    {...register("upper_limit", {
                      required: "Upper limit is required.",
                    })}
                  />
                  {errors.upper_limit && (
                    <small className="text-danger">
                      {errors.upper_limit.message}
                    </small>
                  )}
                </div>

                {/* Rate Percent */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Rate Percent <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className={`form-control ${errors.rate_percent ? "is-invalid" : ""}`}
                    {...register("rate_percent", {
                      required: "Rate percent is required.",
                      max: {
                        value: 100,
                        message: "Rate percent cannot be more than 100.",
                      },
                    })}
                  />
                  {errors.rate_percent && (
                    <small className="text-danger">
                      {errors.rate_percent.message}
                    </small>
                  )}
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Country <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="country_code"
                      control={control}
                      rules={{ required: "Country is required" }} // Validation rule
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={CountriesList}
                          placeholder="Choose"
                          isDisabled={!CountriesList.length} // Disable if no stages are available
                          classNamePrefix="react-select"
                          className="select2"
                          onChange={(selectedOption) =>
                            field.onChange(selectedOption?.value || null)
                          } // Send only value
                          value={
                            CountriesList?.find(
                              (option) =>
                                option.value === watch("country_code"),
                            ) || ""
                          }
                        />
                      )}
                    />
                    {errors.country_code && (
                      <small className="text-danger">
                        {errors.country_code.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mb-0">
                <label className="col-form-label">Status</label>
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <input
                      type="radio"
                      className="status-radio"
                      id="active"
                      value="Y"
                      {...register("is_active", {
                        required: "Status is required.",
                      })}
                    />
                    <label htmlFor="active">Active</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      className="status-radio"
                      id="inactive"
                      value="N"
                      {...register("is_active")}
                    />
                    <label htmlFor="inactive">Inactive</label>
                  </div>
                </div>
                {errors.is_active && (
                  <small className="text-danger">
                    {errors.is_active.message}
                  </small>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <div className="d-flex align-items-center justify-content-end m-0">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary"
                >
                  {loading
                    ? mode === "add"
                      ? "Creating..."
                      : "Updating..."
                    : mode === "add"
                      ? "Create"
                      : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditModal;
