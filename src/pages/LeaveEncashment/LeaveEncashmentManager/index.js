import React, { useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect from "react-select";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import { fetchBasicSalary } from "../../../redux/BasicSalary";
import { fetchLeaveBalanceByEmployeeId } from "../../../redux/leaveBalance";
import { createLeaveEncashment } from "../../../redux/LeaveEncashment";
import { fetchLeaveType } from "../../../redux/LeaveType";

const statusOptions = [
  { label: "Pending", value: "P" },
  { label: "Rejected", value: "R" },
  { label: "Approved", value: "A" },
];

const LeaveEncashmentManager = ({ open, setOpen }) => {
  const [amount, setAmount] = React.useState(0);
  const [leaveDetail, setLeaveDetail] = React.useState(0);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { basicSalary, loading: basicSalaryLoading } = useSelector(
    (state) => state.basicSalary
  );

  const components =
    basicSalary?.data?.[0]?.hrms_d_employee_pay_component_assignment_line;

  const componentsOptions = components
    ?.filter((component) => component?.pay_component_for_line?.is_basic === "Y")
    ?.map((component) => {
      return {
        value: component.pay_component_for_line?.id,
        label: component?.pay_component_for_line?.component_name,
        amount: component.amount,
      };
    });

  const { leaveBalanceByEmployeeId, loading: leaveBalanceLoading } =
    useSelector((state) => state.leaveBalance);

  const { loading } = useSelector((state) => state.leaveEncashment || {});

  const leaveType = leaveBalanceByEmployeeId?.data?.leaveBalances;

  useEffect(() => {
    if (leaveDetail) {
      setValue("leave_days", leaveDetail?.balance);
    }
  }, [leaveDetail]);

  const leaveTypeList =
    useMemo(
      () =>
        leaveType?.map((item) => ({
          value: item.leave_balance_details_LeaveType?.id,
          label: item.leave_balance_details_LeaveType?.leave_type,
          record: item,
        })) || []
    ) || [];

  useEffect(() => {
    reset({
      applied_date: new Date(),
      status: "P",
      employee_id: "",
      leave_type_id: "",
      leave_days: 0,
      component_id: "",
      amount: 0,
    });
  }, []);

  useEffect(() => {
    if (watch("employee_id")) {
      dispatch(
        fetchLeaveBalanceByEmployeeId({ employeeId: watch("employee_id") })
      );
      dispatch(fetchBasicSalary({ employee_id: watch("employee_id") }));
    }
  }, [watch("employee_id")]);

  const handleClose = () => {
    reset();
    setOpen(false);
    setAmount(0);
    setLeaveDetail(null);
  };

  const onSubmit = async (data) => {
    if (!data.employee_id) {
      toast.error("Employee is required");
      return;
    }
    if (!data.component_id) {
      toast.error("Basic Salary is required");
      return;
    }
    if (!data.leave_type_id) {
      toast.error("Leave Type is required");
      return;
    }
    if (!data.leave_days || Number(data.leave_days) <= 0) {
      toast.error("Leave Days must be greater than 0");
      return;
    }
    if (!data.applied_date) {
      toast.error("Applied Date is required");
      return;
    }

    const requestBody = {
      employee_id: data.employee_id,
      leave_type_id: data.leave_type_id,
      leave_days: data.leave_days,
      encashment_date: data.applied_date,
      encashment_amount: ((amount / 30) * data.leave_days).toFixed(2),
      approval_status: data.status,
    };
    try {
      await dispatch(createLeaveEncashment(requestBody)).unwrap();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const requested = 0;
  const approved = 0;

  const balanceBF = leaveDetail?.carried_forward || 0;
  const entitled = leaveDetail?.no_of_leaves || 0;
  const totalAvailable = balanceBF + entitled || 0;
  const used = leaveDetail?.used_leaves || 0;
  const balance = totalAvailable - used - approved || 0;

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
        zIndex: 9999,
      }}
    >
      <div className="modal-dialog modal modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Leave Encashment Manager</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => handleClose()}
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
                        render={({ field }) => (
                          <ReactSelect
                            classNamePrefix="react-select"
                            value={componentsOptions?.find(
                              (i) => i?.value === field?.value
                            )}
                            onChange={(e) => {
                              field.onChange(e?.value);
                              setAmount(e?.amount);
                            }}
                            isLoading={basicSalaryLoading}
                            placeholder="-- Select --"
                            options={[
                              { label: "-- Select --", value: "" },
                              ...(componentsOptions || []),
                            ]}
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
                        render={({ field }) => (
                          <ReactSelect
                            classNamePrefix="react-select"
                            value={leaveTypeList?.find(
                              (i) => i.value === field.value
                            )}
                            onChange={(e) => {
                              field.onChange(e.value);
                              setLeaveDetail(e?.record);
                            }}
                            isLoading={leaveBalanceLoading}
                            placeholder="-- Select --"
                            options={[
                              { label: "-- Select --", value: "" },
                              ...(leaveTypeList || []),
                            ]}
                            styles={selectStyles}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <label className="col-4 col-form-label small">
                      Leave Days:
                    </label>
                    <div className="col-7">
                      <Controller
                        name="leave_days"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="text"
                            className={inputClass}
                            value={field.value}
                            onChange={(e) => {
                              if (e.target.value <= leaveDetail?.balance) {
                                field.onChange(e.target.value);
                              } else {
                                toast.error(
                                  "Leave Days cannot be greater than Leave Balance"
                                );
                              }
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <label className="col-4 col-form-label small">
                      Amount:
                    </label>
                    <div className="col-7">
                      <input
                        type="text"
                        className={inputClass}
                        value={Number(amount || 0)?.toFixed(2) || 0}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="row mb-2">
                    <label className="col-4 col-form-label small">Total:</label>
                    <div className="col-7">
                      <input
                        type="text"
                        className={inputClass}
                        value={(
                          (amount / 30) * watch("leave_days") || 0
                        )?.toFixed(2)}
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
                    ["Balance B/F", balanceBF],
                    ["Entitled", entitled],
                    ["Total Available", totalAvailable],
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
                    ["Used", used],
                    ["Requested", requested],
                    ["Approved", approved],
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
                        value={balance || "0"}
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
                onClick={() => handleClose()}
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
