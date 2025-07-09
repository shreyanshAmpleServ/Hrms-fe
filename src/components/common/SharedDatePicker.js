import React from "react";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * SharedDatePicker - A reusable date picker component that integrates with React Hook Form
 *
 * @param {Object} props
 * @param {string} props.name - Field name for the form controller
 * @param {Object} props.control - React Hook Form control object
 * @param {string} props.label - Label text for the date picker
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Whether the date picker is disabled
 * @param {Object} props.rules - React Hook Form validation rules
 * @param {Function} props.onChange - Additional onChange handler
 * @param {Date|string} props.defaultValue - Default value for the date picker
 * @param {Object} props.errors - Form errors object
 * @param {string} props.className - Additional class name for the container
 * @param {string} props.dateFormat - Date format string (default: "dd/MM/yyyy")
 * @param {boolean} props.showTimeSelect - Whether to show time selection
 * @param {boolean} props.showYearDropdown - Whether to show year dropdown
 * @param {boolean} props.showMonthDropdown - Whether to show month dropdown
 * @param {boolean} props.isClearable - Whether to show clear button
 * @param {Date} props.minDate - Minimum selectable date
 * @param {Date} props.maxDate - Maximum selectable date
 * @param {boolean} props.excludePastDates - Whether to exclude past dates
 * @param {Array} props.excludeDates - Array of dates to exclude
 */
const SharedDatePicker = ({
  name,
  control,
  label,
  required = false,
  placeholder,
  disabled = false,
  rules = {},
  onChange,
  defaultValue = null,
  errors,
  className = "",
  dateFormat = "dd/MM/yyyy",
  showTimeSelect = false,
  showYearDropdown = false,
  showMonthDropdown = false,
  isClearable = false,
  minDate,
  maxDate,
  excludePastDates = false,
  excludeDates = [],
  ...rest
}) => {
  // Default validation rules if required
  const validationRules = required
    ? { required: `${label || name} is required!`, ...rules }
    : rules;

  // Calculate min date if excludePastDates is true
  const calculatedMinDate = excludePastDates ? new Date() : minDate;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label className="col-form-label" htmlFor={name}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="mb-3 icon-form">
        <span className="form-icon">
          <i className="ti ti-calendar-check" />
        </span>
        <Controller
          name={name}
          control={control}
          rules={validationRules}
          defaultValue={defaultValue}
          render={({ field }) => (
            <div className="position-relative">
              <DatePicker
                id={name}
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => {
                  // Update form value
                  field.onChange(date);

                  // Call additional onChange if provided
                  if (onChange) {
                    onChange(date);
                  }
                }}
                className={`form-control ${
                  errors && errors[name] ? "is-invalid" : ""
                }`}
                placeholderText={placeholder || `Select ${label || "date"}`}
                dateFormat={dateFormat}
                showTimeSelect={showTimeSelect}
                showYearDropdown={showYearDropdown}
                showMonthDropdown={showMonthDropdown}
                isClearable={isClearable}
                disabled={disabled}
                minDate={calculatedMinDate}
                maxDate={maxDate}
                excludeDates={excludeDates}
                autoComplete="off"
                {...rest}
              />
              {isClearable && field.value && (
                <button
                  type="button"
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 p-0"
                  onClick={() => {
                    field.onChange(null);
                    if (onChange) {
                      onChange(null);
                    }
                  }}
                  style={{ background: "transparent", border: "none" }}
                  aria-label="Clear date"
                >
                  <i
                    className="ti ti-x text-muted"
                    style={{ fontSize: "14px" }}
                  />
                </button>
              )}
            </div>
          )}
        />
      </div>

      {errors && errors[name] && (
        <div className="invalid-feedback d-block">{errors[name].message}</div>
      )}
    </div>
  );
};

export default SharedDatePicker;
