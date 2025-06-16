import { Rate, Table, Tag } from "antd";
import moment from "moment";
import Select from "react-select"; // ✅ missing import

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchdailyAttendance } from "../../redux/dailyAttendance";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManagedailyAttendance from "./ManagedailyAttendance/index.js";
import { fetchEmployee } from "../../redux/Employee";
import { fetchAttendaceSummary } from "../../redux/AttendanceByEmployee/index.js";
import PermissionAccess from "../../components/common/Permissions.js/index.js";

const DailyAttendance = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selecteddailyAttendance, setSelecteddailyAttendance] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();
  const [selectedEmployee, setSelectedEmployee] = useState(null); // ✅ define selectedEmployee
  const [attendanceToEdit, setAttendanceToEdit] = useState(null);

  const { dailyAttendance, loading } = useSelector(
    (state) => state.dailyAttendance || {}
  );
  const { AttendaceSummarys, loading: loadinSummary } = useSelector(
    (state) => state.AttendaceSummarys || {}
  );
  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {}
  );

  const employeeOptions = [
    { label: "All Employees", value: null },
    ...(employee?.data?.map((i) => ({
      label: i.full_name,
      value: i.id,
    })) || []),
  ];
  const AllPermissions = PermissionAccess("Daily Attendance Entry");
  console.log("AllPermissions======PermissionAccess", AllPermissions);
  useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
  }, [dispatch, searchValue]);
  React.useEffect(() => {
    selectedEmployee &&
      dispatch(
        fetchdailyAttendance({
          search: searchValue,
          ...selectedDateRange,
          employee_id: selectedEmployee,
        })
      );
  }, [dispatch, searchValue, selectedDateRange, selectedEmployee]);
  React.useEffect(() => {
    dispatch(
      fetchAttendaceSummary({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);
  console.log("fetchAttendaceSummary", dailyAttendance);

  React.useEffect(() => {
    setPaginationData({
      currentPage: dailyAttendance?.currentPage,
      totalPage: dailyAttendance?.totalPages,
      totalCount: dailyAttendance?.totalCount,
      pageSize: dailyAttendance?.size,
    });
  }, [dailyAttendance]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchdailyAttendance({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = dailyAttendance?.attendanceList;
  const SummaryData = AttendaceSummarys;

  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Daily Attendance Entry"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  //   "badge-soft-success",
  // "badge-soft-warning",
  // "badge-soft-info",
  // "badge-soft-danger",
  // "badge-soft-primary",
  // "badge-soft-secondary",
  const getRandomClass = (status) => {
    return status === "Present"
      ? "badge-soft-success"
      : status === "Absent"
        ? "badge-soft-danger"
        : status === "Half Day"
          ? "badge-soft-secondary"
          : "badge-soft-primary";
  };

  const columns = [
    {
      title: "Employee Code",
      dataIndex: "employee_code",
      render: (text) => text || "-",
    },
    {
      title: "Employee Name",
      dataIndex: "full_name",
      render: (text) => text || "-",
    },
    // {
    //   title: "Attendance Date",
    //   dataIndex: "employee_code",
    //   render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    //   sorter: (a, b) =>
    //     new Date(a.attendance_date) - new Date(b.attendance_date),
    // },
    {
      title: "Present",
      dataIndex: "present",
      render: (text) => text,
    },
    {
      title: "Absent",
      dataIndex: "absent",
      render: (text) => text,
    },
    {
      title: "Half Day",
      dataIndex: "half_Day",
      render: (text) => text,
    },
    {
      title: "Late",
      dataIndex: "late",
      render: (text) => text,
    },

    ...(AllPermissions?.isDelete || AllPermissions?.isUpdate
      ? [
          // {
          //   title: "Action",
          //   render: (text, a) => (
          //     <div className="dropdown table-action">
          //       <Link
          //         to="#"
          //         className="action-icon "
          //         data-bs-toggle="dropdown"
          //         aria-expanded="false"
          //       >
          //         <i className="fa fa-ellipsis-v"></i>
          //       </Link>
          //       <div className="dropdown-menu dropdown-menu-right">
          //         {isUpdate && (
          //           <Link
          //             className="dropdown-item"
          //             to="#"
          //             data-bs-toggle="offcanvas"
          //             data-bs-target="#offcanvas_add"
          //             onClick={() => setSelecteddailyAttendance(a)}
          //           >
          //             <i className="ti ti-edit text-blue" /> Edit
          //           </Link>
          //         )}
          //         {isDelete && (
          //           <Link
          //             className="dropdown-item"
          //             to="#"
          //             onClick={() => handleDeletedailyAttendance(a)}
          //           >
          //             <i className="ti ti-trash text-danger" /> Delete
          //           </Link>
          //         )}
          //       </div>
          //     </div>
          //   ),
          // },
        ]
      : []),
  ];
  const columns2 = [
    {
      title: "Attendance Date",
      dataIndex: "attendance_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) =>
        new Date(a.attendance_date) - new Date(b.attendance_date),
    },
    {
      title: "Check-In Time",
      dataIndex: "check_in_time",
      render: (text) => (text ? moment(text).format("hh:mm A") : "-"),
    },
    {
      title: "Check-Out Time",
      dataIndex: "check_out_time",
      render: (text) => (text ? moment(text).format("hh:mm A") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <Link
          to="#" // Use index as key
          className={`badge ${text && getRandomClass(text)} fw-medium me-2 mb-1`}
        >
          {text || "-"}
        </Link>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (text) => text || "-",
    },

    ...(AllPermissions?.isDelete || AllPermissions?.isUpdate
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
                  {AllPermissions?.isUpdate && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add"
                      onClick={() => setSelecteddailyAttendance(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  const handleDeletedailyAttendance = (dailyAttendance) => {
    setSelecteddailyAttendance(dailyAttendance);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Daily Attendance Entry</title>
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
                      Daily Attendance Entry
                      <span className="count-title">
                        {dailyAttendance?.totalCount}
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
                          placeholder="Search Daily Attendance"
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                    </div>
                    {AllPermissions?.isCreate && (
                      <div className="col-sm-8">
                        <div className="text-sm-end">
                          <Link
                            to="#"
                            className="btn btn-primary"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvas_add"
                          >
                            <i className="ti ti-square-rounded-plus me-2" />
                            Add Daily Attendance Entry
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
                        <div className="d-flex align-items-center flex-wrap row-gap-2">
                          <h4 className="mb-0 me-3">
                            All Daily Attendance Entry{" "}
                          </h4>
                        </div>
                      </div>
                      <div
                        className="d-flex ms-auto"
                        style={{ width: "250px" }}
                      >
                        <Select
                          style={{ width: "250px" }}
                          options={employeeOptions}
                          value={
                            employeeOptions.find(
                              (opt) => opt.value === selectedEmployee
                            ) || employeeOptions[0]
                          }
                          onChange={(option) =>
                            setSelectedEmployee(option.value)
                          }
                          isLoading={employeeLoading}
                          placeholder="Select Employee"
                          onInputChange={(input) => setSearchValue(input)}
                          // isClearable
                          className="w-100"
                          classNamePrefix="react-select"
                        />
                      </div>{" "}
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

                  {AllPermissions?.isView ? (
                    <div className="table-responsive custom-table">
                      {!selectedEmployee ? (
                        <Table
                          columns={columns}
                          dataSource={SummaryData}
                          loading={loadinSummary}
                          paginationData={paginationData}
                          onPageChange={handlePageChange}
                        />
                      ) : (
                        <Table
                          columns={columns2}
                          dataSource={data}
                          loading={loading}
                          paginationData={paginationData}
                          onPageChange={handlePageChange}
                        />
                      )}
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
        <ManagedailyAttendance
          setAttendance={setSelecteddailyAttendance}
          dailyAttendance={selecteddailyAttendance}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        dailyAttendanceId={selecteddailyAttendance?.id}
      />
    </>
  );
};

export default DailyAttendance;
