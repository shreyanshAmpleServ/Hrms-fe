import { Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchrecognitionAwards } from "../../redux/RecognitionAwards";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManageRecognitionAwards from "./ManageRecognitionAwards";

const RecognitionAwards = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedrecognitionAwards, setSelectedrecognitionAwards] =
    useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { recognitionAwards, loading } = useSelector(
    (state) => state.recognitionAwards || {},
  );

  React.useEffect(() => {
    dispatch(
      fetchrecognitionAwards({
        search: searchValue,
        ...selectedDateRange,
      }),
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: recognitionAwards?.currentPage,
      totalPage: recognitionAwards?.totalPages,
      totalCount: recognitionAwards?.totalCount,
      pageSize: recognitionAwards?.size,
    });
  }, [recognitionAwards]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchrecognitionAwards({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      }),
    );
  };

  const data = recognitionAwards?.data;

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
      dataIndex: "recognition_award_employee", // assuming this is a relation object
      render: (text) => text?.full_name || "-",
    },
    {
      title: "Award Title",
      dataIndex: "award_title",
      render: (text) => text || "-",
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => text || "-",
    },
    {
      title: "Award Date",
      dataIndex: "award_date",
      render: (text) => (text ? moment(text).format("DD MMM YYYY") : "-"),
    },
    {
      title: "Nominated By",
      dataIndex: "recognition_award_nominated", // assuming this is a relation object
      render: (text) => text?.full_name || "-",
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
                      onClick={() => setSelectedrecognitionAwards(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}

                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleterecognitionAwards(a)}
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

  const handleDeleterecognitionAwards = (recognitionAwards) => {
    setSelectedrecognitionAwards(recognitionAwards);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS -Recognition Awards</title>
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
                      Recognition Awards
                      <span className="count-title">
                        {recognitionAwards?.totalCount}
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
                          placeholder="Search Recognition Awards"
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
                            Add Recognition Awards
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
        <ManageRecognitionAwards
          setrecognitionAwards={setSelectedrecognitionAwards}
          recognitionAwards={selectedrecognitionAwards}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        recognitionAwardsId={selectedrecognitionAwards?.id}
      />
    </>
  );
};

export default RecognitionAwards;
