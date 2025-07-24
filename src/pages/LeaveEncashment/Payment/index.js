import React, { useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { employeeOptionsFn } from "../../../redux/Employee";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import { fetchBasicSalary } from "../../../redux/BasicSalary";
import ReactSelect from "react-select";
import { fetchLeaveBalanceByEmployee } from "../../../redux/leaveBalance";
import { fetchLeaveType } from "../../../redux/LeaveType";
import { createLeaveEncashment } from "../../../redux/LeaveEncashment";

const statusOptions = [
  { label: "Pending", value: "P" },
  { label: "Rejected", value: "R" },
  { label: "Approved", value: "A" },
];

const LeaveEncashmentManager = ({ open, setOpen }) => {
  const [amount, setAmount] = React.useState(0);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { basicSalary, loading: basicSalaryLoading } = useSelector(
    (state) => state.basicSalary
  );
  const components =
    basicSalary?.data?.[0]?.hrms_d_employee_pay_component_assignment_line;

  const componentsOptions = components?.map((component) => ({
    value: component.pay_component_for_line?.id,
    label: component?.pay_component_for_line?.component_name,
    amount: component.amount,
  }));
  useEffect(() => {
    dispatch(fetchLeaveType({ is_active: true }));
  }, [dispatch]);
  const { leaveBalanceByEmployee } = useSelector((state) => state.leaveBalance);
  const { loading } = useSelector((state) => state.leaveEncashment || {});

  const leaveBalance = leaveBalanceByEmployee?.data?.leave_balance;

  const leaveType = useSelector((state) => state.leaveType.leaveType);
  const leaveTypeList =
    useMemo(
      () =>
        leaveType?.data?.map((item) => ({
          value: item.id,
          label: item.leave_type,
        })) || []
    ) || [];

  useEffect(() => {
    reset({
      applied_date: new Date(),
      status: "P",
      employee_id: "",
      leave_type_id: "",
      component_id: "",
      amount: "",
    });
  }, []);

  useEffect(() => {
    if (watch("employee_id") && watch("leave_type_id")) {
      dispatch(
        fetchLeaveBalanceByEmployee({
          employeeId: watch("employee_id"),
          leaveTypeId: watch("leave_type_id"),
        })
      );
    }
  }, [watch("employee_id"), watch("leave_type_id")]);

  useEffect(() => {
    if (watch("employee_id")) {
      dispatch(fetchBasicSalary({ employee_id: watch("employee_id") }));
    }
  }, [watch("employee_id")]);

  const handleClose = () => {
    reset();
    setOpen(false);
    setAmount(0);
  };

  const onSubmit = async (data) => {
    const requestBody = {
      employee_id: data.employee_id,
      leave_type_id: data.leave_type_id,
      leave_days: leaveBalance,
      encashment_date: data.applied_date,
      encashment_amount: ((amount / 30) * leaveBalance).toFixed(2),
      approval_status: data.status,
    };
    try {
      await dispatch(createLeaveEncashment(requestBody)).unwrap();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const inputClass = "form-control form-control-sm";
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "31px",
      height: "31px",
      fontSize: "14px",
      borderColor: state.isFocused ? "#80bdff" : "#ced4da",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(0, 123, 255, 0.25)"
        : null,
      "&:hover": {
        borderColor: state.isFocused ? "#80bdff" : "#adb5bd",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "31px",
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "31px",
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };
  return (
    <div
      style={{
        display: open ? "block" : "none",
        backdropFilter: "brightness(80%)",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: 999999,
      }}
    >
      <div className="modal-dialog modal modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Leave Encashment Manager</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setOpen(false)}
            ></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body px-3 py-2">
              <div className="row px-3">
                {/* Left Column */}
                <div className="col-md-6">
                  <div className="row mb-2">
                    <label className="col-4 col-form-label small">
                      Employee:
                    </label>
                    <div className="col-7">
                      <Controller
                        name="employee_id"
                        control={control}
                        rules={{ required: "Employee is required" }}
                        render={({ field }) => (
                          <EmployeeSelect
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            placeholder="-- Select --"
                            size="small"
                            styles={selectStyles}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <label className="col-4 col-form-label small">
                      Basic Salary:
                    </label>
                    <div className="col-7">
                      <Controller
                        name="component_id"
                        control={control}
                        rules={{ required: "Component is required" }}
                        render={({ field }) => (
                          <ReactSelect
                            classNamePrefix="react-select"
                            value={componentsOptions?.find(
                              (i) => i.value === field.value
                            )}
                            onChange={(e) => {
                              field.onChange(e.value);
                              setAmount(e.amount);
                            }}
                            isLoading={basicSalaryLoading}
                            placeholder="-- Select --"
                            options={componentsOptions}
                            styles={selectStyles}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <label className="col-4 col-form-label small">
                      Leave Type:
                    </label>
                    <div className="col-7">
                      <Controller
                        name="leave_type_id"
                        control={control}
                        rules={{ required: "Leave Type is required" }}
                        render={({ field }) => (
                          <ReactSelect
                            classNamePrefix="react-select"
                            value={leaveTypeList?.find(
                              (i) => i.value === field.value
                            )}
                            onChange={(e) => {
                              field.onChange(e.value);
                            }}
                            placeholder="-- Select --"
                            options={leaveTypeList}
                            styles={selectStyles}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <label className="col-4 col-form-label small">Total:</label>
                    <div className="col-7">
                      <input
                        type="text"
                        className={inputClass}
                        value={
                          leaveBalance && amount
                            ? `${amount}/30 * ${leaveBalance} = ${((amount / 30) * leaveBalance).toFixed(2) || 0}`
                            : "0"
                        }
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-md-6">
                  <div className="row mb-2">
                    <label className="col-4 col-form-label small">Status</label>
                    <div className="col-7">
                      <Controller
                        name="status"
                        control={control}
                        rules={{ required: "Status is required" }}
                        render={({ field }) => (
                          <ReactSelect
                            classNamePrefix="react-select"
                            value={statusOptions?.find(
                              (i) => i.value === field.value
                            )}
                            onChange={(e) => {
                              field.onChange(e.value);
                            }}
                            placeholder="-- Select --"
                            options={statusOptions}
                            styles={selectStyles}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="row mb-2">
                    <label className="col-4 col-form-label small">
                      Applied Date:
                    </label>
                    <div className="col-7">
                      <Controller
                        name="applied_date"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            className={inputClass}
                            selected={
                              field.value ? new Date(field.value) : null
                            }
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Absence Balance Section */}

              <p className="fw-bold fs-6">Absence Balance</p>
              <div className="row px-3">
                <div className="col-md-4">
                  {[
                    ["Balance B/F", "0.0000"],
                    ["Entitled", "0.0000"],
                    ["Total Available", "0.0000"],
                  ].map(([label, value], idx) => (
                    <div className="row mb-2" key={idx}>
                      <label className="col-4 col-form-label small">
                        {label}:
                      </label>
                      <div className="col-7">
                        <input
                          type="text"
                          className={inputClass}
                          value={value}
                          readOnly
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-md-4">
                  {[
                    ["Used", "0.0000"],
                    ["Requested", "0.0000"],
                    ["Approved", "0.0000"],
                  ].map(([label, value], idx) => (
                    <div className="row mb-2" key={idx}>
                      <label className="col-4 col-form-label small">
                        {label}:
                      </label>
                      <div className="col-7">
                        <input
                          type="text"
                          className={inputClass}
                          value={value}
                          readOnly
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="col-md-4">
                  <div className="row mb-2">
                    <label className="col-4 col-form-label small">
                      Balance:
                    </label>
                    <div className="col-7">
                      <input
                        type="text"
                        className={inputClass}
                        value="0.0000"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                style={{ width: "80px" }}
                type="submit"
                className="btn btn-warning"
                disabled={loading}
              >
                {loading ? "Loading..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveEncashmentManager;
