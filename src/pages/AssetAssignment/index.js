import Table from "../../components/common/dataTableNew/index.js";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchAssetAssignment } from "../../redux/AssetAssignment/index.js";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManageAssetAssignment from "./ManageAssetAssignment/index.js";
import ManageStatus from "./ManageStatus/index.js";
const AssetAssignment = () => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [mode, setMode] = React.useState("add"); // 'add' or 'edit'
  const [searchValue, setSearchValue] = useState("");
  const [selectedAssetAssignment, setSelectedAssetAssignment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(365, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { assetAssignment, loading } = useSelector(
    (state) => state.assetAssignment || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchAssetAssignment({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: assetAssignment?.currentPage,
      totalPage: assetAssignment?.totalPages,
      totalCount: assetAssignment?.totalCount,
      pageSize: assetAssignment?.size,
    });
  }, [assetAssignment]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchAssetAssignment({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = assetAssignment?.data;

  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Asset Assignment & Recovery"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "asset_assignment_employee",
      render: (text) => text?.full_name || "-",
    },
    {
      title: "Asset Type",
      render: (text) => text?.asset_assignment_type?.asset_type_name || "-",
    },
    {
      title: "Asset Name",
      dataIndex: "asset_name",
      render: (text) => text || "-",
    },
    {
      title: "Serial Number",
      dataIndex: "serial_number",
      render: (text) => text || "-",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (text) => (
    //     <p
    //       className={`text-capitalize ${text === "available" ? "text-success" : text === "assigned" ? "text-primary" : text === "in_use" ? "text-warning" : text === "under_maintenance" ? "text-info" : text === "damaged" ? "text-danger" : text === "lost" ? "text-danger" : text === "disposed" ? "text-danger" : text === "returned" ? "text-success" : ""}`}
    //     >
    //       {text}
    //     </p>
    //   ),
    // },
    {
      title: "Issued On",
      dataIndex: "issued_on",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Returned On",
      dataIndex: "returned_on",
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
              : value === "A"
                ? "bg-success"
                : value === "R"
                  ? "bg-danger"
                  : "bg-danger"
          }`}
        >
          {value === "P" ? "Pending" : value === "A" ? "Approved" : "Rejected"}
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
                  {isUpdate && record.status === "P" && (
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
                  {isUpdate && record.status === "P" && (
                    <Link
                      className="dropdown-item edit-popup"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add"
                      onClick={() => {
                        setSelected(record);
                        setMode("edit");
                      }}
                    >
                      <i className="ti ti-edit text-blue"></i> Edit
                    </Link>
                  )}
                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteAssetAssignment(record)}
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

  const handleDeleteAssetAssignment = (assetAssignment) => {
    setSelectedAssetAssignment(assetAssignment);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Asset Assignment</title>
        <meta
          name="asset-assignment"
          content="This is asset assignment page of DCC HRMS."
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
                      Asset Assignment
                      <span className="count-title">
                        {assetAssignment?.totalCount}
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
                          placeholder="Search Asset Assignment"
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
        <ManageAssetAssignment
          setAssetAssignment={setSelected}
          assetAssignment={selected}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        assetAssignmentId={selectedAssetAssignment?.id}
      />
      <ManageStatus selected={selected} open={open} setOpen={setOpen} />
    </>
  );
};

export default AssetAssignment;
