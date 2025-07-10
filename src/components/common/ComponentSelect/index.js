import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Select from "react-select";
import { componentOptionsFn } from "../../../redux/pay-component";

/**
 * ComponentSelect component renders a react-select dropdown for components.
 *
 * Fetches component options from the Redux store and displays them in a select input.
 * Optimized to avoid unnecessary re-renders and redundant fetches.
 *
 * @param {Object} props - Props passed to the component.
 * @param {string|number} props.value - The selected component value.
 * @param {function} props.onChange - Callback when selection changes.
 * @param {boolean} props.is_advance - Whether to fetch advance components.
 * @returns {JSX.Element} The ComponentSelect component.
 */
const ComponentSelect = ({
  value,
  onChange,
  placeholder = "Select Pay Component",
  is_advance = false,
  ...props
}) => {
  const dispatch = useDispatch();

  // Select component options and loading state from Redux store
  const { componentOptions, loading } = useSelector(
    (state) => state.payComponent,
    shallowEqual
  );

  // Fetch component options only if not already loaded
  useEffect(() => {
    if (!componentOptions) {
      dispatch(componentOptionsFn({ is_advance }));
    }
  }, [dispatch, is_advance]);

  // Memoize the select options for performance
  const options = useMemo(() => {
    // If the API returns options in a different format, map here
    // Assuming [{ value, label }, ...] or adapt as needed
    return (
      componentOptions?.map((item) => ({
        value: item.id,
        label: item.component_name,
        record: item,
      })) || []
    );
  }, [componentOptions]);

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

export default ComponentSelect;
