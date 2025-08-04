import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header";
import Table from "../../components/common/dataTableNew/index";
import usePermissions from "../../components/common/Permissions.js";
import SearchBar from "../../components/datatable/SearchBar";
import SortDropdown from "../../components/datatable/SortDropDown";
import {
  deleteleave_application,
  fetchleave_application,
} from "../../redux/leaveApplication";
import DeleteAlert from "./alert/DeleteAlert";
import ManageStatus from "./ManageStatus";
import AddEditModal from "./modal/AddEditModal";

const LeaveApplications = () => {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState("add");
  const [selected, setSelected] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [paginationData, setPaginationData] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("ascending");

  const { isView, isCreate, isUpdate, isDelete } =
    usePermissions("Leave Applications");

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Employee",
      dataIndex: "leave_employee",
      render: (value) => <div>{value?.full_name}</div>,
      sorter: (a, b) =>
        (a.leave_employee?.full_name || "").localeCompare(
          b.leave_employee?.full_name || ""
        ),
    },
    {
      title: "Leave Type",
      dataIndex: "leave_types",
      render: (value) => <div>{value?.leave_type}</div>,
      sorter: (a, b) =>
        (a.leave_types?.leave_type || "").localeCompare(
          b.leave_types?.leave_type || ""
        ),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,
      sorter: (a, b) => new Date(a.start_date) - new Date(b.start_date),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,
      sorter: (a, b) => new Date(a.end_date) - new Date(b.end_date),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (text) => <div>{text || "—"}</div>,
      sorter: (a, b) => (a.reason || "").localeCompare(b.reason || ""),
    },
    {
      title: "Attachment",
      dataIndex: "document_attachment",
      render: (_text, record) =>
        record.document_attachment ? (
          <a
            href={record.document_attachment}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="d-inline-flex align-items-center gap-2 text-decoration-none"
            title="View or Download PDF"
          >
            <i className="ti ti-file-type-pdf fs-5"></i>
            <span>View </span>
          </a>
        ) : (
          "--"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <div
          className={`text-capitalize badge ${value === "P" ? "bg-warning" : value === "A" ? "bg-success" : "bg-danger"}`}
        >
          {value === "P"
            ? "Pending"
            : value === "A"
              ? "Approved"
              : value === "R"
                ? "Rejected"
                : "—"}
        </div>
      ),
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
    },
    {
      title: "Approval Date",
      dataIndex: "approval_date",
      render: (text) =>
        text ? <div>{moment(text).format("DD-MM-YYYY")}</div> : "-",
      sorter: (a, b) =>
        new Date(a.approval_date || 0) - new Date(b.approval_date || 0),
    },

    {
      title: "Approver",
      dataIndex: "leave_approver",
      render: (value) => <div>{value?.full_name || "-"}</div>,
    },

    {
      title: "Rejection Reason",
      dataIndex: "rejection_reason",
      render: (text) => text || "--",
      sorter: (a, b) =>
        (a.rejection_reason || "").localeCompare(b.rejection_reason || ""),
    },

    {
      title: "Backup Person",
      dataIndex: "leave_backup_person_id",
      render: (value) => <div>{value?.full_name || "--"}</div>,
    },
    {
      title: "Contact During Leave",
      dataIndex: "contact_details_during_leave",
      render: (text) => <div>{text || "-"}</div>,
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
                      {record.status === "Pending"
                        ? "Approve/Reject"
                        : record.status === "Rejected"
                          ? "Pending/Approve"
                          : record.status === "Approved"
                            ? "Reject/Pending"
                            : "Manage Status"}
                    </Link>
                  )}
                  {isUpdate && (
                    <Link
                      className="dropdown-item edit-popup"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#add_edit_leave_application_modal"
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
                      onClick={() => handleDelete(record)}
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

  const { leave_application, loading } = useSelector(
    (state) => state.leave_Applications
  );
  React.useEffect(() => {
    dispatch(fetchleave_application({ search: searchText }));
  }, [dispatch, searchText]);
  React.useEffect(() => {
    setPaginationData({
      currentPage: leave_application?.currentPage,
      totalPage: leave_application?.totalPages,
      totalCount: leave_application?.totalCount,
      pageSize: leave_application?.size,
    });
  }, [leave_application]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchleave_application({
        search: searchText,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = leave_application?.data || [];

    if (sortOrder === "ascending") {
      data = [...data].sort((a, b) =>
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? -1 : 1
      );
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) =>
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? 1 : -1
      );
    }
    return data;
  }, [searchText, leave_application, columns, sortOrder]);

  const handleDelete = (record) => {
    setSelected(record);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selected) {
      dispatch(deleteleave_application(selected.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Leave Applications </title>
        <meta
          name="DepanrtmentList"
          content="This is leave_application page of DCC HRMS."
        />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Leave Applications
                    <span className="count-title">
                      {leave_application?.totalCount || 0}
                    </span>
                  </h4>
                </div>
                <div className="col-4 text-end">
                  <div className="head-icons">
                    <CollapseHeader />
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-sm-9">
                    <div className="icon-form mb-sm-6">
                      <SearchBar
                        searchText={searchText}
                        handleSearch={handleSearch}
                        label="Search Leave Applications"
                      />
                    </div>
                  </div>

                  <div className="col-sm-3 text-end">
                    {isCreate && (
                      <Link
                        className="btn btn-primary"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#add_edit_leave_application_modal"
                        onClick={() => setMode("add")}
                        style={{ width: "100px" }}
                      >
                        <i className="ti ti-square-rounded-plus me-2" />
                        Create
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    <SortDropdown
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                    />
                  </div>
                </div>

                <div className="table-responsive custom-table">
                  <Table
                    dataSource={filteredData}
                    columns={columns}
                    loading={loading}
                    isView={isView}
                    paginationData={paginationData}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEditModal mode={mode} initialData={selected} />
      <DeleteAlert
        label="Leave Application"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
      <ManageStatus selected={selected} open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeaveApplications;
