import Table from "../../components/common/dataTableNew/index.js";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchgoalSheet } from "../../redux/GoalSheetAssignment";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManageGoalSheetAssignment from "./ManageGoalSheetAssignment/index.js";
import ManageStatus from "./ManageStatus/index.js";
import usePermissions from "../../components/common/Permissions.js/index.js";
const GoalSheetAssignment = () => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedgoalSheet, setSelectedgoalSheet] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { goalSheet, loading } = useSelector((state) => state.goalSheet || {});

  React.useEffect(() => {
    dispatch(
      fetchgoalSheet({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: goalSheet?.currentPage,
      totalPage: goalSheet?.totalPages,
      totalCount: goalSheet?.totalCount,
      pageSize: goalSheet?.size,
    });
  }, [goalSheet]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchgoalSheet({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = goalSheet?.data;

  const { isView, isCreate, isUpdate, isDelete } = usePermissions(
    "Goal Sheet Assignment"
  );

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "goal_sheet_assignment_employee",
      render: (text) => text?.full_name || "-",
    },
    {
      title: "Appraisal Cycle",
      dataIndex: "goal_sheet_assignment_appraisal",
      render: (text) => text?.review_period || "-",
    },
    {
      title: "Goal Category",
      dataIndex: "goal_sheet_assignment_goalCategory",
      render: (text) => text?.category_name || "-",
    },
    {
      title: "Goal Description",
      dataIndex: "goal_description",
      render: (text) => <p>{text}</p> || "-",
    },
    {
      title: "Weightage",
      dataIndex: "weightage",
      render: (text) => <span>{text}%</span> || "-",
    },
    {
      title: "Target Value",
      dataIndex: "target_value",
      render: (text) => <p>{text}</p> || "-",
    },
    {
      title: "Measurement Criteria",
      dataIndex: "measurement_criteria",
      render: (text) => <p>{text}</p> || "-",
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <div
          className={`text-capitalize badge ${
            value === "P"
              ? "bg-warning"
              : value === "I"
                ? "bg-info"
                : value === "C"
                  ? "bg-success"
                  : "bg-secondary"
          }`}
        >
          {value === "P"
            ? "Pending"
            : value === "I"
              ? "In Progress"
              : value === "C"
                ? "Completed"
                : value || "—"}
        </div>
      ),
      sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
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
                      {record.status === "I"
                        ? "Pending/Completed"
                        : record.status === "P"
                          ? "Completed/In Progress"
                          : record.status === "C"
                            ? "Pending/In Progress"
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
                      onClick={() => handleDeletegoalSheet(record)}
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

  const handleDeletegoalSheet = (goalSheet) => {
    setSelectedgoalSheet(goalSheet);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Goal Sheet Assignment</title>
        <meta
          name="helpdesk-ticket"
          content="This is helpdesk ticket page of DCC HRMS."
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
                      Goal Sheet Assignment
                      <span className="count-title">
                        {goalSheet?.totalCount}
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
                          placeholder="Search Goal Sheet "
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
                            Create{" "}
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <>
                    {/* Filter */}
                    <div className="d-flex align-items-center justify-content-between flex-wrap mb-4 row-gap-2">
                      <div className="d-flex align-items-center flex-wrap row-gap-2">
                        <div className="d-flex align-items-center flex-wrap row-gap-2"></div>
                      </div>
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
        <ManageGoalSheetAssignment
          setgoalSheet={setSelected}
          goalSheet={selected}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        goalSheet
        Id={selectedgoalSheet?.id}
      />
      <ManageStatus selected={selected} open={open} setOpen={setOpen} />
    </>
  );
};

export default GoalSheetAssignment;
