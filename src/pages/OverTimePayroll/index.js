import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import Table from "../../components/common/dataTableNew/index.js";
import usePermissions from "../../components/common/Permissions.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchOverTimePayroll } from "../../redux/OverTimePayroll/index.js";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManageOverTimePayroll from "./ManageOverTimePayroll/index.js";

const OverTimePayroll = () => {
  const [selected, setSelected] = React.useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedOverTimePayroll, setSelectedOverTimePayroll] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(365, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { overtimePayroll, loading } = useSelector(
    (state) => state.overtimePayroll || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchOverTimePayroll({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: overtimePayroll?.currentPage,
      totalPage: overtimePayroll?.totalPages,
      totalCount: overtimePayroll?.totalCount,
      pageSize: overtimePayroll?.size,
    });
  }, [overtimePayroll]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchOverTimePayroll({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = overtimePayroll?.data;

  const { isView, isCreate, isUpdate, isDelete } =
    usePermissions("Over Time Payroll");

  const columns = [
    {
      title: "Employee",
      dataIndex: "overtime_payroll_processing_employee",
      render: (text) => text?.full_name || "-",
      sorter: (a, b) =>
        a.overtime_payroll_processing_employee?.full_name?.localeCompare(
          b.overtime_payroll_processing_employee?.full_name || ""
        ),
    },
    {
      title: "Employee Email",
      dataIndex: "employee_email",
      render: (text) => text || "-",
      sorter: (a, b) => a.employee_email?.localeCompare(b.employee_email || ""),
    },
    {
      title: "Component",
      dataIndex: "overtime_payroll_processing_component",
      render: (text) => text?.component_name || "-",
      sorter: (a, b) =>
        a.overtime_payroll_processing_component?.component_name?.localeCompare(
          b.overtime_payroll_processing_component?.component_name || ""
        ),
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      render: (text) => (text ? text.split(".")[0] : "-"),
      sorter: (a, b) => a.start_time?.localeCompare(b.start_time || ""),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      render: (text) => (text ? text.split(".")[0] : "-"),
      sorter: (a, b) => a.end_time?.localeCompare(b.end_time || ""),
    },
    {
      title: "Calculation Basis",
      dataIndex: "calculation_basis",
      render: (text) => text || "-",
      sorter: (a, b) =>
        a.calculation_basis?.localeCompare(b.calculation_basis || ""),
    },

    {
      title: "Overtime Category",
      dataIndex: "overtime_category",
      render: (text) => text || "-",
      sorter: (a, b) =>
        a.overtime_category?.localeCompare(b.overtime_category || ""),
    },
    {
      title: "Overtime Hours",
      dataIndex: "overtime_hours",
      render: (text) => text || "-",
      sorter: (a, b) => Number(a.overtime_hours) - Number(b.overtime_hours),
    },
    {
      title: "Overtime Rate Multiplier",
      dataIndex: "overtime_rate_multiplier",
      render: (text) => text || "-",
      sorter: (a, b) =>
        Number(a.overtime_rate_multiplier) - Number(b.overtime_rate_multiplier),
    },
    {
      title: "Overtime Formula",
      dataIndex: "overtime_formula",
      render: (text) => text || "-",
      sorter: (a, b) =>
        a.overtime_formula?.localeCompare(b.overtime_formula || ""),
    },
    {
      title: "Overtime Pay",
      dataIndex: "overtime_pay",
      render: (text) => text || "-",
      sorter: (a, b) => Number(a.overtime_pay) - Number(b.overtime_pay),
    },
    {
      title: "Overtime Type",
      dataIndex: "overtime_type",
      render: (text) => text || "-",
      sorter: (a, b) => a.overtime_type?.localeCompare(b.overtime_type || ""),
    },
    {
      title: "Overtime Date",
      dataIndex: "overtime_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) => moment(a.overtime_date).diff(moment(b.overtime_date)),
    },
    {
      title: "Payroll Month",
      dataIndex: "payroll_month",
      render: (text) => <p className="text-capitalize">{text}</p> || "-",
      sorter: (a, b) => a.payroll_month - b.payroll_month,
    },

    {
      title: "Payroll Year",
      dataIndex: "payroll_year",
      render: (text) => text || "-",
    },
    {
      title: "Payroll Date",
      dataIndex: "pay_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) => moment(a.pay_date).diff(moment(b.pay_date)),
    },

    {
      title: "Pay Currency",
      dataIndex: "overtime_payroll_processing_currency",
      render: (text) => text?.currency_code || "-",
    },
    {
      title: "Net Pay",
      dataIndex: "overtime_pay",
      render: (text) => text || "-",
      sorter: (a, b) => Number(a.overtime_pay) - Number(b.overtime_pay),
    },
    {
      title: "Execution Date",
      dataIndex: "execution_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) => moment(a.execution_date).diff(moment(b.execution_date)),
    },

    {
      title: "Processed",
      dataIndex: "processed",
      render: (text) =>
        text === "Y" ? (
          <div className="badge bg-success">Yes</div>
        ) : (
          <div className="badge bg-danger">No</div>
        ),
      sorter: (a, b) => a.processed?.localeCompare(b.processed || ""),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (text) => (
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "150px",
          }}
        >
          {text || "-"}
        </span>
      ),
      sorter: (a, b) => a.remarks?.localeCompare(b.remarks || ""),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <div
          className={`text-capitalize badge ${
            value === "Pending"
              ? "bg-warning"
              : value === "Approved"
                ? "bg-success"
                : value === "Rejected"
                  ? "bg-danger"
                  : "bg-secondary"
          }`}
        >
          {value || "—"}
        </div>
      ),
      sorter: (a, b) => a.status?.localeCompare(b.status || ""),
    },
    ...(isUpdate || isDelete
      ? [
          {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
              <div className="dropdown table-action">
                <Link
                  to="#"
                  className="action-icon"
                  data-bs-toggle="dropdown"
                  aria-expanded="true"
                >
                  <i className="fa fa-ellipsis-v"></i>
                </Link>
                <div className="dropdown-menu dropdown-menu-right">
                  {isUpdate && (
                    <Link
                      className="dropdown-item edit-popup"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add"
                      onClick={() => {
                        setSelected(record);
                      }}
                    >
                      <i className="ti ti-edit text-blue"></i> Edit
                    </Link>
                  )}
                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteOverTimePayroll(record)}
                    >
                      <i className="ti ti-trash text-danger"></i> Delete
                    </Link>
                  )}
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  const handleDeleteOverTimePayroll = (overtimePayroll) => {
    setSelectedOverTimePayroll(overtimePayroll);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Over Time Payroll</title>
        <meta
          name="over-time-payroll"
          content="This is over time payroll page of DCC HRMS."
        />
      </Helmet>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-4">
                    <h4 className="page-title">
                      Over Time Payroll
                      <span className="count-title">
                        {overtimePayroll?.totalCount}
                      </span>
                    </h4>
                  </div>
                  <div className="col-8 text-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
              <div className="card">
                <div className="card-header">
                  {/* Search */}
                  <div className="row align-items-center">
                    <div className="col-sm-4">
                      <div className="icon-form mb-3 mb-sm-0">
                        <span className="form-icon">
                          <i className="ti ti-search" />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Over Time Payroll"
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                    </div>
                    {isCreate && (
                      <div className="col-sm-8">
                        <div className="text-sm-end">
                          <Link
                            to="#"
                            className="btn btn-primary"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvas_add"
                          >
                            <i className="ti ti-square-rounded-plus me-2" />
                            Add Over Time Payroll
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <>
                    {/* Filter */}
                    <div className="d-flex align-items-center justify-content-end flex-wrap mb-4 row-gap-2">
                      <div className="d-flex align-items-center flex-wrap row-gap-2">
                        <div className="mx-2">
                          <DateRangePickerComponent
                            selectedDateRange={selectedDateRange}
                            setSelectedDateRange={setSelectedDateRange}
                          />
                        </div>
                      </div>
                    </div>
                  </>

                  {isView ? (
                    <div className="table-responsive custom-table">
                      <Table
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        paginationData={paginationData}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  ) : (
                    <UnauthorizedImage />
                  )}
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="datatable-length" />
                    </div>
                    <div className="col-md-6">
                      <div className="datatable-paginate" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ManageOverTimePayroll
          setOverTimePayroll={setSelected}
          overtimePayroll={selected}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        overTimePayrollId={selectedOverTimePayroll?.id}
      />
    </>
  );
};

export default OverTimePayroll;
