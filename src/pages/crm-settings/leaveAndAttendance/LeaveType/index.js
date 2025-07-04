import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../../components/common/collapse-header";
import Table from "../../../../components/common/dataTableNew/index";
import AddButton from "../../../../components/datatable/AddButton";
import SearchBar from "../../../../components/datatable/SearchBar";
import SortDropdown from "../../../../components/datatable/SortDropDown";
import { deleteLeaveType, fetchLeaveType } from "../../../../redux/LeaveType";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";
import usePermissions from "../../../../components/common/Permissions.js";

const LeaveTypeList = () => {
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [paginationData, setPaginationData] = useState();

  const { isView, isCreate, isUpdate, isDelete } = usePermissions("Leave Type");

  const dispatch = useDispatch();
  const columns = [
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      render: (text) => <div>{text}</div>,
      sorter: (a, b) => a.leave_type.localeCompare(b.leave_type),
    },
    {
      title: "Quantity",
      dataIndex: "leave_qty",
      render: (text) => text || "-",
      sorter: (a, b) => a.leave_qty - b.leave_qty,
    },
    {
      title: "Unit",
      dataIndex: "leave_unit",
      render: (text) => (text === "D" ? "Day" : "Hour"),
      sorter: (a, b) => a.leave_unit.localeCompare(b.leave_unit),
    },
    {
      title: "For Gender",
      dataIndex: "for_gender",
      render: (text) =>
        text === "B"
          ? "Both"
          : text === "M"
            ? "Male"
            : text === "F"
              ? "Female"
              : "-",
      sorter: (a, b) => {
        const genderOrder = { B: 0, M: 1, F: 2 };
        return genderOrder[a.for_gender] - genderOrder[b.for_gender];
      },
    },
    {
      title: "Carry Forward",
      dataIndex: "carry_forward",
      render: (text) => <div>{text ? "Yes" : "No"}</div>,
      sorter: (a, b) =>
        a.carry_forward === b.carry_forward ? 0 : a.carry_forward ? -1 : 1,
    },
    {
      title: "Prorate Allowed",
      dataIndex: "prorate_allowed",
      render: (text) => <div>{text ? "Yes" : "No"}</div>,
      sorter: (a, b) =>
        a.prorate_allowed === b.prorate_allowed
          ? 0
          : a.prorate_allowed
            ? -1
            : 1,
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (text) => (
        <span className={`badge ${text === "Y" ? "bg-success" : "bg-danger"}`}>
          {text === "Y" ? "Active" : "Inactive"}
        </span>
      ),
      sorter: (a, b) => a.is_active.localeCompare(b.is_active),
    },

    ...(isUpdate || isDelete
      ? [
          {
            title: "Actions",
            dataIndex: "actions",
            render: (_, record) => (
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
                      data-bs-toggle="modal"
                      data-bs-target="#add_edit_leave_type_modal"
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
                      onClick={() => handleDeleteIndustry(record)}
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

  const { leaveType, loading } = useSelector((state) => state.leaveType);

  React.useEffect(() => {
    dispatch(fetchLeaveType({ search: searchText }));
  }, [dispatch, searchText]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: leaveType?.currentPage,
      totalPage: leaveType?.totalPages,
      totalCount: leaveType?.totalCount,
      pageSize: leaveType?.size,
    });
  }, [leaveType]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchLeaveType({ search: searchText, page: currentPage, size: pageSize })
    );
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = leaveType?.data || [];
    if (sortOrder === "ascending") {
      data = [...data].sort((a, b) =>
        moment(a.createdate).isBefore(moment(b.createdate)) ? -1 : 1
      );
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) =>
        moment(a.createdate).isBefore(moment(b.createdate)) ? 1 : -1
      );
    }
    return data;
  }, [leaveType, sortOrder]);

  const handleDeleteIndustry = (industry) => {
    setSelected(industry);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selected) {
      dispatch(deleteLeaveType(selected.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Leave Type</title>
        <meta name="leaveType" content="This is leaveType page of DCC HRMS." />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Leave Type
                    <span className="count-title">
                      {leaveType?.data?.length || 0}
                    </span>
                  </h4>
                </div>
                <div className="col-4 text-end">
                  <div className="head-icons">
                    <CollapseHeader />
                  </div>
                </div>
              </div>
            </div>
            <div className="card ">
              <div className="card-header">
                <div className="row align-items-center">
                  <SearchBar
                    searchText={searchText}
                    handleSearch={handleSearch}
                    label="Search Leave Type"
                  />
                  {isCreate && (
                    <div className="col-sm-8">
                      <AddButton
                        label="Create"
                        id="add_edit_leave_type_modal"
                        setMode={() => setMode("add")}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    <SortDropdown
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                    />
                  </div>
                </div>

                <div className="table-responsive custom-table">
                  <Table
                    dataSource={filteredData}
                    columns={columns}
                    loading={loading}
                    isView={isView}
                    paginationData={paginationData}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEditModal
        mode={mode}
        initialData={selected}
        setSelected={setSelected}
      />
      <DeleteAlert
        label="Leave Type"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default LeaveTypeList;
