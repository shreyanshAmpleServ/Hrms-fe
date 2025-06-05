import { Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchgrievanceSubmission } from "../../redux/grievanceSubmission/index.js";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManagegrievanceSubmission from "./ManagegrievanceSubmission/index.js";

const GrievanceSubmission = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedgrievanceSubmission, setSelectedgrievanceSubmission] =
    useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { grievanceSubmission, loading } = useSelector(
    (state) => state.grievanceSubmission || {},
  );

  React.useEffect(() => {
    dispatch(
      fetchgrievanceSubmission({
        search: searchValue,
        ...selectedDateRange,
      }),
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: grievanceSubmission?.currentPage,
      totalPage: grievanceSubmission?.totalPages,
      totalCount: grievanceSubmission?.totalCount,
      pageSize: grievanceSubmission?.size,
    });
  }, [grievanceSubmission]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchgrievanceSubmission({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      }),
    );
  };

  const data = grievanceSubmission?.data;

  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Time Sheet Entry",
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const columns = [
    {
      title: "Employee Name",
      render: (text) => text?.grievance_employee?.full_name || "-", // assuming relation
    },
    {
      title: "Grievance Type",
      render: (text) => text?.grievance_types?.grievance_type_name || "-", // assuming relation
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => text || "-",
    },
    {
      title: "Anonymous",
      dataIndex: "anonymous",
      render: (val) => (val ? "Yes" : "No"),
    },
    {
      title: "Submitted On",
      dataIndex: "submitted_on",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY HH:mm") : "-"),
      sorter: (a, b) => new Date(a.submitted_on) - new Date(b.submitted_on),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => text || "-",
    },
    {
      title: "Assigned To",
      render: (text) => text?.grievance_assigned_to?.full_name || "-", // assuming relation
    },
    {
      title: "Resolution Notes",
      dataIndex: "resolution_notes",
      render: (text) => text || "-",
    },
    {
      title: "Resolved On",
      dataIndex: "resolved_on",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
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
                      onClick={() => setSelectedgrievanceSubmission(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}

                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeletegrievanceSubmission(a)}
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

  const handleDeletegrievanceSubmission = (grievanceSubmission) => {
    setSelectedgrievanceSubmission(grievanceSubmission);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Grievance Submission</title>
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
                      Grievance Submission
                      <span className="count-title">
                        {grievanceSubmission?.totalCount}
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
                          placeholder="Search Grievance Submission"
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
                            Add Grievance Submission
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
        <ManagegrievanceSubmission
          setgrievanceSubmission={setSelectedgrievanceSubmission}
          grievanceSubmission={selectedgrievanceSubmission}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        grievanceSubmissionId={selectedgrievanceSubmission?.id}
      />
    </>
  );
};

export default GrievanceSubmission;
