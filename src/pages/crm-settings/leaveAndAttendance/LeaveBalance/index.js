import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../../components/common/collapse-header.js";
import Table from "../../../../components/common/dataTable/index";
import usePermissions from "../../../../components/common/Permissions.js/index.js";
import SearchBar from "../../../../components/datatable/SearchBar.js";
import SortDropdown from "../../../../components/datatable/SortDropDown.js";
import {
  deleteLeaveBalance,
  fetchLeaveBalance,
} from "../../../../redux/leaveBalance";
import DeleteAlert from "./alert/DeleteAlert.js";
import AddEditModal from "./modal/AddEditModal.js";

const LeaveBalance = () => {
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [paginationData, setPaginationData] = useState();

  const { isView, isCreate, isUpdate, isDelete } =
    usePermissions("Leave Balance");

  const dispatch = useDispatch();
  const columns = [
    {
      title: "Employee",
      dataIndex: "leave_balance_employee",
      render: (text) => <div>{text?.full_name}</div>,
      sorter: (a, b) => a?.full_name.localeCompare(b?.full_name),
    },
    {
      title: "Employee Code",
      dataIndex: "employee_code",
      render: (text) => text || "-",
      sorter: (a, b) => a.employee_code.localeCompare(b.employee_code),
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) =>
        moment(a.start_date).isBefore(moment(b.start_date)) ? -1 : 1,
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) =>
        moment(a.end_date).isBefore(moment(b.end_date)) ? -1 : 1,
    },
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
      sorter: (a, b) =>
        moment(a.createdate).isBefore(moment(b.createdate)) ? -1 : 1,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span className={`badge ${text === "Y" ? "bg-success" : "bg-danger"}`}>
          {text === "Y" ? "Active" : "Inactive"}
        </span>
      ),
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
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add_edit_leave_balance"
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
                      onClick={() => handleDeleteLeaveBalance(record)}
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

  const { leaveBalance, loading } = useSelector((state) => state.leaveBalance);

  React.useEffect(() => {
    dispatch(fetchLeaveBalance({ search: searchText }));
  }, [dispatch, searchText]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: leaveBalance?.currentPage,
      totalPage: leaveBalance?.totalPages,
      totalCount: leaveBalance?.totalCount,
      pageSize: leaveBalance?.size,
    });
  }, [leaveBalance]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchLeaveBalance({
        search: searchText,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = leaveBalance?.data || [];
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
  }, [leaveBalance, sortOrder]);

  const handleDeleteLeaveBalance = (leaveBalance) => {
    setSelected(leaveBalance);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selected) {
      dispatch(deleteLeaveBalance(selected.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Leave Balance</title>
        <meta
          name="leaveBalance"
          content="This is leaveBalance page of DCC HRMS."
        />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Leave Balance
                    <span className="count-title">
                      {leaveBalance?.data?.length || 0}
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
            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-8">
                    <SearchBar
                      searchText={searchText}
                      handleSearch={handleSearch}
                      label="Search Leave Balance"
                    />
                  </div>
                  {isCreate && (
                    <div className="col-4 text-end">
                      <Link
                        to="#"
                        className="btn btn-primary"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_add_edit_leave_balance"
                        onClick={() => setMode("add")}
                        style={{ width: "100px" }}
                      >
                        <i className="ti ti-square-rounded-plus me-2" />
                        Create
                      </Link>
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
        label="Leave Balance"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default LeaveBalance;
