import Table from "../../components/common/dataTableNew/index.js";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchMonthlyPayroll } from "../../redux/MonthlyPayroll/index.js";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManageStatus from "./ManageStatus/index.js";
import ManageMonthlyPayroll from "./ManageMonthlyPayroll";
const MonthlyPayroll = () => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [mode, setMode] = React.useState("add");
  const [searchValue, setSearchValue] = useState("");
  const [selectedMonthlyPayroll, setSelectedMonthlyPayroll] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { monthlyPayroll, loading } = useSelector(
    (state) => state.monthlyPayroll || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchMonthlyPayroll({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: monthlyPayroll?.currentPage,
      totalPage: monthlyPayroll?.totalPages,
      totalCount: monthlyPayroll?.totalCount,
      pageSize: monthlyPayroll?.size,
    });
  }, [monthlyPayroll]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchMonthlyPayroll({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = monthlyPayroll?.data;

  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Monthly Payroll Processing"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const columns = [
    {
      title: "Employee",
      dataIndex: "hrms_monthly_payroll_employee",
      render: (text) => text?.full_name || "-",
    },
    {
      title: "Payroll Month",
      dataIndex: "payroll_month",
      render: (text) => moment(text).format("MMM YYYY") || "-",
    },
    {
      title: "Basic Salary",
      dataIndex: "basic_salary",
      render: (text) => text || "-",
    },
    {
      title: "Total Earnings",
      dataIndex: "total_earnings",
      render: (text) => text || "-",
    },
    {
      title: "Total Deductions",
      dataIndex: "total_deductions",
      render: (text) => text || "-",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (text) => <p className="text-capitalize">{text}</p> || "-",
    // },
    {
      title: "Processed On",
      dataIndex: "processed_on",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (text) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <div
          className={`text-capitalize badge ${
            value === "P"
              ? "bg-warning"
              : value === "A"
                ? "bg-success"
                : value === "PA"
                  ? "bg-info"
                  : value === "H"
                    ? "bg-dark"
                    : value === "C"
                      ? "bg-primary"
                      : "bg-secondary"
          }`}
        >
          {value === "P"
            ? "Processing"
            : value === "A"
              ? "Approved"
              : value === "PA"
                ? "Paid"
                : value === "H"
                  ? "Hold"
                  : value === "C"
                    ? "Completed"
                    : value || "—"}
        </div>
      ),
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
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
                      onClick={() => {
                        setSelected(record);
                        setOpen(true);
                      }}
                    >
                      <i className="ti ti-settings text-blue"></i>
                      {record.status === "P"
                        ? "Approve/Reject"
                        : record.status === "R"
                          ? "Pending/Approve"
                          : record.status === "A"
                            ? "Reject/Pending"
                            : "Manage Status"}
                    </Link>
                  )}
                  {isUpdate && (
                    <Link
                      className="dropdown-item edit-popup"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add"
                      onClick={() => {
                        setSelected(record);
                        setMode("edit");
                      }}
                    >
                      <i className="ti ti-edit text-blue"></i> Edit
                    </Link>
                  )}
                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteMonthlyPayroll(record)}
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

  const handleDeleteMonthlyPayroll = (monthlyPayroll) => {
    setSelectedMonthlyPayroll(monthlyPayroll);
    setShowDeleteModal(true);
  };
  const handleDelete = (record) => {
    setSelected(record);
    setShowDeleteModal(true);
  };
  return (
    <>
      <Helmet>
        <title>DCC HRMS - Monthly Payroll</title>
        <meta
          name="monthly-payroll"
          content="This is monthly payroll page of DCC HRMS."
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
                      Monthly Payroll
                      <span className="count-title">
                        {monthlyPayroll?.totalCount}
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
                          placeholder="Search Monthly Payroll"
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
                            style={{ width: "100px" }}
                          >
                            <i className="ti ti-square-rounded-plus me-2" />
                            Create
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
                        scroll={{ x: "max-content" }}
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
        <ManageMonthlyPayroll
          setMonthlyPayroll={setSelected}
          monthlyPayroll={selected}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        monthlyPayrollId={selectedMonthlyPayroll?.id}
      />
      <ManageStatus selected={selected} open={open} setOpen={setOpen} />
    </>
  );
};

export default MonthlyPayroll;
