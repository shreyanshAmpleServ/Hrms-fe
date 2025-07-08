import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import Table from "../../components/common/dataTableNew/index.js";
import usePermissions from "../../components/common/Permissions.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchOverTimeMaster } from "../../redux/overTimeMaster/index.js";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManageOverTimeMaster from "./ManageOverTimeMaster/index.js";

const OverTimeMaster = () => {
  const [selected, setSelected] = React.useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [selectedOverTimeMaster, setSelectedOverTimeMaster] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(365, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { overtimeMaster, loading } = useSelector(
    (state) => state.overtimeMaster || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchOverTimeMaster({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: overtimeMaster?.currentPage,
      totalPage: overtimeMaster?.totalPages,
      totalCount: overtimeMaster?.totalCount,
      pageSize: overtimeMaster?.size,
    });
  }, [overtimeMaster]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchOverTimeMaster({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = overtimeMaster?.data;

  const { isView, isCreate, isUpdate, isDelete } =
    usePermissions("Over Time Master");

  const columns = [
    {
      title: "Days Code",
      dataIndex: "days_code",
      render: (text) => text || "-",
      sorter: (a, b) => a.days_code?.localeCompare(b.days_code || ""),
    },
    {
      title: "Wage Type",
      dataIndex: "wage_type",
      render: (text) => text || "-",
      sorter: (a, b) => a.wage_type?.localeCompare(b.wage_type || ""),
    },
    {
      title: "Hourly Rate Hike",
      dataIndex: "hourly_rate_hike",
      render: (text) => text || "-",
      sorter: (a, b) => Number(a.hourly_rate_hike) - Number(b.hourly_rate_hike),
    },
    {
      title: "Maximum Overtime Allowed",
      dataIndex: "maximum_overtime_allowed",
      render: (text) => text || "-",
      sorter: (a, b) =>
        Number(a.maximum_overtime_allowed) - Number(b.maximum_overtime_allowed),
    },
    {
      title: "Create Date",
      dataIndex: "createdate",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) => moment(a.createdate).diff(moment(b.createdate)),
    },

    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (value) => (
    //     <div
    //       className={`text-capitalize badge ${
    //         value === "Pending"
    //           ? "bg-warning"
    //           : value === "Approved"
    //             ? "bg-success"
    //             : value === "Rejected"
    //               ? "bg-danger"
    //               : "bg-secondary"
    //       }`}
    //     >
    //       {value || "—"}
    //     </div>
    //   ),
    //   sorter: (a, b) => a.status?.localeCompare(b.status || ""),
    // },
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
                      onClick={() => handleDeleteOverTimeMaster(record)}
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

  const handleDeleteOverTimeMaster = (overtimeMaster) => {
    setSelectedOverTimeMaster(overtimeMaster);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Over Time Master</title>
        <meta
          name="over-time-Master"
          content="This is over time Master page of DCC HRMS."
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
                      Over Time Master
                      <span className="count-title">
                        {overtimeMaster?.totalCount}
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
                          placeholder="Search Over Time Master"
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
        <ManageOverTimeMaster
          setOverTimeMaster={setSelected}
          overtimeMaster={selected}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        overTimeMasterId={selectedOverTimeMaster?.id}
      />
    </>
  );
};

export default OverTimeMaster;
