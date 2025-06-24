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
      currentPage: candidate?.currentPage,
      totalPage: candidate?.totalPages,
      totalCount: candidate?.totalCount,
      pageSize: candidate?.size,
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
      title: "Status",
      dataIndex: "status",
      render: (text) => <p className="text-capitalize">{text}</p> || "-",
    },
    {
      title: "Status Remarks",
      dataIndex: "status_remarks",
      render: (text) => text || "-",
    },
    {
      title: "Interview Stage",
      dataIndex: "interview_stage",
      render: (text) => text || "-",
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
      render: (text) => text || "-",
    },
    {
      title: "No Show Marked Date",
      dataIndex: "no_show_marked_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "No Show Remarks",
      dataIndex: "no_show_remarks",
      render: (text) => text || "-",
    },
    {
      title: "Created At",
      dataIndex: "createdate",
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
                        {candidate?.totalCount}
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
                        dataSource={data}
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
