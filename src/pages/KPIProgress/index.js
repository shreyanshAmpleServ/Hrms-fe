import { Progress } from "antd";
import Table from "../../components/common/dataTableNew/index.js";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchKPIProgress } from "../../redux/KPIProgress/index.js";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManageKPIProgress from "./ManageKPIProgress/index.js";

const KPIProgress = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedKPIProgress, setSelectedKPIProgress] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(365, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { kpiProgress, loading } = useSelector(
    (state) => state.kpiProgress || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchKPIProgress({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: kpiProgress?.currentPage,
      totalPage: kpiProgress?.totalPages,
      totalCount: kpiProgress?.totalCount,
      pageSize: kpiProgress?.size,
    });
  }, [kpiProgress]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchKPIProgress({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = kpiProgress?.data;

  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "KPI Progress Entry"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const columns = [
    {
      title: "Employee",
      dataIndex: "kpi_progress_entry_employee",
      render: (text) => text?.full_name || "-",
    },
    {
      title: "Goal",
      dataIndex: "kpi_progress_entry_goal",
      render: (text) => text?.goal_description || "-",
    },
    {
      title: "Reviewed By",
      dataIndex: "kpi_progress_entry_reviewedBy",
      render: (text) => text?.full_name || "-",
    },
    {
      title: "Progress Value",
      dataIndex: "progress_value",
      render: (text) => <Progress percent={text} />,
    },
    {
      title: "Reviewed On",
      dataIndex: "reviewed_on",
      render: (text) => moment(text).format("DD-MM-YYYY") || "-",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
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
                      onClick={() => setSelectedKPIProgress(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}

                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteKPIProgress(a)}
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

  const handleDeleteKPIProgress = (kpiProgress) => {
    setSelectedKPIProgress(kpiProgress);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - KPI Progress</title>
        <meta
          name="kpi-progress"
          content="This is kpi progress page of DCC HRMS."
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
                      KPI Progress
                      <span className="count-title">
                        {kpiProgress?.totalCount}
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
                          placeholder="Search KPI Progress"
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
        <ManageKPIProgress
          setKPIProgress={setSelectedKPIProgress}
          kpiProgress={selectedKPIProgress}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        kpiProgressId={selectedKPIProgress?.id}
      />
    </>
  );
};

export default KPIProgress;
