import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header";
import Table from "../../components/common/dataTableNew/index";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import SearchBar from "../../components/datatable/SearchBar";
import SortDropdown from "../../components/datatable/SortDropDown";
import {
  deleteoffer_letter,
  fetchoffer_letter,
} from "../../redux/offerLetters";
import ManageStatus from "./ManageStatus";

const OfferLetters = () => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [mode, setMode] = React.useState("add"); // 'add' or 'edit'
  const [paginationData, setPaginationData] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("ascending"); // Sorting
  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Offer Letter"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const dispatch = useDispatch();

  const columns = [
    // {
    //     title: "Employee ID",
    //     dataIndex: "employee_id",
    //     sorter: (a, b) => a.employee_id.localeCompare(b.employee_id),
    // },
    {
      title: "Employee",
      dataIndex: "offered_employee",
      render: (value) => <div>{value?.full_name}</div>,
      sorter: (a, b) =>
        (a.offered_employee?.full_name || "").localeCompare(
          b.offered_employee?.full_name || ""
        ),
    },

    {
      title: "Offer Date",
      dataIndex: "offer_date",
      render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,
      sorter: (a, b) => new Date(a.offer_date) - new Date(b.offer_date),
    },

    {
      title: "Position",
      dataIndex: "position",
      sorter: (a, b) => a.position.localeCompare(b.position),
    },

    {
      title: "Offered Salary",
      dataIndex: "offered_salary",
      render: (value) => <div>₹ {Number(value).toLocaleString()}</div>,
      sorter: (a, b) => a.offered_salary - b.offered_salary,
    },

    {
      title: "Valid Until",
      dataIndex: "valid_until",
      render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,
      sorter: (a, b) => new Date(a.valid_until) - new Date(b.valid_until),
    },

    {
      title: "Created At",
      dataIndex: "created_date",
      render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,
      sorter: (a, b) => a.created_date.length - b.created_date.length,
    },
    {
      title: "Confirmation Status",
      dataIndex: "status",
      render: (value) => (
        <div
          className={`text-capitalize badge ${
            value === "R"
              ? "bg-warning"
              : value === "A"
                ? "bg-success"
                : value === "P"
                  ? "bg-danger"
                  : "bg-secondary"
          }`}
        >
          {value === "P"
            ? "Pending"
            : value === "A"
              ? "Approved"
              : value === "R"
                ? "Rejected"
                : value || "—"}
        </div>
      ),
      sorter: (a, b) =>
        (a.status || "").localeCompare(b.confirmation_status || ""),
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
                      {record.status === "P"
                        ? "Approve/Reject"
                        : record.status === "R"
                          ? "Pending/Approve"
                          : record.status === "A"
                            ? "Reject/Pending"
                            : "Manage Status"}
                    </Link>
                  )}
                  {isUpdate && (
                    <Link
                      className="dropdown-item edit-popup"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#add_edit_offer_letter_modal"
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

  const { offer_letter, loading } = useSelector((state) => state.offer_letter);

  React.useEffect(() => {
    dispatch(fetchoffer_letter({ search: searchText }));
  }, [dispatch, searchText]);
  React.useEffect(() => {
    setPaginationData({
      currentPage: offer_letter?.currentPage,
      totalPage: offer_letter?.totalPages,
      totalCount: offer_letter?.totalCount,
      pageSize: offer_letter?.size,
    });
  }, [offer_letter]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchoffer_letter({
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
    let data = offer_letter?.data || [];

    if (sortOrder === "ascending") {
      data = [...data].sort((a, b) =>
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? -1 : 1
      );
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) =>
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? 1 : -1
      );
    }
    return data;
  }, [searchText, offer_letter, columns, sortOrder]);

  const handleDelete = (record) => {
    setSelected(record);
    setShowDeleteModal(true);
  };

  const handleDeleteIndustry = (industry) => {
    setSelectedIndustry(industry);
    setShowDeleteModal(true);
  };

  const [selectedIndustry, setSelectedIndustry] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const deleteData = () => {
    if (selectedIndustry) {
      dispatch(deleteoffer_letter(selectedIndustry.id));
      // navigate(`/offer_letter`);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Offer Letters</title>
        <meta
          name="DepanrtmentList"
          content="This is offer_letter page of DCC HRMS."
        />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Offer Letters
                    <span className="count-title">
                      {offer_letter?.totalCount || 0}
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
                  <div className="col-sm-8">
                    <div className="icon-form mb-3 mb-sm-6">
                      <SearchBar
                        searchText={searchText}
                        handleSearch={handleSearch}
                        label="Search Offer Letters"
                      />
                    </div>
                  </div>

                  {/* Add Offer Letter button aligned to the right at the end */}
                  <div className="col-sm-4 ms-auto text-sm-end">
                    {isCreate && (
                      <Link
                        to=""
                        className="btn btn-primary"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#add_edit_offer_letter_modal"
                        onClick={() => setMode("add")}
                      >
                        <i className="ti ti-square-rounded-plus me-2" />
                        Add Offer Letter
                      </Link>
                    )}
                  </div>
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

      <AddEditModal mode={mode} initialData={selected} />
      <DeleteAlert
        label=" Offer Letters"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedIndustry={selectedIndustry}
        onDelete={deleteData}
      />
      <ManageStatus selected={selected} open={open} setOpen={setOpen} />
    </div>
  );
};

export default OfferLetters;
