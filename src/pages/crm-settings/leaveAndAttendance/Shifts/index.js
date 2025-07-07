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
import { deleteShift, fetchShift } from "../../../../redux/Shift";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";
import usePermissions from "../../../../components/common/Permissions.js";

const ShiftList = () => {
  const [mode, setMode] = useState("add"); // 'add' or 'edit'
  const [selected, setSelected] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
  const [paginationData, setPaginationData] = useState();

  const { isView, isCreate, isUpdate, isDelete } = usePermissions("Shift");

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Shift Name",
      dataIndex: "shift_name",
      render: (text) => <div>{text}</div>,
      sorter: (a, b) => a.shift_name.localeCompare(b.shift_name),
    },
    {
      title: "Working Hours",
      dataIndex: "daily_working_hours",
      render: (text) => <div>{text}</div>,
      sorter: (a, b) =>
        a.daily_working_hours.localeCompare(b.daily_working_hours),
    },
    {
      title: "Working Days",
      dataIndex: "number_of_working_days",
      render: (text) => <div>{text ? text + " Days" : "-"}</div>,
      sorter: (a, b) =>
        a.number_of_working_days.localeCompare(b.number_of_working_days),
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      render: (text) => (text ? text.slice(0, 5) : "-"),
      sorter: (a, b) => a.start_time.localeCompare(b.start_time),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      render: (text) => (text ? text.slice(0, 5) : "-"),
      sorter: (a, b) => a.end_time.localeCompare(b.end_time),
    },
    {
      title: "Lunch Time",
      dataIndex: "lunch_time",
      render: (text) => (text ? text + " Mins" : "-"),
      sorter: (a, b) => a.lunch_time.localeCompare(b.lunch_time),
    },

    {
      title: "Half Day On",
      dataIndex: "half_day_on",
      render: (text) =>
        text === 1
          ? "Monday"
          : text === 2
            ? "Tuesday"
            : text === 3
              ? "Wednesday"
              : text === 4
                ? "Thursday"
                : text === 5
                  ? "Friday"
                  : text === 6
                    ? "Saturday"
                    : "Sunday",
      sorter: (a, b) => a.half_day_on.localeCompare(b.half_day_on),
    },
    {
      title: "Half Day Working",
      dataIndex: "half_day_working",
      render: (text) => <div>{text === "Y" ? "Yes" : "No"}</div>,
      sorter: (a, b) => a.half_day_working.localeCompare(b.half_day_working),
    },
    {
      title: "Week Off Days",
      dataIndex: "weekoff_days",
      render: (text) => <div>{text || "-"}</div>,
      sorter: (a, b) => a.weekoff_days.localeCompare(b.weekoff_days),
    },

    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (text) => (
        <p
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            maxWidth: "300px",
          }}
        >
          {text || "-"}
        </p>
      ),
      sorter: (a, b) => a.remarks.localeCompare(b.remarks),
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
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) => new Date(a.createdate) - new Date(b.createdate),
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
                      data-bs-target="#add_edit_shift_modal"
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

  const { shift, loading } = useSelector((state) => state.shift);

  React.useEffect(() => {
    dispatch(fetchShift({ search: searchText }));
  }, [dispatch, searchText]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: shift?.currentPage,
      totalPage: shift?.totalPages,
      totalCount: shift?.totalCount,
      pageSize: shift?.size,
    });
  }, [shift]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchShift({ search: searchText, page: currentPage, size: pageSize })
    );
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = shift?.data || [];

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
  }, [shift, sortOrder]);

  const handleDeleteIndustry = (industry) => {
    setSelected(industry);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selected) {
      dispatch(deleteShift(selected.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Shift</title>
        <meta name="Shift" content="This is Shift page of DCC HRMS." />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Shift
                    <span className="count-title">
                      {shift?.data?.length || 0}
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
                    label="Search Shift"
                  />
                  {isCreate && (
                    <div className="col-sm-8">
                      <AddButton
                        label="Create"
                        id="add_edit_shift_modal"
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
        label="Shift"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default ShiftList;
