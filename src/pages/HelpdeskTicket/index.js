import Table from "../../components/common/dataTableNew/index.js";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchHelpdeskTicket } from "../../redux/HelpdeskTicket/index.js";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManageHelpdeskTicket from "./ManageHelpdeskTicket/index.js";
import ManageStatus from "./ManageStatus/index.js";

const HelpdeskTicket = () => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [mode, setMode] = React.useState("add"); // 'add' or 'edit'
  const [searchValue, setSearchValue] = useState("");
  const [selectedHelpdeskTicket, setSelectedHelpdeskTicket] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { helpdeskTicket, loading } = useSelector(
    (state) => state.helpdeskTicket || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchHelpdeskTicket({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: helpdeskTicket?.currentPage,
      totalPage: helpdeskTicket?.totalPages,
      totalCount: helpdeskTicket?.totalCount,
      pageSize: helpdeskTicket?.size,
    });
  }, [helpdeskTicket]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchHelpdeskTicket({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = helpdeskTicket?.data;

  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Helpdesk Ticket"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "helpdesk_employee",
      render: (text) => text?.full_name || "-",
    },
    {
      title: "Ticket Type",
      dataIndex: "ticket_type",
      render: (text) => <p className="text-capitalize">{text}</p> || "-",
    },
    {
      title: "Ticket Subject",
      dataIndex: "ticket_subject",
      render: (text) => <p className="text-capitalize">{text}</p> || "-",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (text) => <p className="text-capitalize">{text}</p> || "-",
    },
    {
      title: "Submitted On",
      dataIndex: "submitted_on",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },

    {
      title: "Assigned To",
      dataIndex: "helpdesk_assign_to",
      render: (text) => text?.full_name || "-",
    },

    {
      title: "Approval Status",
      dataIndex: "status",
      render: (value) => (
        <div
          className={`text-capitalize badge ${
            value === "P"
              ? "bg-warning"
              : value === "O"
                ? "bg-primary"
                : value === "In"
                  ? "bg-info"
                  : value === "R"
                    ? "bg-success"
                    : value === "C"
                      ? "bg-dark"
                      : "bg-secondary"
          }`}
        >
          {value === "P"
            ? "Pending"
            : value === "O"
              ? "Open"
              : value === "In"
                ? "In Progress"
                : value === "R"
                  ? "Resolved"
                  : value === "C"
                    ? "Closed"
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
                      {record.approval_status === "P"
                        ? "Approve/Reject"
                        : record.approval_status === "R"
                          ? "Pending/Approve"
                          : record.approval_status === "A"
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
                      onClick={() => handleDeleteHelpdeskTicket(record)}
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

  const handleDeleteHelpdeskTicket = (helpdeskTicket) => {
    setSelectedHelpdeskTicket(helpdeskTicket);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Helpdesk Ticket</title>
        <meta
          name="helpdesk-ticket"
          content="This is helpdesk ticket page of DCC HRMS."
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
                      Helpdesk Ticket
                      <span className="count-title">
                        {helpdeskTicket?.totalCount}
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
                          placeholder="Search Helpdesk Ticket"
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
        <ManageHelpdeskTicket
          setHelpdeskTicket={setSelected}
          helpdeskTicket={selected}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        helpdeskTicketId={selectedHelpdeskTicket?.id}
      />
      <ManageStatus selected={selected} open={open} setOpen={setOpen} />
    </>
  );
};

export default HelpdeskTicket;
