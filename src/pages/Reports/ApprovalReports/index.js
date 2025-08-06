import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect from "react-select";
import CollapseHeader from "../../../components/common/collapse-header.js";
import Table from "../../../components/common/dataTableNew";
import EmployeeSelect from "../../../components/common/EmployeeSelect/index.js";
import usePermissions from "../../../components/common/Permissions.js";
import UnauthorizedImage from "../../../components/common/UnAuthorized.js";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent.js";
import {
  getAllRequests,
  takeActionOnRequest,
} from "../../../redux/Request/index.js";
import { requestTypeOptions } from "../../crm-settings/settings/ApprovalSetup/ManageApprovalSetup";
import { Link } from "react-router-dom";
import Confirmation from "../../../components/common/Approvals/Confirmation/index.js";
const statusOptions = [
  { label: "Pending", value: "P" },
  { label: "Approved", value: "A" },
  { label: "Rejected", value: "R" },
];
const ApprovalReports = () => {
  const [searchValue, setSearchValue] = useState("");
  const [paginationData, setPaginationData] = useState({});
  const [requestType, setRequestType] = useState({});
  const [requesterId, setRequesterId] = useState({});
  const [status, setStatus] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");
  const [open, setOpen] = useState(false);

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(365, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { requests, loading } = useSelector((state) => state.request);

  React.useEffect(() => {
    dispatch(
      getAllRequests({
        search: searchValue,
        ...selectedDateRange,
        request_type: requestType,
        requester_id: requesterId,
        status: status,
      })
    );
  }, [
    dispatch,
    searchValue,
    selectedDateRange,
    requestType,
    requesterId,
    status,
  ]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: requests?.currentPage,
      totalPage: requests?.totalPages,
      totalCount: requests?.totalCount,
      pageSize: requests?.size,
    });
  }, [requests]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      getAllRequests({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
        request_type: requestType,
        requester_id: requesterId,
        status: status,
      })
    );
  };

  const data = requests?.data;

  const { isView } = usePermissions("Approval Reports");

  const safeSorter = (a, b, getValue) => {
    const aValue = getValue(a) || "";
    const bValue = getValue(b) || "";
    return aValue.localeCompare(bValue);
  };

  const columns = [
    {
      title: "Employee Name",
      key: "employee_name",
      render: (text, record) => record?.requests_employee?.full_name || "-",
      sorter: (a, b) =>
        safeSorter(a, b, (record) => record?.requests_employee?.full_name),
      width: 180,
    },
    {
      title: "Employee Code",
      key: "employee_code",
      render: (text, record) => record?.requests_employee?.employee_code || "-",
      sorter: (a, b) =>
        safeSorter(a, b, (record) => record?.requests_employee?.employee_code),
      width: 130,
    },
    {
      title: "Request Type",
      key: "request_type",
      render: (text, record) => {
        const requestType = record?.request_type || "-";
        return (
          <span className="text-capitalize">
            {requestType.replace(/_/g, " ")}
          </span>
        );
      },
      sorter: (a, b) => safeSorter(a, b, (record) => record?.request_type),
    },
    {
      title: "Overall Status",
      dataIndex: "status",
      key: "status",
      render: (value) => (
        <div
          className={`text-capitalize badge ${
            value === "P"
              ? "bg-warning text-dark"
              : value === "A"
                ? "bg-success"
                : value === "R"
                  ? "bg-danger"
                  : "bg-secondary"
          }`}
        >
          {value === "P"
            ? "Pending"
            : value === "A"
              ? "Approved"
              : value === "R"
                ? "Rejected"
                : value || "Unknown"}
        </div>
      ),
      sorter: (a, b) => safeSorter(a, b, (record) => record?.status),
    },
    {
      title: "Current Approver",
      key: "current_approver",
      render: (text, record) => {
        const approvers = record?.request_approval_request || [];
        const pendingApprover = [...approvers]
          .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
          .find((approver) => approver.status === "P");

        if (!pendingApprover) return "-";

        return (
          <div>
            <div className="fw-semibold">
              {pendingApprover.request_approval_approver?.full_name} (
              {pendingApprover.request_approval_approver?.employee_code})
            </div>
          </div>
        );
      },
    },
    {
      title: "Applied Date",
      dataIndex: "createdate",
      key: "createdate",
      render: (text) => {
        if (!text) return "-";
        return (
          <>
            <div>{moment(text).format("DD-MM-YYYY")}</div>
          </>
        );
      },
      sorter: (a, b) => {
        if (!a.createdate && !b.createdate) return 0;
        if (!a.createdate) return 1;
        if (!b.createdate) return -1;
        return new Date(a.createdate) - new Date(b.createdate);
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (text, record) => {
        return (
          <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
            {record?.status === "P" ? (
              <>
                <button
                  className="btn btn-sm btn-success rounded"
                  style={{ width: "80px" }}
                  onClick={() => {
                    setOpen(record);
                    setApprovalStatus("A");
                  }}
                >
                  Approve
                </button>
                <button
                  className="btn btn-sm btn-danger rounded"
                  style={{ width: "80px" }}
                  onClick={() => {
                    setOpen(record);
                    setApprovalStatus("R");
                  }}
                >
                  Reject
                </button>
              </>
            ) : (
              <p className="text-center">--</p>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Approval Reports</title>
        <meta
          name="approval-reports"
          content="This is approval reports page of DCC HRMS."
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
                      Approvals
                      <span className="count-title">
                        {requests?.totalCount}
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
                          placeholder="Search Approvals"
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* {isCreate && (
                      <div className="col-sm-8">
                        <div className="text-sm-end">
                          <Link
                            to="#"
                            className="btn btn-primary"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvas_add"
                          >
                            <i className="ti ti-square-rounded-plus me-2" />
                            Create
                          </Link>
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>

                <div className="card-body">
                  <>
                    {/* Filter */}
                    <div className="d-flex align-items-center justify-content-between mb-4 row-gap-2">
                      <div className="d-flex col-md-8 gap-2 align-items-center">
                        <div className="col-md-4">
                          <ReactSelect
                            options={[
                              ...[{ value: "", label: "All" }],
                              ...requestTypeOptions,
                            ]}
                            value={requestType?.value}
                            classNamePrefix="react-select"
                            onChange={(e) => setRequestType(e.value)}
                            placeholder="Request Type"
                          />
                        </div>
                        <div className="col-md-4">
                          <EmployeeSelect
                            value={requesterId}
                            onChange={(e) => setRequesterId(e.value)}
                            placeholder="All"
                          />
                        </div>
                        <div className="col-md-3">
                          <ReactSelect
                            options={[
                              ...[{ value: "", label: "All" }],
                              ...statusOptions,
                            ]}
                            value={status?.value}
                            classNamePrefix="react-select"
                            onChange={(e) => setStatus(e.value)}
                            placeholder="Status"
                          />
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-end flex-wrap row-gap-2 col-md-">
                        <DateRangePickerComponent
                          selectedDateRange={selectedDateRange}
                          setSelectedDateRange={setSelectedDateRange}
                        />
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
                        style={{ textWrap: "nowrap" }}
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
      </div>
      <Confirmation
        open={open}
        setOpen={setOpen}
        setStatus={setApprovalStatus}
        status={approvalStatus}
      />
    </>
  );
};

export default ApprovalReports;
