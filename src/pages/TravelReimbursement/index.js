import Table from "../../components/common/dataTableNew/index.js";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchtravelReimbursement } from "../../redux/TravelReimbursement";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManageTravelReimbursement from "./ManageTravelReimbursement";
import ManageStatus from "./ManageStatus/index.js";

const TravelReimbursement = () => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [mode, setMode] = React.useState("add"); // 'add' or 'edit'
  const [searchValue, setSearchValue] = useState("");
  const [selectedtravelReimbursement, setSelectedtravelReimbursement] =
    useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { travelReimbursement, loading } = useSelector(
    (state) => state.travelReimbursement || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchtravelReimbursement({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: travelReimbursement?.currentPage,
      totalPage: travelReimbursement?.totalPages,
      totalCount: travelReimbursement?.totalCount,
      pageSize: travelReimbursement?.size,
    });
  }, [travelReimbursement]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchtravelReimbursement({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = travelReimbursement?.data;

  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Time Sheet Entry"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "travel_expense_employee",
      render: (_text, record) =>
        record?.travel_expense_employee?.full_name || "-",
    },

    {
      title: "Travel Purpose",
      dataIndex: "travel_purpose",
      render: (text) => text || "-",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Travel Mode",
      dataIndex: "travel_mode",
      render: (text) => text || "-",
    },
    {
      title: "Advance Amount",
      dataIndex: "advance_amount",
      render: (text) => (text ? `₹${text}` : "-"),
    },
    {
      title: "Expense Breakdown",
      dataIndex: "expense_breakdown",
      render: (text) => text || "-",
    },

    {
      title: "Attachment",
      dataIndex: "attachment_path",
      render: (_text, record) => (
        <a
          href={record.attachment_path}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="d-inline-flex align-items-center gap-2 text-decoration-none"
          title="View or Download PDF"
        >
          <i className="ti ti-file-type-pdf fs-5"></i>
          <span>View </span>
        </a>
      ),
    },

    {
      title: "Currency",
      dataIndex: "travel_expense_currency",
      render: (text) =>
        text?.currency_code + " - " + text?.currency_name || "-",
    },
    {
      title: "Exchange Rate",
      dataIndex: "exchange_rate",
      render: (text) => (text ? Number(text).toFixed(2) : "-"),
    },
    {
      title: "Final Approved Amount",
      dataIndex: "final_approved_amount",
      render: (text) => (text ? `₹${text}` : "-"),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (text) => text || "-",
    },

    {
      title: "Destination",
      dataIndex: "destination",
      render: (text) => text || "-",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      render: (text) => (text ? `₹${text}` : "-"),
    },

    {
      title: "Approval Status",
      dataIndex: "approval_status",
      render: (value) => (
        <div
          className={`text-capitalize badge ${
            value === "R"
              ? "bg-danger"
              : value === "A"
                ? "bg-success"
                : value === "P"
                  ? "bg-warning"
                  : "bg-warning"
          }`}
        >
          {value === "P"
            ? "Pending"
            : value === "A"
              ? "Approved"
              : value === "R"
                ? "Rejected"
                : value || "Pending"}
        </div>
      ),
      sorter: (a, b) =>
        (a.approval_status || "").localeCompare(b.approval_status || ""),
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
                      onClick={() => handleDeletetravelReimbursement(record)}
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

  const handleDeletetravelReimbursement = (travelReimbursement) => {
    setSelectedtravelReimbursement(travelReimbursement);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS -Travel Reimbursement Claims</title>
        <meta
          name="time-sheet"
          content="This is time sheet page of DCC HRMS."
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
                      Travel Reimbursement Claims
                      <span className="count-title">
                        {travelReimbursement?.totalCount}
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
                          placeholder="Search Travel Reimbursement Claims"
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
                            Add Travel Reimbursement Claims
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
                        scroll={{ x: "max-content" }}
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
        <ManageTravelReimbursement
          settravelReimbursement={setSelected}
          travelReimbursement={selected}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        travelReimbursementId={selectedtravelReimbursement?.id}
      />
      <ManageStatus selected={selected} open={open} setOpen={setOpen} />
    </>
  );
};

export default TravelReimbursement;
