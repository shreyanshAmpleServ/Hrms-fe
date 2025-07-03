import Table from "../../components/common/dataTableNew/index.js";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchtrainingSession } from "../../redux/trainingSessionSchedule";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import Managetraining from "./ManageTraining";
import ManageStatus from "./ManageStatus/index.js";
const TrainingSessionSchedule = () => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedtrainingSession, setSelectedtrainingSession] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { trainingSession, loading } = useSelector(
    (state) => state.trainingSession || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchtrainingSession({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: trainingSession?.currentPage,
      totalPage: trainingSession?.totalPages,
      totalCount: trainingSession?.totalCount,
      pageSize: trainingSession?.size,
    });
  }, [trainingSession]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchtrainingSession({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = trainingSession?.data;

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
      title: "Training Title",
      dataIndex: "training_title",
      render: (text) => text || "-",
    },
    {
      title: "Trainer Name",
      dataIndex: "training_session_employee",
      render: (value) => <div>{value?.full_name}</div>,
    },
    {
      title: "Training Date",
      dataIndex: "training_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) => new Date(a.training_date) - new Date(b.training_date),
    },
    {
      title: "Location",
      dataIndex: "location",
      render: (text) => text || "-",
    },
    {
      title: "Training Type",
      dataIndex: "training_type",
      render: (text) => <p className="text-capitalize">{text || "-"}</p>,
    },
    {
      title: "Training Objective",
      dataIndex: "training_objective",
      render: (text) => <p className="text-capitalize">{text || "-"}</p>,
    },
    {
      title: "Department",
      dataIndex: "department_id",
      render: (text) => text || "-",
    },
    {
      title: "Audience Level",
      dataIndex: "audience_level",
      render: (text) => <p className="text-capitalize">{text || "-"}</p>,
    },
    {
      title: "Participant Limit",
      dataIndex: "participant_limit",
      render: (text) => (text !== undefined && text !== null ? text : "-"),
    },

    {
      title: "Duration (Hours)",
      dataIndex: "duration_hours",
      render: (text) => (text !== undefined && text !== null ? text : "-"),
    },

    {
      title: "Training Material",
      dataIndex: "training_material_path",
      render: (_text, record) => (
        <a
          href={record.training_material_path}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="d-inline-flex align-items-center gap-2 text-decoration-none"
          title="View or Download PDF"
        >
          <i className="ti ti-file-type-pdf fs-5"></i>
          <span>View </span>
        </a>
      ),
    },

    {
      title: "Evaluation Required",
      dataIndex: "evaluation_required",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Feedback Required",
      dataIndex: "feedback_required",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Status",
      dataIndex: "training_status",
      render: (value) => (
        <div
          className={`text-capitalize badge ${
            value === "P"
              ? "bg-warning"
              : value === "O"
                ? "bg-info"
                : value === "C"
                  ? "bg-success"
                  : value === "X"
                    ? "bg-danger"
                    : "bg-secondary"
          }`}
        >
          {value === "P"
            ? "Planned"
            : value === "O"
              ? "Ongoing"
              : value === "C"
                ? "Completed"
                : value === "X"
                  ? "Cancelled"
                  : value || "—"}
        </div>
      ),
      sorter: (a, b) =>
        (a.training_status || "").localeCompare(b.training_status || ""),
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
                      Manage Status
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
                      onClick={() => handleDeletetrainingSession(record)}
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

  const handleDeletetrainingSession = (trainingSession) => {
    setSelectedtrainingSession(trainingSession);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS -Training Session Schedule</title>
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
                      Training Session Schedule
                      <span className="count-title">
                        {trainingSession?.totalCount}
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
                          placeholder="Search Training Session Schedule"
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
                            Add Training Session Schedule
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
                        scroll={{ x: "max-content" }}
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
        <Managetraining
          settrainingSession={setSelected}
          trainingSession={selected}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        trainingSessionId={selectedtrainingSession?.id}
      />
      <ManageStatus selected={selected} open={open} setOpen={setOpen} />
    </>
  );
};

export default TrainingSessionSchedule;
