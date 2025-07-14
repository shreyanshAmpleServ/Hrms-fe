import Table from "../../components/common/dataTableNew/index.js";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchprobationReview } from "../../redux/ProbationReview";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManageProbationReview from "./ManageProbationReview";
import ManageStatus from "./ManageStatus/index.js";
const ProbationReview = () => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedprobationReview, setSelectedprobationReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { probationReview, loading } = useSelector(
    (state) => state.probationReview || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchprobationReview({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: probationReview?.currentPage,
      totalPage: probationReview?.totalPages,
      totalCount: probationReview?.totalCount,
      pageSize: probationReview?.size,
    });
  }, [probationReview]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchprobationReview({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = probationReview?.data;

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
      render: (record) => record?.probation_review_employee?.full_name || "-",
    },
    {
      title: "Probation Reviewer",
      render: (record) => record?.probation_reviewer?.full_name || "-",
    },
    {
      title: "Probation End Date",
      dataIndex: "probation_end_date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Review Notes",
      dataIndex: "review_notes",
      render: (text) => text || "-",
    },
    // {
    //   title: "Confirmation Status",
    //   dataIndex: "confirmation_status",
    //   render: (status) => status || "-",
    // },
    {
      title: "Confirmation Date",
      dataIndex: "confirmation_date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Review Meeting Date",
      dataIndex: "review_meeting_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) =>
        new Date(a.review_meeting_date) - new Date(b.review_meeting_date),
    },
    {
      title: "Performance Rating",
      dataIndex: "performance_rating",
      render: (text) => text || "-",
    },
    {
      title: "Extension Required",
      dataIndex: "extension_required",
      render: (text) => text || "-",
    },
    {
      title: "Extension Reason",
      dataIndex: "extension_reason",
      render: (text) => text || "-",
    },
    {
      title: "Extended Till Date",
      dataIndex: "extended_till_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) =>
        new Date(a.extended_till_date) - new Date(b.extended_till_date),
    },
    {
      title: "Next Review Date",
      dataIndex: "next_review_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) =>
        new Date(a.next_review_date) - new Date(b.next_review_date),
    },
    {
      title: "Final Remarks",
      dataIndex: "final_remarks",
      render: (text) => text || "-",
    },

    {
      title: "Confirmation Status",
      dataIndex: "confirmation_status",
      render: (value) => (
        <div
          className={`text-capitalize badge ${
            value === "C"
              ? "bg-success"
              : value === "E"
                ? "bg-warning"
                : value === "T"
                  ? "bg-danger"
                  : "bg-secondary"
          }`}
        >
          {value === "C"
            ? "Confirmed"
            : value === "E"
              ? "Extended"
              : value === "T"
                ? "Terminated"
                : value || "—"}
        </div>
      ),
      sorter: (a, b) =>
        (a.confirmation_status || "").localeCompare(
          b.confirmation_status || ""
        ),
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
                        : record.status === "C"
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
                      }}
                    >
                      <i className="ti ti-edit text-blue"></i> Edit
                    </Link>
                  )}
                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteprobationReview(record)}
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

  const handleDeleteprobationReview = (probationReview) => {
    setSelectedprobationReview(probationReview);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Probation Review</title>
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
                      Probation Review
                      <span className="count-title">
                        {probationReview?.totalCount}
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
                          placeholder="Search Probation Review"
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
        <ManageProbationReview
          setprobationReview={setSelected}
          probationReview={selected}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        probationReviewId={selectedprobationReview?.id}
      />
      <ManageStatus selected={selected} open={open} setOpen={setOpen} />
    </>
  );
};

export default ProbationReview;
