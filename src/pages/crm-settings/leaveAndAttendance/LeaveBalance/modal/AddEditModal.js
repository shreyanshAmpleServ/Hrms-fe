import { Select as AntdSelect, Button, Table } from "antd";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import EmployeeSelect from "../../../../../components/common/EmployeeSelect";
import { fetchEmployee } from "../../../../../redux/Employee";
import {
  createLeaveBalance,
  fetchLeaveBalanceById,
  updateLeaveBalance,
} from "../../../../../redux/leaveBalance";
import { fetchLeaveType } from "../../../../../redux/LeaveType";

const initialLeaveBalance = [
  {
    leave_type_id: "",
    no_of_leaves: 0,
    used_leaves: 0,
    balance: 0,
    leave_type_name: "",
  },
];

const AddEditModal = ({
  mode = "add",
  initialData = null,
  setSelected,
  setMode,
}) => {
  const [leaveBalanceData, setLeaveBalanceData] = useState([]);
  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);
  const dispatch = useDispatch();

  const { loading, leaveBalanceDetail } = useSelector(
    (state) => state.leaveBalance
  );

  const { leaveType } = useSelector((state) => state.leaveType);

  useEffect(() => {
    dispatch(fetchLeaveType());
    if (mode === "edit" && initialData) {
      dispatch(fetchLeaveBalanceById(initialData.id));
    }
  }, [mode, initialData]);

  const leaveTypeList = useMemo(() => {
    const usedLeaveTypeIds = leaveBalanceData.map((item) => item.leave_type_id);
    return (
      leaveType?.data
        ?.filter((item) => !usedLeaveTypeIds.includes(item.id))
        .map((item) => ({
          value: item.id,
          label: item.leave_type,
        })) || []
    );
  }, [leaveType, leaveBalanceData]);

  useEffect(() => {
    if (mode === "edit") {
      if (leaveBalanceDetail?.data?.leaveBalances) {
        setLeaveBalanceData(
          leaveBalanceDetail?.data?.leaveBalances?.map((item) => ({
            ...item,
            used_leaves: Number(item.used_leaves),
            balance: Number(item.balance),
            no_of_leaves: Number(item.no_of_leaves),
          })) || []
        );
      }
    } else if (mode === "add") {
      setLeaveBalanceData(
        leaveType?.data?.map((item) => ({
          leave_type_id: item.id,
          no_of_leaves: item.leave_qty,
          used_leaves: 0,
          balance: item.leave_qty,
          leave_type_name: item.leave_type,
        })) || []
      );
    }
  }, [leaveBalanceDetail?.data?.leaveBalances, mode]);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    register,
    setValue,
  } = useForm();

  useEffect(() => {
    dispatch(fetchEmployee({ status: "Active", size: 5000 }));
  }, []);

  const employee = useSelector((state) => state.employee.employee);

  const handleAddLeaveBalance = () => {
    setLeaveBalanceData([...leaveBalanceData, initialLeaveBalance]);
  };

  const handleChangeLeaveBalance = (leave_type_id, field, value) => {
    const newData = leaveBalanceData.map((item) => {
      if ((item.leave_type_id || value) === Number(leave_type_id)) {
        let updatedItem = { ...item };

        switch (field) {
          case "no_of_leaves":
            updatedItem.no_of_leaves = Number(value);
            updatedItem.balance =
              updatedItem.no_of_leaves - (updatedItem.used_leaves || 0);
            break;

          case "used_leaves":
            updatedItem.used_leaves = Number(value);
            updatedItem.balance =
              (updatedItem.no_of_leaves || 0) - updatedItem.used_leaves;
            break;

          case "balance":
            updatedItem.balance = Number(value);
            updatedItem.used_leaves =
              (updatedItem.no_of_leaves || 0) - updatedItem.balance;
            break;

          case "leave_type_id":
            updatedItem.leave_type_id = Number(value);
            break;

          default:
            updatedItem[field] = Number(value);
        }
        return updatedItem;
      }
      return item;
    });

    setLeaveBalanceData(newData);
  };

  const columns = [
    {
      title: "Leave Type",
      dataIndex: "leave_type_name",
      render: (_, record) => (
        <AntdSelect
          options={leaveTypeList}
          placeholder="Choose Leave Type"
          style={{ width: "100%" }}
          onChange={(value) => {
            handleChangeLeaveBalance(value, "leave_type_id", value || "");
          }}
          value={
            leaveType?.data?.find(
              (option) => Number(option.id) === Number(record.leave_type_id)
            )?.leave_type || ""
          }
        />
      ),
      width: "30%",
    },

    {
      title: "Total Leave",
      dataIndex: "no_of_leaves",
      render: (_, record) => (
        <input
          type="number"
          style={{ height: "32px" }}
          max={365}
          className="form-control form-control-sm"
          value={record.no_of_leaves}
          min={0}
          onChange={(e) => {
            if (e.target.value <= 365) {
              handleChangeLeaveBalance(
                record.leave_type_id,
                "no_of_leaves",
                e.target.value
              );
            }
          }}
        />
      ),
      width: "20%",
    },
    {
      title: "Leave Taken",
      render: (_, record) => (
        <input
          type="number"
          style={{ height: "32px" }}
          className="form-control form-control-sm"
          value={record.used_leaves}
          min={0}
          max={record.no_of_leaves}
          onChange={(e) => {
            if (e.target.value <= record.no_of_leaves) {
              handleChangeLeaveBalance(
                record.leave_type_id,
                "used_leaves",
                e.target.value
              );
            }
          }}
        />
      ),
      width: "20%",
    },
    {
      title: "Leave Balance",
      dataIndex: "balance",
      render: (_, record) => (
        <input
          type="number"
          disabled
          style={{ height: "32px" }}
          className="form-control form-control-sm"
          value={record.balance}
        />
      ),
      width: "20%",
    },
    {
      title: "Actions",
      width: "10%",
      dataIndex: "actions",
      render: (_, record) => (
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => {
            const newData = leaveBalanceData.filter((item) => {
              return item.leave_type_id !== record.leave_type_id;
            });
            setLeaveBalanceData(newData);
          }}
        >
          <i className="ti ti-trash"></i>
        </button>
      ),
    },
  ];
  const empId = watch("employee_id");

  useEffect(() => {
    if (empId) {
      const found = employee?.data?.find((item) => item.id === Number(empId));
      setSelectedEmployeeData(found || null);
      if (found?.join_date) {
        const joinDate = moment(found.join_date);
        const currentYear = moment().year();
        const isJoinedThisYear = joinDate.year() === currentYear;
        const startDate = isJoinedThisYear
          ? joinDate.toDate()
          : moment().startOf("year").toDate();
        const endDate = moment().endOf("year").toDate();
        setValue("start_date", startDate.toISOString());
        setValue("end_date", endDate.toISOString());
      }
    } else {
      setSelectedEmployeeData(null);
    }
  }, [empId, employee]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        employee_id: initialData.employee_id || "",
        start_date: initialData.start_date || new Date().toISOString(),
        end_date: initialData.end_date || new Date().toISOString(),
        status: initialData.status || "Y",
      });
    } else {
      reset({
        employee_id: "",
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        status: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const handleClose = () => {
    const c = document.getElementById("close_btn_add_edit_leave_balance");
    reset();
    setSelected(null);
    setLeaveBalanceData([]);
    setMode("");
    c?.click();
  };

  console.log("mode", mode);
  const onSubmit = async (data) => {
    let response = null;
    try {
      if (mode === "add") {
        response = await dispatch(
          createLeaveBalance({
            employee_id: data.employee_id,
            employee_code: selectedEmployeeData?.employee_code,
            first_name: selectedEmployeeData?.first_name || "",
            last_name: selectedEmployeeData?.last_name || "",
            start_date: data.start_date,
            end_date: data.end_date,
            status: data.status,
            leave_balances: leaveBalanceData.map((item) => ({
              leave_type_id: item.leave_type_id,
              no_of_leaves: item.no_of_leaves,
              used_leaves: String(item.used_leaves),
              balance: item.balance,
              leave_type_name: item.leave_type_name,
            })),
          })
        );
      } else if (mode === "edit" && initialData) {
        response = await dispatch(
          updateLeaveBalance({
            id: initialData.id,
            reqData: {
              employee_id: data.employee_id,
              employee_code: selectedEmployeeData?.employee_code,
              first_name: selectedEmployeeData?.first_name || "",
              last_name: selectedEmployeeData?.last_name || "",
              start_date: data.start_date,
              end_date: data.end_date,
              status: data.status,
              leave_balances: leaveBalanceData.map((item) => ({
                leave_type_id: item.leave_type_id,
                no_of_leaves: item.no_of_leaves,
                used_leaves: String(item.used_leaves),
                balance: item.balance,
                leave_type_name: item.leave_type_name,
              })),
            },
          })
        );
      }
      if (response?.meta?.requestStatus === "fulfilled") {
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const el = document.getElementById("offcanvas_add_edit_leave_balance");
    if (el) {
      el.addEventListener("hidden.bs.offcanvas", handleClose);
      return () => {
        el.removeEventListener("hidden.bs.offcanvas", handleClose);
      };
    }
  }, [handleClose]);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      id="offcanvas_add_edit_leave_balance"
      tabIndex={-1}
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">
          {mode === "add" ? "Add  Leave Balance" : "Edit Leave Balance"}
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          id="close_btn_add_edit_leave_balance"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className="mb-3">
            <Col md={6}>
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
                    onChange={(value) => field.onChange(value?.value)}
                    value={field.value}
                  />
                )}
              />
              {errors.employee_id && (
                <small className="text-danger">
                  {errors.employee_id.message}
                </small>
              )}
            </Col>
            {/* <Col md={6}>
              <label className="col-form-label">
                Status
                <span className="text-danger"> *</span>
              </label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => {
                  const selectedStatus = statusOptions?.find(
                    (status) => status.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      className="select"
                      options={statusOptions}
                      placeholder="Select Status"
                      classNamePrefix="react-select"
                      value={selectedStatus || null}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption.value)
                      }
                    />
                  );
                }}
              />
              {errors.status && (
                <small className="text-danger">{errors.status.message}</small>
              )}
            </Col> */}
            <Col md={6}>
              <label className="col-form-label">
                Start Date<span className="text-danger"> *</span>
              </label>
              <div className="icon-form">
                <span className="form-icon">
                  <i className="ti ti-calendar-check" />
                </span>
                <Controller
                  name="start_date"
                  control={control}
                  rules={{ required: "Start date is required!" }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      className="form-control"
                      placeholderText="Select Start Date"
                      selected={field.value}
                      value={
                        field.value
                          ? moment(field.value).format("DD-MM-YYYY")
                          : ""
                      }
                      onChange={field.onChange}
                      maxDate={watch("end_date")}
                    />
                  )}
                />
              </div>
              {errors.start_date && (
                <small className="text-danger">
                  {errors.start_date.message}
                </small>
              )}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <label className="col-form-label">
                End Date<span className="text-danger"> *</span>
              </label>
              <div className="icon-form">
                <span className="form-icon">
                  <i className="ti ti-calendar-check" />
                </span>
                <Controller
                  name="end_date"
                  control={control}
                  rules={{ required: "End date is required!" }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      className="form-control"
                      placeholderText="Select End Date"
                      selected={field.value}
                      value={
                        field.value
                          ? moment(field.value).format("DD-MM-YYYY")
                          : ""
                      }
                      onChange={field.onChange}
                      minDate={watch("start_date")}
                    />
                  )}
                />
              </div>
              {errors.end_date && (
                <small className="text-danger">{errors.end_date.message}</small>
              )}
            </Col>
          </Row>
          {/* Status */}
          <Row className="mb-3">
            <Col md={6}>
              <label className="col-form-label">Status</label>
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <input
                    type="radio"
                    className="status-radio"
                    id="active"
                    value="Y"
                    {...register("status")}
                  />
                  <label htmlFor="active">Active</label>
                </div>
                <div>
                  <input
                    type="radio"
                    className="status-radio"
                    id="inactive"
                    value="N"
                    {...register("status")}
                  />
                  <label htmlFor="inactive">Inactive</label>
                </div>
              </div>
            </Col>
          </Row>
          <div className="table-responsive mb-3 custom-table">
            <Table
              dataSource={leaveBalanceData || []}
              columns={columns}
              loading={loading}
              className="mkx"
              pagination={false}
            />
            <div
              className="d-flex justify-content-start"
              style={{ padding: "5px 10px" }}
            >
              <Button
                type="button"
                className="btn btn-primary"
                onClick={handleAddLeaveBalance}
                icon={<i className="ti ti-square-rounded-plus" />}
              >
                New Row
              </Button>
            </div>
          </div>

          <div className="d-flex offcanvas-footer align-items-center justify-content-end">
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              className="btn btn-light me-2"
              id="close_btn_add_edit_leave_balance"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === "add" ? "Create" : "Update"}
              {loading && (
                <div
                  style={{
                    height: "15px",
                    width: "15px",
                  }}
                  className="spinner-border ml-2 text-light"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
      <style>
        {`
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .mkx .ant-table-cell {
            padding: 10px !important;
          }
        `}
      </style>
    </div>
  );
};

export default AddEditModal;
