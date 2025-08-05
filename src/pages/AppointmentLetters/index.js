import Table from "../../components/common/dataTableNew/index.js";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchAppointments } from "../../redux/AppointmentLetters";
import DeleteConfirmation from "./DeleteConfirmation";
import ManageAppointments from "./ManageAppointments";

const AppointmentLetters = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(365, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { appointment, loading } = useSelector(
    (state) => state.appointment || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchAppointments({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: appointment?.currentPage,
      totalPage: appointment?.totalPages,
      totalCount: appointment?.totalCount,
      pageSize: appointment?.size,
    });
  }, [appointment]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchAppointments({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = appointment?.data;

  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Appointment Letters"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const columns = [
    {
      title: "Candidate",
      dataIndex: "appointment_candidate",
      render: (text) => text.full_name || "-",
    },
    {
      title: "Designation",
      dataIndex: "appointment_designation",
      render: (text) => text.designation_name || "-",
    },
    {
      title: "Appointment Date",
      dataIndex: "issue_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "---"),
    },
    {
      title: "Terms Summary",
      dataIndex: "terms_summary",
      render: (text) => text || "---",
    },
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "---"),
      sorter: (a, b) => a.createdate.length - b.createdate.length,
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
                      data-bs-target="#offcanvas_add_appointment"
                      onClick={() => setSelectedAppointment(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}

                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteAppointment(a)}
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

  const handleDeleteAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Appointment Letters</title>
        <meta
          name="appointment"
          content="This is appointment page of DCC HRMS."
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
                      Appointment Letters
                      <span className="count-title">
                        {appointment?.totalCount}
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
                          placeholder="Search Appointment Letters"
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
                            data-bs-target="#offcanvas_add_appointment"
                          >
                            <i className="ti ti-square-rounded-plus me-2" />
                            Add Appointment Letters
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
        <ManageAppointments
          setAppointment={setSelectedAppointment}
          appointment={selectedAppointment}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        appointmentId={selectedAppointment?.id}
      />
    </>
  );
};

export default AppointmentLetters;
