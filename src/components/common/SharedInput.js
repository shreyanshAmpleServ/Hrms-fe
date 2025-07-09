import React from "react";
import { Controller } from "react-hook-form";

/**
 * SharedInput - A reusable input component that integrates with React Hook Form
 *
 * @param {Object} props
 * @param {string} props.name - Field name for the form controller
 * @param {Object} props.control - React Hook Form control object
 * @param {string} props.label - Label text for the input
 * @param {string} props.type - Input type (text, number, email, password, etc.)
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {Object} props.rules - React Hook Form validation rules
 * @param {Function} props.onChange - Additional onChange handler
 * @param {any} props.defaultValue - Default value for the input
 * @param {Object} props.errors - Form errors object
 * @param {string} props.className - Additional class name for the container
 * @param {string} props.inputClassName - Additional class name for the input element
 */
const SharedInput = ({
  name,
  control,
  label,
  type = "text",
  required = false,
  placeholder,
  disabled = false,
  rules = {},
  onChange,
  defaultValue = "",
  errors,
  className = "",
  inputClassName = "",
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
          <input
            {...field}
            id={name}
            type={type}
            className={`form-control ${inputClassName} ${
              errors && errors[name] ? "is-invalid" : ""
            }`}
            placeholder={placeholder || label}
            disabled={disabled}
            onChange={(e) => {
              // Handle different input types
              let value = e.target.value;
              if (type === "number") {
                value = value === "" ? "" : Number(value);
              }

              // Update form value
              field.onChange(value);

              // Call additional onChange if provided
              if (onChange) {
                onChange(value, e);
              }
            }}
            {...rest}
          />
        )}
      />
      {errors && errors[name] && (
        <div className="invalid-feedback d-block">{errors[name].message}</div>
      )}
    </div>
  );
};

export default SharedInput;
