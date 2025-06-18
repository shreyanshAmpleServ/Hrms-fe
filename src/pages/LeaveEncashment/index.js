import { Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchLeaveEncashment } from "../../redux/LeaveEncashment";
import DeleteConfirmation from "./DeleteConfirmation";
import ManageLeaveEncashment from "./ManageLeaveEncashment";

const LeaveEncashment = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedLeaveEncashment, setSelectedLeaveEncashment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { leaveEncashment, loading } = useSelector(
    (state) => state.leaveEncashment || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchLeaveEncashment({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: leaveEncashment?.currentPage,
      totalPage: leaveEncashment?.totalPages,
      totalCount: leaveEncashment?.totalCount,
      pageSize: leaveEncashment?.size,
    });
  }, [leaveEncashment]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchLeaveEncashment({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = leaveEncashment?.data;

  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Leave Encashment"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const columns = [
    {
      title: "Employee Name",
      render: (text) => text?.leave_encashment_employee?.full_name || "-",
    },
    {
      title: "Leave Type",
      render: (text) => text?.encashment_leave_types?.leave_type || "-",
    },
    {
      title: "Leave Days",
      dataIndex: "leave_days",
      render: (text) => text || "-",
    },
    {
      title: "Encashment Date",
      dataIndex: "encashment_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : ""),
      sorter: (a, b) => a.encashment_date.length - b.encashment_date.length,
    },
    {
      title: "Encashment Amount",
      dataIndex: "encashment_amount",
      render: (text) => text || "-",
    },
    {
      title: "Approved Status",
      dataIndex: "approval_status",
      render: (text) => (
        <div
          className={`badge ${
            text === "approved"
              ? "badge-success"
              : text === "pending"
                ? "badge-warning"
                : "badge-danger"
          }`}
        >
          {text?.charAt(0)?.toUpperCase() + text?.slice(1) || "-"}
        </div>
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
                      onClick={() => setSelectedLeaveEncashment(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}

                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteLeaveEncashment(a)}
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

  const handleDeleteLeaveEncashment = (leaveEncashment) => {
    setSelectedLeaveEncashment(leaveEncashment);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Leave Encashment</title>
        <meta
          name="leave-encashment"
          content="This is leave encashment page of DCC HRMS."
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
                      Leave Encashment
                      <span className="count-title">
                        {leaveEncashment?.totalCount}
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
                          placeholder="Search Leave Encashment"
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
                            Add Leave Encashment
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
        <ManageLeaveEncashment
          setLeaveEncashment={setSelectedLeaveEncashment}
          leaveEncashment={selectedLeaveEncashment}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        leaveEncashmentId={selectedLeaveEncashment?.id}
      />
    </>
  );
};

export default LeaveEncashment;
