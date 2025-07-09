import React from "react";
import { Controller } from "react-hook-form";

/**
 * SharedTextArea - A reusable textarea component that integrates with React Hook Form
 *
 * @param {Object} props
 * @param {string} props.name - Field name for the form controller
 * @param {Object} props.control - React Hook Form control object
 * @param {string} props.label - Label text for the textarea
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Whether the textarea is disabled
 * @param {Object} props.rules - React Hook Form validation rules
 * @param {Function} props.onChange - Additional onChange handler
 * @param {any} props.defaultValue - Default value for the textarea
 * @param {Object} props.errors - Form errors object
 * @param {string} props.className - Additional class name for the container
 * @param {string} props.textareaClassName - Additional class name for the textarea element
 * @param {number} props.rows - Number of rows for the textarea
 * @param {number} props.maxLength - Maximum length of the textarea
 */
const SharedTextArea = ({
  name,
  control,
  label,
  required = false,
  placeholder,
  disabled = false,
  rules = {},
  onChange,
  defaultValue = "",
  errors,
  className = "",
  textareaClassName = "",
  rows = 3,
  maxLength,
  ...rest
}) => {
  // Default validation rules if required
  const validationRules = required
    ? { required: `${label || name} is required!`, ...rules }
    : rules;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label className="col-form-label" htmlFor={name}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={validationRules}
        defaultValue={defaultValue}
        render={({ field }) => (
          <div className="position-relative">
            <textarea
              {...field}
              id={name}
              className={`form-control ${textareaClassName} ${
                errors && errors[name] ? "is-invalid" : ""
              }`}
              placeholder={placeholder || label}
              disabled={disabled}
              rows={rows}
              maxLength={maxLength}
              onChange={(e) => {
                // Update form value
                field.onChange(e.target.value);

                // Call additional onChange if provided
                if (onChange) {
                  onChange(e.target.value, e);
                }
              }}
              {...rest}
            />
            {maxLength && (
              <small className="form-text text-muted position-absolute end-0">
                {field.value ? field.value.length : 0}/{maxLength}
              </small>
            )}
          </div>
        )}
      />
      {errors && errors[name] && (
        <div className="invalid-feedback d-block">{errors[name].message}</div>
      )}
    </div>
  );
};

export default SharedTextArea;
