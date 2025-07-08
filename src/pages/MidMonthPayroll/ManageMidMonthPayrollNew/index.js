import { Table } from "antd";
import React, { useCallback, useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchCurrencies } from "../../../redux/currency";
import { employeeOptionsFn } from "../../../redux/Employee";
import {
  createMidMonthPayroll,
  fetchMidMonthPayroll,
} from "../../../redux/MidMonthPayroll";
import { fetchpay_component } from "../../../redux/pay-component";

export const DEFAULT_PAYROLL_MONTH = new Date().getMonth() + 1; // 1-based month
export const DEFAULT_PAYROLL_WEEK = 1;
export const DEFAULT_PAYROLL_YEAR = new Date().getFullYear();

export const payrollMonthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export const payrollWeekOptions = [
  { value: 1, label: "Week 1" },
  { value: 2, label: "Week 2" },
  { value: 3, label: "Week 3" },
  { value: 4, label: "Week 4" },
];

const ManageMidMonthPayroll = ({ midMonthPayroll }) => {
  const [payroll, setPayroll] = React.useState([]);
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.midMonthPayroll || {});
  const { currencies } = useSelector((state) => state.currencies);
  const { employeeOptions } = useSelector((state) => state.employee);
  const { pay_component } = useSelector((state) => state.payComponent);

  // Memoize pay component options
  const paycomponentOptions = useMemo(
    () =>
      pay_component?.data?.map((item) => ({
        value: item.id,
        label: item.component_name,
      })) || [],
    [pay_component]
  );

  // Currency options
  const currencyList = useMemo(
    () =>
      currencies?.data?.map((item) => ({
        value: item.id,
        label: `${item.currency_name} (${item.currency_code})`,
        currency_name: item.currency_name,
        currency_code: item.currency_code,
      })) || [],
    [currencies]
  );

  // Helper to get currency_name by id
  const getCurrencyNameById = (id) => {
    const found = currencyList.find((c) => String(c.value) === String(id));
    return found ? found.currency_name + " (" + found.currency_code + ")" : "";
  };

  // Helper to get currency_code by id
  const getCurrencyCodeById = (id) => {
    const found = currencyList.find((c) => String(c.value) === String(id));
    return found ? found.currency_code + " (" + found.currency_name + ")" : "";
  };

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchCurrencies({ is_active: true }));
    dispatch(fetchpay_component({ is_active: true, is_advance: "Y" }));
    dispatch(employeeOptionsFn());
  }, [dispatch]);

  // Set payroll list when employee options change
  useEffect(() => {
    if (employeeOptions) {
      setPayroll(
        employeeOptions.map((item) => {
          const pay_currency = watch("pay_currency") || "";
          return {
            employee_id: item.value,
            employee_name: item.label,
            net_pay: 0,
            pay_currency,
            processed: "N",
            is_selected: false,
            employee_email: item?.meta?.email || "",
            currency_name: getCurrencyNameById(pay_currency),
            currency_code: getCurrencyCodeById(pay_currency),
          };
        })
      );
    }
    // eslint-disable-next-line
  }, [employeeOptions, currencyList, watch("pay_currency")]);

  // When global currency changes, update all unmodified (default) pay_currency in payroll
  useEffect(() => {
    setPayroll((prev) =>
      prev.map((item) => {
        if (!item.pay_currency || item.pay_currency === "") {
          const pay_currency = watch("pay_currency") || "";
          return {
            ...item,
            pay_currency,
            currency_name: getCurrencyNameById(pay_currency),
            currency_code: getCurrencyCodeById(pay_currency),
          };
        }
        return item;
      })
    );
    // eslint-disable-next-line
  }, [watch("pay_currency"), currencyList]);

  // Reset form on mount and when midMonthPayroll changes
  useEffect(() => {
    reset({
      payroll_month: midMonthPayroll?.payroll_month || DEFAULT_PAYROLL_MONTH,
      payroll_week: midMonthPayroll?.payroll_week || DEFAULT_PAYROLL_WEEK,
      payroll_year: midMonthPayroll?.payroll_year || DEFAULT_PAYROLL_YEAR,
      pay_date: midMonthPayroll?.pay_date
        ? new Date(midMonthPayroll.pay_date)
        : new Date(),
      pay_currency: midMonthPayroll?.pay_currency || "",
      currency_name: midMonthPayroll?.currency_name || "",
      execution_date: midMonthPayroll?.execution_date
        ? new Date(midMonthPayroll.execution_date)
        : new Date(),
      doc_date: midMonthPayroll?.doc_date
        ? new Date(midMonthPayroll.doc_date)
        : new Date(),
      status: midMonthPayroll?.status || "Pending",
      component_id: midMonthPayroll?.component_id || "",
    });
    // When resetting, also update payroll pay_currency and currency_name to match global
    setPayroll((prev) =>
      prev.map((item) => {
        const pay_currency = midMonthPayroll?.pay_currency || "";
        return {
          ...item,
          pay_currency,
          currency_name: getCurrencyNameById(pay_currency),
          currency_code: getCurrencyCodeById(pay_currency),
        };
      })
    );
    // eslint-disable-next-line
  }, [reset, midMonthPayroll, currencyList]);

  // Handle employee selection
  const handleChangeEmployee = useCallback(
    (e, a) => {
      setPayroll((prev) =>
        prev.map((item) =>
          item.employee_id === a.employee_id
            ? { ...item, is_selected: e.target.checked }
            : item
        )
      );
    },
    [setPayroll]
  );

  // Handle net pay change
  const handleNetPayChange = useCallback(
    (value, index) => {
      setPayroll((prev) =>
        prev.map((item, idx) =>
          idx === index ? { ...item, net_pay: value } : item
        )
      );
    },
    [setPayroll]
  );

  // Handle per-employee currency change
  const handleEmployeeCurrencyChange = useCallback(
    (currencyValue, index) => {
      setPayroll((prev) =>
        prev.map((item, idx) =>
          idx === index
            ? {
                ...item,
                pay_currency: currencyValue,
                currency_name: getCurrencyNameById(currencyValue),
                currency_code: getCurrencyCodeById(currencyValue),
              }
            : item
        )
      );
    },
    [setPayroll, currencyList]
  );

  // Prepare selected employees for submission
  const selectedEmployees = useMemo(
    () =>
      payroll
        .filter((item) => item.is_selected)
        .map((item) => {
          // Determine pay_currency and currency_name for this employee
          const pay_currency = item.pay_currency || watch("pay_currency");
          const currency_name = getCurrencyNameById(pay_currency);
          return {
            ...item,
            payroll_month: watch("payroll_month"),
            payroll_week: watch("payroll_week"),
            payroll_year: watch("payroll_year"),
            pay_date: watch("pay_date")
              ? new Date(watch("pay_date")).toISOString()
              : "",
            pay_currency,
            currency_name,
            processed: "Y",
            execution_date: watch("execution_date")
              ? new Date(watch("execution_date")).toISOString()
              : "",
            doc_date: watch("doc_date")
              ? new Date(watch("doc_date")).toISOString()
              : "",
            status: watch("status"),
            remarks: "",
            employee_email: item.employee_email,
            component_id: watch("component_id "),
          };
        }),
    [payroll, watch, currencyList]
  );

  // Table columns
  const columns = [
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      render: (text, a) => (
        <div className="d-flex align-items-center gap-3">
          <input
            type="checkbox"
            className="form-check-input"
            style={{
              width: "20px",
              height: "20px",
            }}
            checked={a.is_selected}
            onChange={(e) => handleChangeEmployee(e, a)}
            aria-label={`Select employee ${a.employee_id}`}
          />
          <p className="mt-2 mb-0">{text}</p>
        </div>
      ),
    },
    {
      title: "Employee Name",
      dataIndex: "employee_name",
      render: (text) => text || "-",
    },
    {
      title: "Processed",
      dataIndex: "processed",
      render: (_, record) =>
        record.is_selected ? (
          <div className="badge bg-success">Yes</div>
        ) : (
          <div className="badge bg-danger">No</div>
        ),
    },
    {
      title: "Pay Currency",
      dataIndex: "pay_currency",
      render: (text, record, index) =>
        record.is_selected ? (
          <Select
            inputId={`pay_currency_row_${record.employee_id}`}
            className="select"
            options={currencyList}
            placeholder="Select Currency"
            classNamePrefix="react-select"
            value={
              currencyList.find(
                (x) =>
                  String(x.value) ===
                  String(record.pay_currency || watch("pay_currency"))
              ) || null
            }
            onChange={(option) =>
              handleEmployeeCurrencyChange(option ? option.value : "", index)
            }
            isDisabled={!record.is_selected}
            styles={{
              container: (base) => ({
                ...base,
                minWidth: 150,
                maxWidth: 250,
              }),
              control: (base) => ({
                ...base,
                minHeight: 30,
                height: 30,
                fontSize: 13,
              }),
              valueContainer: (base) => ({
                ...base,
                height: 30,
                padding: "0 6px",
              }),
              input: (base) => ({
                ...base,
                margin: 0,
                padding: 0,
              }),
              indicatorsContainer: (base) => ({
                ...base,
                height: 30,
              }),
            }}
          />
        ) : (
          <p className="mb-0">
            {record.pay_currency
              ? getCurrencyNameById(record.pay_currency)
              : "-"}
          </p>
        ),
      width: "250px",
    },
    {
      title: "Net Pay",
      dataIndex: "net_pay",
      render: (text, record, index) =>
        record.is_selected ? (
          <input
            type="number"
            className="form-control form-control-sm"
            value={record.net_pay || ""}
            min="0"
            onChange={(e) => {
              const value = e.target.value;
              handleNetPayChange(value, index);
            }}
            aria-label={`Net pay for employee ${record.employee_id}`}
          />
        ) : (
          <p className="mb-0">{text ?? "-"}</p>
        ),
      width: "200px",
    },
  ];

  // Enhanced onSubmit: validate at least one employee is selected and net pay is positive
  const onSubmit = async () => {
    if (selectedEmployees.length === 0) {
      alert("Please select at least one employee and enter Net Pay.");
      return;
    }
    const hasInvalidNetPay = selectedEmployees.some(
      (emp) => !emp.net_pay || isNaN(emp.net_pay) || Number(emp.net_pay) <= 0
    );
    if (hasInvalidNetPay) {
      alert(
        "Please enter a valid Net Pay (greater than 0) for all selected employees."
      );
      return;
    }
    // Validate that all selected employees have a currency
    const hasInvalidCurrency = selectedEmployees.some(
      (emp) => !emp.pay_currency
    );
    if (hasInvalidCurrency) {
      alert("Please select a currency for all selected employees.");
      return;
    }

    // Validate that all selected employees have a currency_name
    const hasInvalidCurrencyName = selectedEmployees.some(
      (emp) => !emp.currency_name
    );
    if (hasInvalidCurrencyName) {
      alert("Currency name is missing for one or more selected employees.");
      return;
    }

    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      // Send selected employees as part of the data
      await dispatch(createMidMonthPayroll(selectedEmployees)).unwrap();
      if (closeButton) closeButton.click();
      reset();
      setPayroll((prev) =>
        prev.map((item) => ({
          ...item,
          is_selected: false,
          net_pay: 0,
          pay_currency: watch("pay_currency") || "",
          currency_name: getCurrencyNameById(watch("pay_currency") || ""),
          currency_code: getCurrencyCodeById(watch("pay_currency") || ""),
        }))
      );
      await dispatch(fetchMidMonthPayroll()).unwrap();
    } catch (error) {
      console.error("Error creating mid month payroll", error);
    }
  };

  // Reset form when offcanvas closes
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        reset();
        setPayroll((prev) =>
          prev.map((item) => ({
            ...item,
            is_selected: false,
            net_pay: 0,
            pay_currency: watch("pay_currency") || "",
            currency_name: getCurrencyNameById(watch("pay_currency") || ""),
            currency_code: getCurrencyCodeById(watch("pay_currency") || ""),
          }))
        );
      };
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose
      );
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleModalClose
        );
      };
    }
  }, [reset, currencyList, watch("pay_currency")]);

  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-larger"
        tabIndex={-1}
        id="offcanvas_add"
        aria-labelledby="offcanvas_add_label"
      >
        <div className="offcanvas-header border-bottom">
          <h4 id="offcanvas_add_label">
            {midMonthPayroll ? "Update " : "Add "} Mid Month Payroll
          </h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              reset();
              setPayroll((prev) =>
                prev.map((item) => ({
                  ...item,
                  is_selected: false,
                  net_pay: 0,
                  pay_currency: watch("pay_currency") || "",
                  currency_name: getCurrencyNameById(
                    watch("pay_currency") || ""
                  ),
                  currency_code: getCurrencyCodeById(
                    watch("pay_currency") || ""
                  ),
                }))
              );
            }}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div>
              <div className="row">
                <div className="col-md-4">
                  <label className="col-form-label" htmlFor="payroll_week">
                    Payroll Week <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="payroll_week"
                      control={control}
                      rules={{ required: "Payroll Week is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          inputId="payroll_week"
                          className="select"
                          placeholder="Select Payroll Week"
                          options={payrollWeekOptions}
                          classNamePrefix="react-select"
                          value={payrollWeekOptions.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                  </div>
                  {errors.payroll_week && (
                    <small className="text-danger">
                      {errors.payroll_week.message}
                    </small>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="col-form-label" htmlFor="payroll_month">
                    Payroll Month <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="payroll_month"
                      control={control}
                      rules={{ required: "Payroll Month is required!" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          inputId="payroll_month"
                          className="select"
                          placeholder="Select Payroll Month"
                          options={payrollMonthOptions}
                          classNamePrefix="react-select"
                          value={payrollMonthOptions.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => field.onChange(option.value)}
                        />
                      )}
                    />
                  </div>
                  {errors.payroll_month && (
                    <small className="text-danger">
                      {errors.payroll_month.message}
                    </small>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="col-form-label" htmlFor="payroll_year">
                    Payroll Year <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="payroll_year"
                      control={control}
                      rules={{ required: "Payroll Year is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          id="payroll_year"
                          className="form-control"
                          placeholderText="Select Payroll Year"
                          showYearPicker
                          dateFormat="yyyy"
                          selected={
                            field.value ? new Date(field.value, 0) : null
                          }
                          onChange={(date) =>
                            field.onChange(date ? date.getFullYear() : null)
                          }
                        />
                      )}
                    />
                  </div>
                  {errors.payroll_year && (
                    <small className="text-danger">
                      {errors.payroll_year.message}
                    </small>
                  )}
                </div>

                <div className="col-md-4">
                  <label className="col-form-label" htmlFor="pay_date">
                    Pay Date <span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="pay_date"
                      control={control}
                      rules={{ required: "Pay Date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          id="pay_date"
                          className="form-control"
                          placeholderText="Select Pay Date"
                          selected={field.value ? new Date(field.value) : null}
                          dateFormat="dd-MM-yyyy"
                          onChange={(date) => field.onChange(date)}
                        />
                      )}
                    />
                  </div>
                  {errors.pay_date && (
                    <small className="text-danger">
                      {errors.pay_date.message}
                    </small>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="col-form-label" htmlFor="execution_date">
                    Execution Date
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="execution_date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          id="execution_date"
                          className="form-control"
                          placeholderText="Select Execution Date"
                          selected={field.value ? new Date(field.value) : null}
                          dateFormat="dd-MM-yyyy"
                          onChange={(date) => field.onChange(date)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="col-form-label" htmlFor="doc_date">
                    Document Date
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="doc_date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          id="doc_date"
                          className="form-control"
                          placeholderText="Select Document Date"
                          selected={field.value ? new Date(field.value) : null}
                          dateFormat="dd-MM-yyyy"
                          onChange={(date) => field.onChange(date)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="col-form-label" htmlFor="component_id ">
                    Pay Component <span className="text-danger">*</span>
                  </label>

                  <Controller
                    name="component_id"
                    rules={{ required: "Pay Component is required!" }}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        inputId="component_id"
                        className="select"
                        options={paycomponentOptions}
                        placeholder="Select Pay Component"
                        classNamePrefix="react-select"
                        value={paycomponentOptions.find(
                          (x) => x.value === field.value
                        )}
                        onChange={(option) => field.onChange(option.value)}
                      />
                    )}
                  />
                  {errors.component_id && (
                    <small className="text-danger">
                      {errors.component_id.message}
                    </small>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="col-form-label" htmlFor="pay_currency">
                    Currency
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="pay_currency"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          inputId="pay_currency"
                          className="select"
                          options={currencyList}
                          placeholder="Select Currency"
                          classNamePrefix="react-select"
                          value={currencyList.find(
                            (x) => x.value === field.value
                          )}
                          onChange={(option) => {
                            field.onChange(option.value);
                            setValue("currency_name", option.currency_name);
                            setValue("currency_code", option.currency_code);
                          }}
                        />
                      )}
                    />
                  </div>
                  {errors.pay_currency && (
                    <small className="text-danger">
                      {errors.pay_currency.message}
                    </small>
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 mb-3">
                <Table
                  columns={columns}
                  dataSource={payroll}
                  pagination={false}
                  rowKey="employee_id"
                  bordered
                  size="small"
                  className="table-bordered"
                  style={{
                    width: "100%",
                  }}
                  scroll={{ x: true }}
                  locale={{
                    emptyText: "No employees found.",
                  }}
                />
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {midMonthPayroll
                  ? loading
                    ? "Updating..."
                    : "Update"
                  : loading
                    ? "Creating..."
                    : "Create"}
                {loading && (
                  <span
                    style={{
                      height: "15px",
                      width: "15px",
                    }}
                    className="spinner-border ml-2 text-light"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ManageMidMonthPayroll;
