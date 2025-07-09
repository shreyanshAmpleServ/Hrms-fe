import { Table } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import ComponentSelect from "../../../components/common/ComponentSelect";
import SharedSelect from "../../../components/common/SharedSelect";
import SharedDatePicker from "../../../components/common/SharedDatePicker";
import { fetchCurrencies } from "../../../redux/currency";
import { employeeOptionsFn } from "../../../redux/Employee";
import {
  createMidMonthPayroll,
  fetchMidMonthPayroll,
} from "../../../redux/MidMonthPayroll";

export const DEFAULT_PAYROLL_MONTH = new Date().getMonth() + 1;
export const DEFAULT_PAYROLL_WEEK = 1;
export const DEFAULT_PAYROLL_YEAR = new Date().getFullYear();

export const payrollMonthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(0, i).toLocaleString("default", { month: "long" }),
}));
export const payrollWeekOptions = Array.from({ length: 4 }, (_, i) => ({
  value: i + 1,
  label: `Week ${i + 1}`,
}));

const ManageMidMonthPayroll = ({ midMonthPayroll }) => {
  const [payroll, setPayroll] = useState([]);
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const { loading } = useSelector((s) => s.midMonthPayroll || {});
  const { currencies } = useSelector((s) => s.currencies);
  const { employeeOptions } = useSelector((s) => s.employee);

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
  const getCurrencyNameById = (id) => {
    const c = currencyList.find((c) => String(c.value) === String(id));
    return c ? `${c.currency_name} (${c.currency_code})` : "";
  };
  const getCurrencyCodeById = (id) => {
    const c = currencyList.find((c) => String(c.value) === String(id));
    return c ? `${c.currency_code} (${c.currency_name})` : "";
  };

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchCurrencies({ is_active: true }));
    dispatch(employeeOptionsFn());
  }, [dispatch]);

  // Set payroll list when employee options or currency changes
  useEffect(() => {
    if (employeeOptions) {
      const pay_currency = watch("pay_currency") || "";
      setPayroll(
        employeeOptions.map((item) => ({
          employee_id: item.value,
          employee_name: item.label,
          net_pay: 0,
          pay_currency,
          processed: "N",
          is_selected: false,
          employee_email: item?.meta?.email || "",
          currency_name: getCurrencyNameById(pay_currency),
          currency_code: getCurrencyCodeById(pay_currency),
        }))
      );
    }
    // eslint-disable-next-line
  }, [employeeOptions, currencyList]);

  // Update payroll currency if global currency changes
  useEffect(() => {
    setPayroll((prev) =>
      prev.map((item) => ({
        ...item,
        pay_currency: watch("pay_currency") || "",
        currency_name: getCurrencyNameById(watch("pay_currency")) || "",
        currency_code: getCurrencyCodeById(watch("pay_currency")) || "",
      }))
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

  // Handlers
  const handleSelectAll = useCallback((e) => {
    setPayroll((prev) =>
      prev.map((item) => ({ ...item, is_selected: e.target.checked }))
    );
  }, []);

  const handleChangeComponent = useCallback((e, a) => {
    setPayroll((prev) =>
      prev.map((item) =>
        item.employee_id === a.employee_id
          ? { ...item, is_selected: e.target.checked }
          : item
      )
    );
  }, []);
  const handleNetPayChange = useCallback((value, idx) => {
    setPayroll((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, net_pay: value } : item))
    );
  }, []);
  const handleEmployeeCurrencyChange = useCallback(
    (currencyValue, idx) => {
      setPayroll((prev) =>
        prev.map((item, i) =>
          i === idx
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
    [currencyList]
  );

  // Prepare selected employees for submission
  const selectedEmployees = useMemo(
    () =>
      payroll
        .filter((item) => item.is_selected)
        .map((item) => {
          const pay_currency = item.pay_currency || watch("pay_currency");
          return {
            ...item,
            payroll_month: watch("payroll_month"),
            payroll_week: watch("payroll_week"),
            payroll_year: watch("payroll_year"),
            pay_date: watch("pay_date")
              ? new Date(watch("pay_date")).toISOString()
              : "",
            pay_currency,
            currency_name: getCurrencyNameById(pay_currency),
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
            component_id: watch("component_id"),
          };
        }),
    [payroll, watch, currencyList]
  );

  // Table columns
  const columns = [
    {
      title: (
        <div className="d-flex align-items-center gap-2">
          <input
            type="checkbox"
            className="form-check-input"
            style={{ width: 20, height: 20 }}
            checked={payroll.every((r) => r.is_selected)}
            onChange={(e) => handleSelectAll(e)}
          />
        </div>
      ),
      dataIndex: "component_id",
      render: (_, r) => (
        <input
          type="checkbox"
          className="form-check-input"
          style={{ width: 20, height: 20 }}
          checked={r.is_selected}
          onChange={(e) => handleChangeComponent(e, r)}
          aria-label={`Select component ${r.component_id}`}
        />
      ),
      width: 80,
    },
    {
      title: "Employee ID",
      dataIndex: "employee_id",
      render: (text, a) => (
        <div className="d-flex align-items-center gap-3">
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
      render: (_, r) => (
        <div className={`badge bg-${r.is_selected ? "success" : "danger"}`}>
          {r.is_selected ? "Yes" : "No"}
        </div>
      ),
    },
    {
      title: "Pay Currency",
      dataIndex: "pay_currency",
      render: (text, r, i) =>
        r.is_selected ? (
          <div style={{ minWidth: 150, maxWidth: 250 }}>
            <Select
              inputId={`pay_currency_row_${r.employee_id}`}
              className="select"
              options={currencyList}
              placeholder="Select Currency"
              classNamePrefix="react-select"
              value={
                currencyList.find(
                  (x) =>
                    String(x.value) ===
                    String(r.pay_currency || watch("pay_currency"))
                ) || null
              }
              onChange={(o) =>
                handleEmployeeCurrencyChange(o ? o.value : "", i)
              }
              isDisabled={!r.is_selected}
              styles={{
                container: (base) => ({ ...base, width: "100%" }),
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
                input: (base) => ({ ...base, margin: 0, padding: 0 }),
                indicatorsContainer: (base) => ({ ...base, height: 30 }),
              }}
            />
          </div>
        ) : (
          <p className="mb-0">
            {r.pay_currency ? getCurrencyNameById(r.pay_currency) : "-"}
          </p>
        ),
      width: 250,
    },
    {
      title: "Net Pay",
      dataIndex: "net_pay",
      render: (text, r, i) =>
        r.is_selected ? (
          <input
            type="number"
            className="form-control form-control-sm"
            value={r.net_pay || ""}
            min="0"
            onChange={(e) => handleNetPayChange(e.target.value, i)}
            aria-label={`Net pay for employee ${r.employee_id}`}
          />
        ) : (
          <p className="mb-0">{text ?? "-"}</p>
        ),
      width: 200,
    },
  ];

  // onSubmit: validate and dispatch
  const onSubmit = async () => {
    if (!selectedEmployees.length)
      return alert("Please select at least one employee and enter Net Pay.");
    if (
      selectedEmployees.some(
        (emp) => !emp.net_pay || isNaN(emp.net_pay) || Number(emp.net_pay) <= 0
      )
    )
      return alert(
        "Please enter a valid Net Pay (greater than 0) for all selected employees."
      );
    if (selectedEmployees.some((emp) => !emp.pay_currency))
      return alert("Please select a currency for all selected employees.");
    if (selectedEmployees.some((emp) => !emp.currency_name))
      return alert(
        "Currency name is missing for one or more selected employees."
      );

    const closeBtn = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      await dispatch(createMidMonthPayroll(selectedEmployees)).unwrap();
      closeBtn && closeBtn.click();
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
    } catch (e) {
      console.error("Error creating mid month payroll", e);
    }
  };

  // Reset form when offcanvas closes
  useEffect(() => {
    const el = document.getElementById("offcanvas_add");
    if (!el) return;
    const handleClose = () => {
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
    el.addEventListener("hidden.bs.offcanvas", handleClose);
    return () => el.removeEventListener("hidden.bs.offcanvas", handleClose);
  }, [reset, currencyList, watch("pay_currency")]);

  // Form field generator for Select/DatePicker
  const renderSelect = (name, options, label, required, extraProps = {}) => (
    <div className="col-md-4">
      <SharedSelect
        name={name}
        control={control}
        options={options}
        label={label}
        required={required}
        errors={errors}
        {...extraProps}
      />
    </div>
  );
  const renderDate = (name, label, required) => (
    <div className="col-md-4">
      {name === "payroll_year" ? (
        <SharedDatePicker
          name={name}
          label={label}
          control={control}
          required={required}
          errors={errors}
          showYearPicker={true}
          dateFormat="yyyy"
          onChange={(date) => setValue(name, date ? date.getFullYear() : null)}
        />
      ) : (
        <SharedDatePicker
          name={name}
          label={label}
          control={control}
          required={required}
          errors={errors}
          dateFormat="dd-MM-yyyy"
        />
      )}
    </div>
  );

  return (
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
                currency_name: getCurrencyNameById(watch("pay_currency") || ""),
                currency_code: getCurrencyCodeById(watch("pay_currency") || ""),
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
              {renderSelect(
                "payroll_week",
                payrollWeekOptions,
                "Payroll Week",
                true
              )}
              {renderSelect(
                "payroll_month",
                payrollMonthOptions,
                "Payroll Month",
                true
              )}
              {renderDate("payroll_year", "Payroll Year", true)}
              {renderDate("pay_date", "Pay Date", true)}
              {renderDate("execution_date", "Execution Date")}
              {renderDate("doc_date", "Document Date")}
              <div className="col-md-4">
                <label className="col-form-label" htmlFor="component_id">
                  Pay Component <span className="text-danger">*</span>
                </label>
                <Controller
                  name="component_id"
                  rules={{ required: "Pay Component is required!" }}
                  control={control}
                  render={({ field }) => (
                    <ComponentSelect
                      {...field}
                      is_advance={true}
                      value={field.value}
                      onChange={(i) => {
                        field.onChange(i.value);
                        setValue("component_name", i.label);
                      }}
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
                <SharedSelect
                  name="pay_currency"
                  label="Currency"
                  control={control}
                  options={currencyList}
                  errors={errors}
                  onChange={(o) => {
                    setValue("currency_name", o?.currency_name || "");
                    setValue("currency_code", o?.currency_code || "");
                  }}
                />
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
                style={{ width: "100%" }}
                scroll={{ x: true }}
                locale={{ emptyText: "No employees found." }}
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
                  style={{ height: 15, width: 15 }}
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
  );
};

export default ManageMidMonthPayroll;
