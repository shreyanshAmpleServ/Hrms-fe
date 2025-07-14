import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Select from "react-select";
import { designationOptionsFn } from "../../../redux/designation";

/**
 * DesignationSelect component renders a react-select dropdown for designations.
 *
 * Fetches designation options from the Redux store and displays them in a select input.
 * Optimized to avoid unnecessary re-renders and redundant fetches.
 *
 * @param {Object} props - Props passed to the component.
 * @param {string|number} props.value - The selected designation value.
 * @param {function} props.onChange - Callback when selection changes.
 * @returns {JSX.Element} The DesignationSelect component.
 */
const DesignationSelect = ({
  value,
  onChange,
  placeholder = "-- Select --",
  ...props
}) => {
  const dispatch = useDispatch();

  // Select designation options and loading state from Redux store
  const { designationOptions, loading } = useSelector(
    (state) => state.designation,
    shallowEqual
  );

  // Fetch designation options only if not already loaded
  useEffect(() => {
    if (!designationOptions || designationOptions?.length === 0) {
      dispatch(designationOptionsFn());
    }
  }, [dispatch, designationOptions]);

  // Memoize the select options for performance
  const options = useMemo(() => {
    // If the API returns options in a different format, map here
    // Assuming [{ value, label }, ...] or adapt as needed
    return designationOptions;
  }, [designationOptions]);

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

export default DesignationSelect;
