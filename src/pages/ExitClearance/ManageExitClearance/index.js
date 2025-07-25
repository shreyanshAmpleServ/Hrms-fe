import { Select as AntdSelect, Button, Skeleton } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../components/common/dataTableNew/index";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import { fetchBasicSalary } from "../../../redux/BasicSalary";
import {
  createExitClearance,
  updateExitClearance,
} from "../../../redux/ExitClearance";

const ManageExitClearance = ({ setExitClearance, exitClearance }) => {
  const [componentValues, setComponentValues] = useState([]);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.exitClearance || {});
  const { basicSalary, loading: basicSalaryLoading } = useSelector(
    (state) => state.basicSalary
  );

  const components =
    basicSalary?.data?.[0]?.hrms_d_employee_pay_component_assignment_line;

  const payComponentList = useMemo(() => {
    const idList = componentValues.map((item) => item.pay_component_id);
    return (
      components
        ?.filter((comp) => !idList.includes(comp.pay_component_id))
        ?.map((component) => ({
          value: component.pay_component_id,
          label: component?.pay_component_for_line?.component_name,
          amount: component.amount,
          component_code: component?.pay_component_for_line?.component_code,
          pay_or_deduct: component?.pay_component_for_line?.pay_or_deduct,
        })) || []
    );
  }, [components, componentValues]);

  const handleChangeComponentValues = useCallback(
    (rowIndex, field, value) => {
      setComponentValues((prevData) =>
        prevData.map((item, index) => {
          if (index !== rowIndex) return item;

          let updated = { ...item };

          if (["amount", "no_of_days", "pay_component_id"].includes(field)) {
            updated[field] = Number(value) || 0;
            if (field === "no_of_days") {
              updated.amount = item.per_day * updated.no_of_days;
            }
          } else {
            updated[field] = value;
          }

          if (field === "pay_component_id") {
            const selectedComponent = components?.find(
              (comp) => comp.pay_component_id === Number(value)
            );

            if (selectedComponent) {
              Object.assign(updated, {
                component_name:
                  selectedComponent?.pay_component_for_line?.component_name,
                component_code:
                  selectedComponent?.pay_component_for_line?.component_code,
                amount: selectedComponent.amount,
                payment_or_deduction:
                  selectedComponent?.pay_component_for_line?.pay_or_deduct,
                no_of_days: 1,
              });
            }
          }

          return updated;
        })
      );
    },
    [components, componentValues]
  );

  useEffect(() => {
    if (exitClearance) {
      reset({
        employee_id: exitClearance?.exit_clearance_employee?.id || "",
        cleared_by: exitClearance?.cleared_by || "",
        remarks: exitClearance?.remarks || "",
        clearance_date:
          exitClearance?.clearance_date || new Date().toISOString(),
        start_date: exitClearance?.start_date || new Date().toISOString(),
        reason: exitClearance?.reason || "",
        employee_name:
          exitClearance?.exit_clearance_employee?.employee_name || "",
      });

      if (
        exitClearance.hrms_d_exit_clearance1 &&
        exitClearance.hrms_d_exit_clearance1?.length > 0
      ) {
        const mappedChildren = exitClearance.hrms_d_exit_clearance1.map(
          (child) => ({
            id: child.id || "",
            pay_component_id: child.pay_component_id || "",
            payment_or_deduction: child.payment_or_deduction || "P",
            no_of_days: child.no_of_days || 1,
            amount: child.amount || 0,
            per_day: child.amount / child.no_of_days || 0,
            remarks: child.remarks || "",
            component_name: child.exit_clearance_pay?.component_name || "",
            component_code: child.exit_clearance_pay?.component_code || "",
          })
        );
        setComponentValues(mappedChildren);
      }
    } else {
      reset({
        employee_id: "",
        cleared_by: "",
        remarks: "",
        clearance_date: new Date().toISOString(),
        start_date: new Date().toISOString(),
        reason: "",
        employee_name: "",
      });
      setComponentValues([]);
    }
  }, [exitClearance, reset]);

  const handleAddRow = useCallback(() => {
    const newRow = {
      pay_component_id: "",
      payment_or_deduction: "P",
      no_of_days: 1,
      per_day: 0,
      amount: 0,
      remarks: "",
      component_name: "",
      component_code: "",
    };
    setComponentValues((prev) => [...prev, newRow]);
  }, []);

  const handleRemoveRow = useCallback((rowIndex) => {
    setComponentValues((prev) => prev.filter((_, index) => index !== rowIndex));
  }, []);

  useEffect(() => {
    if (watch("employee_id")) {
      dispatch(fetchBasicSalary({ employee_id: watch("employee_id") }));
    } else {
      setComponentValues([]);
    }
  }, [watch("employee_id")]);

  const checkEmployeeId = useCallback(() => {
    if (basicSalary && basicSalary?.data?.length === 0) {
      toast.error("No components assigned to this employee.");
      setComponentValues([]);
    }
  }, [basicSalary]);

  useEffect(() => {
    checkEmployeeId();
  }, [basicSalary]);

  useEffect(() => {
    if (basicSalary?.data?.length > 0) {
      if (components && components.length > 0 && !exitClearance) {
        const allComponents = components.map((component) => ({
          pay_component_id: component.pay_component_id,
          payment_or_deduction:
            component?.pay_component_for_line?.pay_or_deduct || "P",
          no_of_days: 1,
          amount: component.amount / 30 || 0,
          per_day: component.amount / 30 || 0,
          remarks: "",
          component_name:
            component?.pay_component_for_line?.component_name || "",
          component_code:
            component?.pay_component_for_line?.component_code || "",
        }));
        setComponentValues(allComponents);
      }
    }
  }, [components, basicSalary, exitClearance]);

  const columns = useMemo(
    () => [
      {
        title: "Pay Component",
        dataIndex: "component_name",
        key: "component_name",
        render: (text, record, index) => {
          const currentComponentOption = payComponentList.find(
            (option) => option.value === record.pay_component_id
          );

          const availableOptions = currentComponentOption
            ? [currentComponentOption]
            : payComponentList;

          return (
            <AntdSelect
              options={availableOptions}
              style={{ width: 200 }}
              value={text || undefined}
              placeholder="Select Component"
              onChange={(value) =>
                handleChangeComponentValues(index, "pay_component_id", value)
              }
              showSearch
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
              optionLabelProp="label"
            />
          );
        },
        width: 200,
      },
      {
        title: "Pay/Deduct",
        dataIndex: "payment_or_deduction",
        render: (_, record, index) => (
          <AntdSelect
            style={{ width: 100 }}
            value={record?.payment_or_deduction || "P"}
            options={[
              { value: "P", label: "Pay" },
              { value: "D", label: "Deduct" },
            ]}
            onChange={(value) =>
              handleChangeComponentValues(index, "payment_or_deduction", value)
            }
          />
        ),
        width: 100,
      },
      {
        title: "No of Days",
        dataIndex: "no_of_days",
        render: (_, record, index) => (
          <input
            type="number"
            className="form-control form-control-sm"
            value={record?.no_of_days || 0}
            onChange={(e) =>
              handleChangeComponentValues(index, "no_of_days", e.target.value)
            }
            min="0"
            step="1"
          />
        ),
        width: 120,
      },
      {
        title: "Amount",
        dataIndex: "amount",
        render: (_, record, index) => (
          <input
            type="number"
            style={{ width: "150px" }}
            className="form-control form-control-sm"
            value={Number(record?.amount).toFixed(2) || 0}
            onChange={(e) =>
              handleChangeComponentValues(index, "amount", e.target.value)
            }
            min="0"
            step="0.01"
          />
        ),
        width: 150,
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        render: (_, record, index) => (
          <input
            type="text"
            style={{ width: "200px" }}
            placeholder="Remarks"
            className="form-control form-control-sm"
            value={record?.remarks || ""}
            onChange={(e) =>
              handleChangeComponentValues(index, "remarks", e.target.value)
            }
            maxLength="255"
          />
        ),
        width: 200,
      },
      {
        title: "Action",
        width: 80,
        dataIndex: "actions",
        render: (_, record, index) => (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => handleRemoveRow(index)}
          >
            <i className="ti ti-trash"></i>
          </button>
        ),
      },
    ],
    [
      payComponentList,
      componentValues?.length,
      handleChangeComponentValues,
      handleRemoveRow,
    ]
  );

  const validateComponentValues = () => {
    for (let i = 0; i < componentValues?.length; i++) {
      const item = componentValues[i];

      if (!item.pay_component_id) {
        toast.error(`Pay Component is required for row ${i + 1}.`);
        return false;
      }

      if (Number(item.no_of_days) <= 0) {
        toast.error(`No of Days should be greater than 0 for row ${i + 1}.`);
        return false;
      }

      if (Number(item.amount) <= 0) {
        toast.error(`Amount should be greater than 0 for row ${i + 1}.`);
        return false;
      }
    }
    return true;
  };

  // Form submission
  const onSubmit = async (data) => {
    try {
      if (!validateComponentValues()) return;

      const payload = {
        ...data,
        children: componentValues,
      };

      if (exitClearance) {
        await dispatch(
          updateExitClearance({
            id: exitClearance.id,
            exitClearanceData: payload,
          })
        ).unwrap();
      } else {
        await dispatch(createExitClearance(payload)).unwrap();
      }
      handleClose();
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };

  // Close handler
  const handleClose = useCallback(() => {
    setExitClearance(null);
    setComponentValues([]);
    reset();
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    if (closeButton) closeButton.click();
  }, [setExitClearance, exitClearance, reset]);

  useEffect(() => {
    const el = document.getElementById("offcanvas_add");
    if (el) {
      el.addEventListener("hidden.bs.offcanvas", handleClose);
      return () => {
        el.removeEventListener("hidden.bs.offcanvas", handleClose);
      };
    }
  }, [handleClose]);

  console.log(componentValues);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-larger"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{exitClearance ? "Update" : "Add"} Exit Clearance</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={handleClose}
        >
          <i className="ti ti-x" />
        </button>
      </div>

      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="col-form-label">
                  Employee <span className="text-danger">*</span>
                </label>
                <Controller
                  name="employee_id"
                  control={control}
                  rules={{ required: "Employee is required" }}
                  render={({ field }) => (
                    <EmployeeSelect
                      {...field}
                      value={field.value}
                      onChange={(i) => field.onChange(i?.value)}
                    />
                  )}
                />
                {errors.employee_id && (
                  <small className="text-danger">
                    {errors.employee_id.message}
                  </small>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <label className="col-form-label">
                Clearance Date <span className="text-danger">*</span>
              </label>
              <div className="mb-3 icon-form">
                <span className="form-icon">
                  <i className="ti ti-calendar-check" />
                </span>
                <Controller
                  name="clearance_date"
                  control={control}
                  rules={{ required: "Clearance date is required!" }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      className="form-control"
                      value={
                        field.value
                          ? moment(field.value).format("DD-MM-YYYY")
                          : null
                      }
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              {errors.clearance_date && (
                <small className="text-danger">
                  {errors.clearance_date.message}
                </small>
              )}
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="col-form-label">
                  Cleared By <span className="text-danger">*</span>
                </label>
                <Controller
                  name="cleared_by"
                  control={control}
                  rules={{ required: "Cleared By is required" }}
                  render={({ field }) => (
                    <EmployeeSelect
                      {...field}
                      value={field.value}
                      onChange={(i) => field.onChange(i?.value)}
                    />
                  )}
                />
                {errors.cleared_by && (
                  <small className="text-danger">
                    {errors.cleared_by.message}
                  </small>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <label className="col-form-label">
                  Reason{" "}
                  <small className="text-muted">(Max 255 characters)</small>
                </label>
                <div className="mb-3">
                  <Controller
                    name="reason"
                    control={control}
                    rules={{
                      maxLength: {
                        value: 255,
                        message:
                          "Reason must be less than or equal to 255 characters",
                      },
                    }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        maxLength={255}
                        className="form-control"
                        placeholder="Enter Reason"
                      />
                    )}
                  />
                  {errors.reason && (
                    <small className="text-danger">
                      {errors.reason.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label className="col-form-label">
                  Remarks{" "}
                  <small className="text-muted">(Max 255 characters)</small>
                </label>
                <div className="mb-3">
                  <Controller
                    name="remarks"
                    control={control}
                    rules={{
                      maxLength: {
                        value: 255,
                        message:
                          "Remarks must be less than or equal to 255 characters",
                      },
                    }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        maxLength={255}
                        className="form-control"
                        placeholder="Enter Remarks"
                      />
                    )}
                  />
                  {errors.remarks && (
                    <small className="text-danger">
                      {errors.remarks.message}
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleAddRow}
              icon={<i className="ti ti-square-rounded-plus me-1" />}
              disabled={
                !components || componentValues.length >= components.length
              }
            >
              Add New Row
            </Button>
            <small className="text-muted">
              Total Rows: {componentValues?.length} / {components?.length || 0}
            </small>
          </div>

          <div className="col-md-12 mb-3">
            {basicSalaryLoading ? (
              <div className="d-flex gap-1 justify-content-center">
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} active paragraph={{ rows: 4 }} />
                  ))}
                </div>
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={componentValues}
                pagination={false}
                rowKey={(record, index) => `row-${index}`}
                className="custom-table"
                size="small"
              />
            )}
          </div>

          <div className="d-flex align-items-center justify-content-end">
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              onClick={handleClose}
              className="btn btn-light me-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {exitClearance
                ? loading
                  ? "Updating..."
                  : "Update"
                : loading
                  ? "Creating..."
                  : "Create"}
              {loading && (
                <div
                  style={{ height: "15px", width: "15px" }}
                  className="spinner-border ms-2 text-light"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        .custom-table .ant-table-cell {
          padding: 8px 12px !important;
        }
        .custom-table .ant-table-thead > tr > th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        .react-select__control {
          min-height: 38px;
          border-color: #ced4da;
        }
        .react-select__control:hover {
          border-color: #86b7fe;
        }
        .react-select__control--is-focused {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        .offcanvas-larger {
          width: 80% !important;
          max-width: 1200px;
        }
        @media (max-width: 768px) {
          .offcanvas-larger {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageExitClearance;
