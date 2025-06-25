import { Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchCandidate } from "../../redux/Candidate/index.js";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManageCandidate from "./ManageCandidate/index.js";
import usePermissions from "../../components/common/Permissions.js/index.js";
// [
//   {
//     title: "Application Review",
//     status: "completed",
//     date: "2024-06-20",
//     rating: 4,
//     description:
//       "Candidate meets all basic eligibility criteria. Resume is well-structured and relevant to the role.",
//   },
//   {
//     title: "Phone Screening",
//     status: "completed",
//     date: "2024-06-22",
//     rating: 4.5,
//     description:
//       "Candidate showed clear communication, explained past projects confidently, and expressed interest in the role.",
//   },
//   {
//     title: "Technical Interview",
//     status: "current",
//     date: "",
//     rating: 0,
//     description:
//       "Scheduled with the frontend team. Candidate to be assessed on React, JS, and problem-solving ability.",
//   },
//   {
//     title: "Final Interview",
//     status: "pending",
//     date: "",
//     rating: 0,
//     description:
//       "Managerial evaluation of team fit, critical thinking, and leadership potential.",
//   },
//   {
//     title: "Offer Discussion",
//     status: "pending",
//     date: "",
//     rating: 0,
//     description:
//       "Discussion on salary expectations, joining date, and offer conditions.",
//   },
// ];

const Candidate = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { candidate, loading } = useSelector((state) => state.candidate || {});

  React.useEffect(() => {
    dispatch(
      fetchCandidate({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: candidate?.data?.currentPage,
      totalPage: candidate?.data?.totalPages,
      totalCount: candidate?.data?.totalCount,
      pageSize: candidate?.data?.size,
    });
  }, [candidate]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchCandidate({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = candidate?.data;

  const { isView, isCreate, isUpdate, isDelete } = usePermissions("Candidate");

  const columns = [
    {
      title: "Candidate Name",
      dataIndex: "full_name",
      render: (text, record) => (
        <Link to={`/candidate/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Candidate Code",
      dataIndex: "candidate_code",
      render: (text) => text || "-",
    },
    {
      title: "Job Posting",
      dataIndex: "candidate_job_posting",
      render: (text) => text?.job_title || "-",
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => text || "-",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text) => text || "-",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      render: (text) =>
        text === "M"
          ? "Male"
          : text === "F"
            ? "Female"
            : text === "O"
              ? "Other"
              : "-",
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      render: (text) => text || "-",
    },
    {
      title: "Date of Birth",
      dataIndex: "date_of_birth",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Application Source",
      dataIndex: "candidate_application_source",
      render: (text) => text?.source_name || "-",
    },
    {
      title: "Interview Stage",
      dataIndex: "candidate_interview_stage",
      render: (text) => text?.stage_name || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span
          className={`badge text-white ${
            text === "P"
              ? "bg-warning"
              : text === "A"
                ? "bg-success"
                : text === "R"
                  ? "bg-danger"
                  : "bg-secondary"
          }`}
        >
          {text === "P"
            ? "Pending"
            : text === "A"
              ? "Approved"
              : text === "R"
                ? "Rejected"
                : text}
        </span>
      ),
    },
    {
      title: "Status Remarks",
      dataIndex: "status_remarks",
      render: (text) => text || "-",
    },
    {
      title: "Expected Joining Date",
      dataIndex: "expected_joining_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Offer Accepted Date",
      dataIndex: "offer_accepted_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Actual Joining Date",
      dataIndex: "actual_joining_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "No Show Flag",
      dataIndex: "no_show_flag",
      render: (text) => (text === "Y" ? "Yes" : "No"),
    },
    {
      title: "No Show Marked Date",
      dataIndex: "no_show_marked_date",
      render: (text) =>
        text === "Y" ? moment(text).format("DD-MM-YYYY") : "-",
    },
    {
      title: "No Show Remarks",
      dataIndex: "no_show_remarks",
      render: (text) => text || "-",
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
                      onClick={() => setSelectedCandidate(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}

                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteCandidate(a)}
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

  const handleDeleteCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Candidate</title>
        <meta name="candidate" content="This is candidate page of DCC HRMS." />
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
                      Candidate
                      <span className="count-title">
                        {candidate?.data?.totalCount}
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
                          placeholder="Search Candidate"
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
                            Add Candidate
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
                        dataSource={data?.data}
                        scroll={{ x: "max-content" }}
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
        <ManageCandidate
          setCandidate={setSelectedCandidate}
          candidate={selectedCandidate}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        candidateId={selectedCandidate?.id}
      />
    </>
  );
};

export default Candidate;
