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
import { fetchMidMonthPayroll } from "../../redux/MidMonthPayroll/index.js";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManageMidMonthPayroll from "./ManageMidMonthPayroll/index.js";

const MidMonthPayroll = () => {
  const [selected, setSelected] = React.useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedMidMonthPayroll, setSelectedMidMonthPayroll] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(365, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { midMonthPayroll, loading } = useSelector(
    (state) => state.midMonthPayroll || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchMidMonthPayroll({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: midMonthPayroll?.currentPage,
      totalPage: midMonthPayroll?.totalPages,
      totalCount: midMonthPayroll?.totalCount,
      pageSize: midMonthPayroll?.size,
    });
  }, [midMonthPayroll]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchMidMonthPayroll({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = midMonthPayroll?.data;

  const { isView, isCreate, isUpdate, isDelete } =
    usePermissions("Mid Month Payroll");

  const columns = [
    {
      title: "Employee",
      dataIndex: "midmonth_payroll_processing_employee",
      render: (text) => text?.full_name || "-",
      sorter: (a, b) =>
        a.midmonth_payroll_processing_employee?.full_name?.localeCompare(
          b.midmonth_payroll_processing_employee?.full_name || ""
        ),
    },
    {
      title: "Employee Email",
      dataIndex: "employee_email",
      render: (text) => text || "-",
      sorter: (a, b) => a.employee_email?.localeCompare(b.employee_email || ""),
    },
    {
      title: "Payroll Month",
      dataIndex: "payroll_month",
      render: (text) => <p className="text-capitalize">{text}</p> || "-",
      sorter: (a, b) => a.payroll_month - b.payroll_month,
    },
    {
      title: "Payroll Week",
      dataIndex: "payroll_week",
      render: (text) => <p className="text-capitalize">{text}</p> || "-",
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
      title: "Net Pay",
      dataIndex: "net_pay",
      render: (text) => text || "-",
      sorter: (a, b) => Number(a.net_pay) - Number(b.net_pay),
    },
    {
      title: "Pay Currency",
      dataIndex: "pay_currency",
      render: (text) => text || "-",
      sorter: (a, b) => a.pay_currency?.localeCompare(b.pay_currency || ""),
    },
    {
      title: "Project",
      dataIndex: "midmonth_payroll_processing_project",
      render: (text) => text?.name || "-",
      sorter: (a, b) =>
        a.midmonth_payroll_processing_project?.name?.localeCompare(
          b.midmonth_payroll_processing_project?.name || ""
        ),
    },
    {
      title: "Cost Center 1",
      dataIndex: "midmonth_payroll_processing_center1",
      render: (text) => text?.name || "-",
      sorter: (a, b) =>
        a.midmonth_payroll_processing_center1?.name?.localeCompare(
          b.midmonth_payroll_processing_center1?.name || ""
        ),
    },
    {
      title: "Cost Center 2",
      dataIndex: "midmonth_payroll_processing_center2",
      render: (text) => text?.name || "-",
      sorter: (a, b) =>
        a.midmonth_payroll_processing_center2?.name?.localeCompare(
          b.midmonth_payroll_processing_center2?.name || ""
        ),
    },
    {
      title: "Cost Center 3",
      dataIndex: "midmonth_payroll_processing_center3",
      render: (text) => text?.name || "-",
      sorter: (a, b) =>
        a.midmonth_payroll_processing_center3?.name?.localeCompare(
          b.midmonth_payroll_processing_center3?.name || ""
        ),
    },
    {
      title: "Cost Center 4",
      dataIndex: "midmonth_payroll_processing_center4",
      render: (text) => text?.name || "-",
      sorter: (a, b) =>
        a.midmonth_payroll_processing_center4?.name?.localeCompare(
          b.midmonth_payroll_processing_center4?.name || ""
        ),
    },
    {
      title: "Cost Center 5",
      dataIndex: "midmonth_payroll_processing_center5",
      render: (text) => text?.name || "-",
      sorter: (a, b) =>
        a.midmonth_payroll_processing_center5?.name?.localeCompare(
          b.midmonth_payroll_processing_center5?.name || ""
        ),
    },
    {
      title: "Component",
      dataIndex: "midmonth_payroll_processing_component",
      render: (text) => text?.component_name || "-",
      sorter: (a, b) =>
        a.midmonth_payroll_processing_component?.component_name?.localeCompare(
          b.midmonth_payroll_processing_component?.component_name || ""
        ),
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
      title: "Execution Date",
      dataIndex: "execution_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) => moment(a.execution_date).diff(moment(b.execution_date)),
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
                      onClick={() => handleDeleteMidMonthPayroll(record)}
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

  const handleDeleteMidMonthPayroll = (midMonthPayroll) => {
    setSelectedMidMonthPayroll(midMonthPayroll);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Mid Month Payroll</title>
        <meta
          name="mid-month-payroll"
          content="This is mid month payroll page of DCC HRMS."
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
                      Mid Month Payroll
                      <span className="count-title">
                        {midMonthPayroll?.totalCount}
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
                          placeholder="Search Mid Month Payroll"
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
                            Add Mid Month Payroll
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
        <ManageMidMonthPayroll
          setMidMonthPayroll={setSelected}
          midMonthPayroll={selected}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        midMonthPayrollId={selectedMidMonthPayroll?.id}
      />
    </>
  );
};

export default MidMonthPayroll;
