import Table from "../../components/common/dataTableNew/index.js";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchsuccessionPlanning } from "../../redux/successionPlanningEntry";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManagesuccessionPlanning from "./ManagesuccessionPlanningEntry/index.js";

const SuccessionPlanningEntry = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedsuccessionPlanning, setSelectedsuccessionPlanning] =
    useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { successionPlanning, loading } = useSelector(
    (state) => state.successionPlanning || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchsuccessionPlanning({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: successionPlanning?.currentPage,
      totalPage: successionPlanning?.totalPages,
      totalCount: successionPlanning?.totalCount,
      pageSize: successionPlanning?.size,
    });
  }, [successionPlanning]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchsuccessionPlanning({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = successionPlanning?.data;

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
      title: "Current Holder",
      render: (record) => record?.succession_currentHolder?.full_name || "-",
    },
    {
      title: "Potential Successor",
      render: (record) =>
        record?.succession_potentialSuccessor?.full_name || "-",
    },
    {
      title: "Development",
      dataIndex: "development_plan",
      render: (text) => text || "-",
    },
    {
      title: "Successor Rank",
      dataIndex: "successor_rank",
      render: (text) => text || "-",
    },
    {
      title: "Expected Transition",
      dataIndex: "expected_transition_date",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
    },
    {
      title: "Risk Loss",
      dataIndex: "risk_of_loss",
      render: (text) => text || "-",
    },
    {
      title: "Retention Plan",
      dataIndex: "retention_plan",
      render: (text) => text || "-",
    },
    {
      title: "Last Update By HR",
      dataIndex: "succession_updateByHR",
      render: (record) => record?.full_name || "-",
    },
    {
      title: "Evaluated By",
      dataIndex: "succession_evaluatedBy",
      render: (record) => record?.full_name || "-",
    },
    {
      title: "Role",
      dataIndex: "succession_role",
      render: (record) => record?.role_name || "-",
    },
    {
      title: "Last Review Date",
      dataIndex: "last_review_date",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
    },
    {
      title: "Critical Position",
      dataIndex: "critical_position",
      render: (text) => text || "-",
    },
    {
      title: "Readiness Level",
      dataIndex: "readiness_level",
      render: (text) => text || "-",
    },
    {
      title: "Planned Date",
      dataIndex: "plan_date",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
    },
    {
      title: "Evaluation Date",
      dataIndex: "evaluation_date",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "-"),
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
                      onClick={() => setSelectedsuccessionPlanning(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}

                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeletesuccessionPlanning(a)}
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

  const handleDeletesuccessionPlanning = (successionPlanning) => {
    setSelectedsuccessionPlanning(successionPlanning);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Succession Planning Entry</title>
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
                      Succession Planning Entry
                      <span className="count-title">
                        {successionPlanning?.totalCount}
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
                          placeholder="Search Succession Planning Entry"
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
                            Add Succession Planning Entry
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
        <ManagesuccessionPlanning
          setsuccessionPlanning={setSelectedsuccessionPlanning}
          successionPlanning={selectedsuccessionPlanning}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        successionPlanningId={selectedsuccessionPlanning?.id}
      />
    </>
  );
};

export default SuccessionPlanningEntry;
