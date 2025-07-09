import React from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";

/**
 * SharedSelect - A reusable select component that integrates React Select with React Hook Form
 *
 * @param {Object} props
 * @param {string} props.name - Field name for the form controller
 * @param {Object} props.control - React Hook Form control object
 * @param {Array} props.options - Array of options for the select (format: [{value: '', label: ''}])
 * @param {string} props.label - Label text for the select
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.isDisabled - Whether the select is disabled
 * @param {Object} props.rules - React Hook Form validation rules
 * @param {Function} props.onChange - Additional onChange handler
 * @param {any} props.value - Current value
 * @param {Object} props.errors - Form errors object
 * @param {string} props.className - Additional class name for the container
 */
const SharedSelect = ({
  name,
  control,
  options,
  label,
  required = false,
  placeholder,
  isDisabled = false,
  rules = {},
  onChange,
  value,
  errors,
  className = "",
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
        render={({ field }) => (
          <Select
            {...field}
            inputId={name}
            className="select"
            classNamePrefix="react-select"
            options={options}
            placeholder={placeholder || `Select ${label || name}`}
            isDisabled={isDisabled}
            value={
              options?.find((option) => option.value === field.value) ||
              value ||
              null
            }
            onChange={(selectedOption) => {
              field.onChange(selectedOption ? selectedOption.value : null);
              onChange && onChange(selectedOption);
            }}
            styles={{
              container: (base) => ({ ...base, width: "100%" }),
              control: (base) => ({
                ...base,
              }),
              valueContainer: (base) => ({
                ...base,
              }),
              input: (base) => ({ ...base }),
              indicatorsContainer: (base) => ({ ...base }),
            }}
            {...rest}
          />
        )}
      />
      {errors && errors[name] && (
        <small className="text-danger">{errors[name].message}</small>
      )}
    </div>
  );
};

export default SharedSelect;
