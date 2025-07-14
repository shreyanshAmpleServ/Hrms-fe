import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Select from "react-select";
import { departmentOptionsFn } from "../../../redux/department";

/**
 * DepartmentSelect component renders a react-select dropdown for departments.
 *
 * Fetches department options from the Redux store and displays them in a select input.
 * Optimized to avoid unnecessary re-renders and redundant fetches.
 *
 * @param {Object} props - Props passed to the component.
 * @param {string|number} props.value - The selected department value.
 * @param {function} props.onChange - Callback when selection changes.
 * @returns {JSX.Element} The DepartmentSelect component.
 */
const DepartmentSelect = ({
  value,
  onChange,
  placeholder = "-- Select --",
  ...props
}) => {
  const dispatch = useDispatch();

  // Select department options and loading state from Redux store
  const { departmentOptions, loading } = useSelector(
    (state) => state.department,
    shallowEqual
  );

  // Fetch department options only if not already loaded
  useEffect(() => {
    if (!departmentOptions || departmentOptions?.length === 0) {
      dispatch(departmentOptionsFn());
    }
  }, [dispatch, departmentOptions]);

  // Memoize the select options for performance
  const options = useMemo(() => {
    // If the API returns options in a different format, map here
    // Assuming [{ value, label }, ...] or adapt as needed
    return departmentOptions;
  }, [departmentOptions]);

  // Default option for the select
  const defaultOption = {
    value: "",
    label: placeholder,
    isDisabled: false,
  };

  // Memoize the selected value for performance
  const selectedOption = useMemo(
    () => options?.find((option) => option.value === value) || defaultOption,
    [options, value]
  );

  console.log(selectedOption, options);
  return (
    <Select
      className="w-100"
      options={options?.length ? [defaultOption, ...options] : []}
      isLoading={loading}
      placeholder={placeholder}
      value={selectedOption}
      classNamePrefix="react-select"
      onChange={onChange}
      {...props}
    />
  );
};

export default DepartmentSelect;
