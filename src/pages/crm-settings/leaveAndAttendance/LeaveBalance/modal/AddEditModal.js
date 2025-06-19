import { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../../../redux/Employee";

import moment from "moment";
import DatePicker from "react-datepicker";
import { RiDeleteBin5Line } from "react-icons/ri";

import { Button, Table } from "antd";
import {
  createLeaveBalance,
  updateLeaveBalance,
  fetchLeaveBalanceByEmployee,
} from "../../../../../redux/leaveBalance";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const [leaveBalanceData, setLeaveBalanceData] = useState([]);
  const { loading, leaveBalanceByEmployee } = useSelector(
    (state) => state.leaveBalance
  );

  const [selectedEmployeeData, setSelectedEmployeeData] = useState(null);

  useEffect(() => {
    if (leaveBalanceByEmployee) {
      setLeaveBalanceData(leaveBalanceByEmployee || []);
    }
  }, [leaveBalanceByEmployee]);

  console.log(leaveBalanceData);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchEmployee());
    if (watch("employee_id")) {
      dispatch(
        fetchLeaveBalanceByEmployee({ employeeId: watch("employee_id") })
      );
    }
  }, [dispatch, watch("employee_id")]);

  const employee = useSelector((state) => state.employee.employee);

  const employeeList = useMemo(
    () =>
      employee?.data?.map((item) => ({
        value: item.id,
        label: item.full_name,
        data: item,
      })) || [],
    [employee]
  );

  const statusOptions = [
    { value: "Y", label: "Active" },
    { value: "N", label: "Inactive" },
  ];

  const columns = [
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      render: (text) => text ?? "-",
    },
    {
      title: "Leave Balance",
      dataIndex: "leave_balance",
      render: (text) => text ?? "-",
    },
    {
      title: "Total Leave",
      dataIndex: "total_leave",
      render: (text) => text ?? "-",
    },
    {
      title: "Leave Taken",
      dataIndex: "leave_taken",
      render: (text) => text ?? "-",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <Button
          shape="circle"
          type="button"
          className="btn-outline-danger"
          onClick={() => {
            setLeaveBalanceData(
              leaveBalanceData.filter((item) => item.id !== record.id)
            );
          }}
        >
          <RiDeleteBin5Line fontSize={20} />
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const empId = watch("employee_id");
    if (empId) {
      const found = employee?.data?.find(
        (item) => Number(item.id) === Number(empId)
      );
      setSelectedEmployeeData(found || null);
    } else {
      setSelectedEmployeeData(null);
    }
  }, [watch, employee]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        employee_id: initialData.employee_id || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
        status: initialData.status || "Y",
      });
    } else {
      reset({
        employee_id: "",
        start_date: "",
        end_date: "",
        status: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_add_edit_leave_balance_offcanvas"
    );
    if (mode === "add") {
      dispatch(
        createLeaveBalance({
          employee_id: data.employee_id,
          employee_code: selectedEmployeeData.employee_code,
          first_name: selectedEmployeeData?.first_name || "",
          last_name: selectedEmployeeData?.last_name || "",
          start_date: data.start_date,
          end_date: data.end_date,
          status: data.status,
        })
      );
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateLeaveBalance({
          id: initialData.id,
          reqData: {
            employee_id: data.employee_id,
            employee_code: selectedEmployeeData.employee_code,
            first_name: selectedEmployeeData?.first_name || "",
            last_name: selectedEmployeeData?.last_name || "",
            start_date: data.start_date,
            end_date: data.end_date,
            status: data.status,
          },
        })
      );
    }
    reset();
    setSelected(null);
    closeButton.click();
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById(
      "offcanvas_add_edit_leave_balance"
    );
    if (offcanvasElement) {
      const handleModalClose = () => {
        reset();
        setSelected(null);
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
  }, [setSelected]);

  console.log(leaveBalanceData);

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
                  <Select
                    {...field}
                    options={employeeList}
                    placeholder="Choose Employee"
                    isDisabled={!employeeList.length}
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => {
                      field.onChange(option?.value || "");
                      setSelectedEmployeeData(option?.data || null);
                    }}
                    value={employeeList.find(
                      (option) =>
                        String(option.value) === String(watch("employee_id"))
                    )}
                  />
                )}
              />
              {errors.employee_id && (
                <small className="text-danger">
                  {errors.employee_id.message}
                </small>
              )}
            </Col>
            <Col md={6}>
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
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                      }}
                    />
                  );
                }}
              />
              {errors.status && (
                <small className="text-danger">{errors.status.message}</small>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <label className="col-form-label">
                Start Date<span className="text-danger"> *</span>
              </label>
              <div className="mb-3 icon-form">
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
                          : null
                      }
                      onChange={field.onChange}
                      dateFormat="DD-MM-YYYY"
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
            <Col md={6}>
              <label className="col-form-label">
                End Date<span className="text-danger"> *</span>
              </label>
              <div className="mb-3 icon-form">
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
                          : null
                      }
                      onChange={field.onChange}
                      dateFormat="DD-MM-YYYY"
                    />
                  )}
                />
              </div>
              {errors.end_date && (
                <small className="text-danger">{errors.end_date.message}</small>
              )}
            </Col>
          </Row>

          <div className="table-responsive mb-3 custom-table">
            <Table
              dataSource={leaveBalanceData || []}
              columns={columns}
              loading={loading}
              pagination={false}
            />
          </div>

          <div className="d-flex offcanvas-footer align-items-center justify-content-end">
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              className="btn btn-light me-2"
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
    </div>
  );
};

export default AddEditModal;
