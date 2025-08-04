import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect from "react-select";
import CollapseHeader from "../../../components/common/collapse-header.js";
import Table from "../../../components/common/dataTableNew";
import usePermissions from "../../../components/common/Permissions.js";
import UnauthorizedImage from "../../../components/common/UnAuthorized.js";
import DateRangePickerComponent from "../../../components/datatable/DateRangePickerComponent.js";
import { fetchApprovalReports } from "../../../redux/ApprovalReports";
import { requestTypeOptions } from "../../crm-settings/settings/ApprovalSetup/ManageApprovalSetup";
import EmployeeSelect from "../../../components/common/EmployeeSelect/index.js";
const statusOptions = [
  { label: "Pending", value: "P" },
  { label: "Approved", value: "A" },
  { label: "Rejected", value: "R" },
];
const ApprovalReports = () => {
  const [searchValue, setSearchValue] = useState("");
  const [paginationData, setPaginationData] = useState({});
  const [requestType, setRequestType] = useState({});
  const [approverId, setApproverId] = useState({});
  const [status, setStatus] = useState("");

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(365, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { approvalReports, loading } = useSelector(
    (state) => state.approvalReports || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchApprovalReports({
        search: searchValue,
        ...selectedDateRange,
        request_type: requestType,
        approver_id: approverId,
        status: status,
      })
    );
  }, [
    dispatch,
    searchValue,
    selectedDateRange,
    requestType,
    approverId,
    status,
  ]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: approvalReports?.currentPage,
      totalPage: approvalReports?.totalPages,
      totalCount: approvalReports?.totalCount,
      pageSize: approvalReports?.size,
    });
  }, [approvalReports]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchApprovalReports({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
        request_type: requestType,
        approver_id: approverId,
        status: status,
      })
    );
  };

  const data = approvalReports?.data;

  const { isView } = usePermissions("Approval Reports");

  const columns = [
    {
      title: "Approver Name",
      key: "approver_name",
      render: (text, record) =>
        record?.request_approval_approver?.full_name || "-",
      sorter: (a, b) =>
        (a?.request_approval_approver?.full_name || "").localeCompare(
          b?.request_approval_approver?.full_name || ""
        ),
      width: 180,
    },
    {
      title: "Employee Code",
      key: "employee_code",
      render: (text, record) =>
        record?.request_approval_approver?.employee_code || "-",
      sorter: (a, b) =>
        (a?.request_approval_approver?.employee_code || "").localeCompare(
          b?.request_approval_approver?.employee_code || ""
        ),
      width: 130,
    },
    {
      title: "Request Type",
      key: "request_type",
      render: (text, record) => {
        const requestType =
          record?.request_approval_request?.request_type || "-";
        return (
          <span className="badge bg-info text-capitalize">
            {requestType.replace(/_/g, " ")}
          </span>
        );
      },
      sorter: (a, b) =>
        (a?.request_approval_request?.request_type || "").localeCompare(
          b?.request_approval_request?.request_type || ""
        ),
      width: 150,
    },
    {
      title: "Request Description",
      key: "request_description",
      render: (text, record) => {
        const requestData = record?.request_approval_request?.request_data;
        if (!requestData) return "-";

        // If it's a string, display it directly (truncated if too long)
        if (typeof requestData === "string") {
          return requestData.length > 100 ? (
            <span title={requestData}>{requestData.substring(0, 100)}...</span>
          ) : (
            requestData
          );
        }

        // If it's an object, convert to readable format
        if (typeof requestData === "object") {
          const description = JSON.stringify(requestData, null, 2);
          return description.length > 100 ? (
            <span title={description}>{description.substring(0, 100)}...</span>
          ) : (
            description
          );
        }

        return requestData.toString();
      },
      width: 250,
    },
    {
      title: "Sequence",
      dataIndex: "sequence",
      key: "sequence",
      render: (text) => text || "-",
      sorter: (a, b) => (a.sequence || 0) - (b.sequence || 0),
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value) => (
        <div
          className={`text-capitalize badge ${
            value === "R"
              ? "bg-warning text-dark"
              : value === "A"
                ? "bg-success"
                : value === "P"
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
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
      width: 120,
    },
    {
      title: "Action Date",
      dataIndex: "action_at",
      key: "action_at",
      render: (text) => {
        if (!text) return "-";
        return (
          <div>
            <div>{moment(text).format("DD-MM-YYYY")}</div>
          </div>
        );
      },
      sorter: (a, b) => {
        if (!a.action_at && !b.action_at) return 0;
        if (!a.action_at) return 1;
        if (!b.action_at) return -1;
        return new Date(a.action_at) - new Date(b.action_at);
      },
      width: 150,
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
      render: (text) => {
        if (!text) return "-";
        return text.length > 50 ? (
          <span title={text}>{text.substring(0, 50)}...</span>
        ) : (
          text
        );
      },
      width: 200,
    },
    {
      title: "Created Date",
      dataIndex: "createdate",
      key: "createdate",
      render: (text) => {
        if (!text) return "-";
        return (
          <div>
            <div>{moment(text).format("DD-MM-YYYY")}</div>
          </div>
        );
      },
      sorter: (a, b) => new Date(a.createdate) - new Date(b.createdate),
      width: 150,
    },
    {
      title: "Updated Date",
      dataIndex: "updatedate",
      key: "updatedate",
      render: (text) => {
        if (!text) return "-";
        return (
          <div>
            <div>{moment(text).format("DD-MM-YYYY")}</div>
          </div>
        );
      },
      sorter: (a, b) => {
        if (!a.updatedate && !b.updatedate) return 0;
        if (!a.updatedate) return 1;
        if (!b.updatedate) return -1;
        return new Date(a.updatedate) - new Date(b.updatedate);
      },
      width: 150,
    },

    // // Actions column (conditional based on permissions)
    // ...(isUpdate || isDelete
    //   ? [
    //       {
    //         title: "Actions",
    //         key: "actions",
    //         fixed: "right",
    //         width: 120,
    //         render: (text, record) => (
    //           <div className="dropdown table-action">
    //             <Link
    //               to="#"
    //               className="action-icon"
    //               data-bs-toggle="dropdown"
    //               aria-expanded="false"
    //             >
    //               <i className="fa fa-ellipsis-v"></i>
    //             </Link>
    //             <div className="dropdown-menu dropdown-menu-right">
    //               {isUpdate && (
    //                 <>
    //                   <Link
    //                     className="dropdown-item"
    //                     to="#"
    //                     onClick={() => {
    //                       setSelected(record);
    //                       setOpen(true);
    //                     }}
    //                   >
    //                     <i className="ti ti-settings text-blue"></i>
    //                     {record.status === "P"
    //                       ? "Approve/Reject"
    //                       : record.status === "R"
    //                         ? "Pending/Approve"
    //                         : record.status === "A"
    //                           ? "Reject/Pending"
    //                           : "Manage Status"}
    //                   </Link>
    //                   <Link
    //                     className="dropdown-item"
    //                     to="#"
    //                     onClick={() => {
    //                       setSelected(record);
    //                       setIsOpen(true);
    //                     }}
    //                   >
    //                     <i className="ti ti-edit text-blue"></i> Edit
    //                   </Link>
    //                 </>
    //               )}
    //               {isDelete && (
    //                 <Link
    //                   className="dropdown-item"
    //                   to="#"
    //                   onClick={() => handleDeleteApprovalReports(record)}
    //                 >
    //                   <i className="ti ti-trash text-danger"></i> Delete
    //                 </Link>
    //               )}
    //               <div className="dropdown-divider"></div>
    //               <Link
    //                 className="dropdown-item"
    //                 to="#"
    //                 onClick={() => {
    //                   console.log("View Details:", record);
    //                 }}
    //               >
    //                 <i className="ti ti-eye text-info"></i> View Details
    //               </Link>
    //             </div>
    //           </div>
    //         ),
    //       },
    //     ]
    //   : []),
  ];

  console.log("requestType", approverId);

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
                      Approval Reports
                      <span className="count-title">
                        {approvalReports?.totalCount}
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
                          placeholder="Search Approval Reports"
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
                        <div className="col-md-3">
                          <ReactSelect
                            options={[
                              ...[{ value: "", label: "All" }],
                              ...requestTypeOptions,
                            ]}
                            value={requestType?.value}
                            classNamePrefix="react-select"
                            onChange={(e) => setRequestType(e.value)}
                            placeholder="Select Request Type"
                          />
                        </div>
                        <div className="col-md-4">
                          <EmployeeSelect
                            value={approverId}
                            onChange={(e) => setApproverId(e.value)}
                            placeholder="All Employee"
                          />
                        </div>
                        <div className="col-md-4">
                          <ReactSelect
                            options={[
                              ...[{ value: "", label: "All" }],
                              ...statusOptions,
                            ]}
                            value={status?.value}
                            classNamePrefix="react-select"
                            onChange={(e) => setStatus(e.value)}
                            placeholder="Select Status"
                          />
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-end px-3 flex-wrap row-gap-2 col-md-4">
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
    </>
  );
};

export default ApprovalReports;
