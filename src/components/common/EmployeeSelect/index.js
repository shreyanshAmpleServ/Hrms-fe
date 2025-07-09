import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Select from "react-select";
import { employeeOptionsFn } from "../../../redux/Employee";

/**
 * EmployeeSelect component renders a react-select dropdown for employees.
 *
 * Fetches employee options from the Redux store and displays them in a select input.
 * Optimized to avoid unnecessary re-renders and redundant fetches.
 *
 * @param {Object} props - Props passed to the component.
 * @param {string|number} props.value - The selected employee value.
 * @param {function} props.onChange - Callback when selection changes.
 * @returns {JSX.Element} The EmployeeSelect component.
 */
const EmployeeSelect = ({
  value,
  onChange,
  placeholder = "Select Employee",
  ...props
}) => {
  const dispatch = useDispatch();

  // Select employee options and loading state from Redux store
  const employeeOptions = useSelector(
    (state) => state.employee.employeeOptions,
    shallowEqual
  );
  const loading = useSelector((state) => state.employee.loading);

  // Fetch employee options only if not already loaded
  useEffect(() => {
    if (!employeeOptions || employeeOptions.length === 0) {
      dispatch(employeeOptionsFn());
    }
  }, [dispatch, employeeOptions]);

  // Memoize the select options for performance
  const options = useMemo(() => {
    // If the API returns options in a different format, map here
    // Assuming [{ value, label }, ...] or adapt as needed
    return employeeOptions || [];
  }, [employeeOptions]);

  // Memoize the selected value for performance
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) || null,
    [options, value]
  );

  return (
    <Select
      className="w-100"
      options={options}
      isLoading={loading}
      placeholder={placeholder}
      value={selectedOption}
      classNamePrefix="react-select"
      onChange={onChange}
      {...props}
    />
  );
};

export default EmployeeSelect;
