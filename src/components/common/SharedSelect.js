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
 * @param {any} props.value - Current value (can be value or option object)
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
  const validationRules = required
    ? { required: `${label || name} is required!`, ...rules }
    : rules;

  const defaultOption = {
    value: "",
    label: `-- Select --`,
    isDisabled: false,
  };

  const optionsWithDefault =
    options && options.length > 0 && options[0]?.value !== ""
      ? [defaultOption, ...options]
      : options || [defaultOption];

  const getOptionFromValue = (val) => {
    if (val === undefined || val === null) return null;
    if (
      typeof val === "object" &&
      val.value !== undefined &&
      val.label !== undefined
    ) {
      return (
        optionsWithDefault.find((option) => option.value === val.value) || val
      );
    }
    return optionsWithDefault.find((option) => option.value === val) || null;
  };

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
        render={({ field }) => {
          const selectedOption =
            getOptionFromValue(field.value) ||
            getOptionFromValue(value) ||
            null;

          return (
            <Select
              {...field}
              inputId={name}
              className="select"
              classNamePrefix="react-select"
              options={optionsWithDefault}
              placeholder={`-- Select --`}
              isDisabled={isDisabled}
              value={selectedOption}
              onChange={(selectedOption) => {
                if (!selectedOption || selectedOption.value === "") {
                  field.onChange("");
                  onChange && onChange(defaultOption);
                } else {
                  field.onChange(selectedOption.value);
                  onChange && onChange(selectedOption);
                }
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
          );
        }}
      />
      {errors && errors[name] && (
        <small className="text-danger">{errors[name].message}</small>
      )}
    </div>
  );
};

export default SharedSelect;
