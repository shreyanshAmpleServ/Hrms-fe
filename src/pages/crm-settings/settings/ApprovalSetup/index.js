import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../../components/common/collapse-header.js";
import Table from "../../../../components/common/dataTableNew";
import usePermissions from "../../../../components/common/Permissions.js";
import UnauthorizedImage from "../../../../components/common/UnAuthorized.js";
import DateRangePickerComponent from "../../../../components/datatable/DateRangePickerComponent.js";
import { fetchApprovalSetup } from "../../../../redux/ApprovalSetup";
import logger from "../../../../utils/logger.js";
import DeleteConfirmation from "./DeleteConfirmation";
import ManageApprovalSetup from "./ManageApprovalSetup";

const ApprovalSetup = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedApprovalSetup, setSelectedApprovalSetup] = useState(null);
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { approvalSetup, loading } = useSelector((i) => i.approvalSetup);

  React.useEffect(() => {
    dispatch(fetchApprovalSetup({ search: searchValue, ...selectedDateRange }));
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: approvalSetup?.currentPage,
      totalPage: approvalSetup?.totalPages,
      totalCount: approvalSetup?.totalCount,
      pageSize: approvalSetup?.size,
    });
  }, [approvalSetup]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchApprovalSetup({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = approvalSetup?.data;

  const { isView, isCreate, isUpdate, isDelete } =
    usePermissions("Approval Setup");

  const columns = [
    {
      title: "Approval Type",
      dataIndex: "request_type",
      render: (text) =>
        <span className="text-capitalize">{text?.replaceAll("_", " ")}</span> ||
        "-",
    },
    {
      title: "No of Approvers",
      dataIndex: "no_of_approvers",
      render: (text) => text || "--",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (text) =>
        text === "Y" ? (
          <span className="badge badge-success">Active</span>
        ) : (
          <span className="badge badge-danger">Inactive</span>
        ),
    },
    ...(isDelete || isUpdate
      ? [
          {
            title: "Action",
            render: (text, a) => (
              <div className="dropdown table-action">
                <Link
                  to="#"
                  className="action-icon "
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa fa-ellipsis-v"></i>
                </Link>
                <div className="dropdown-menu dropdown-menu-right">
                  {isUpdate && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add"
                      onClick={() => setSelectedApprovalSetup(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}

                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDelete(a)}
                    >
                      <i className="ti ti-trash text-danger" /> Delete
                    </Link>
                  )}
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  const handleDelete = (approvalSetup) => {
    setSelectedRequestType(approvalSetup?.request_type);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Approval Setup</title>
        <meta
          name="approval-setup"
          content="This is approval setup page of DCC HRMS."
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
                      Approval Setup
                      <span className="count-title">
                        {approvalSetup?.totalCount}
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
                          placeholder="Search Approval Setup"
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
                            Manage
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
        <ManageApprovalSetup
          setApprovalSetup={setSelectedApprovalSetup}
          approvalSetup={selectedApprovalSetup}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        approvalSetupId={selectedRequestType}
      />
    </>
  );
};

export default ApprovalSetup;
