import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header";
import Table from "../../components/common/dataTableNew/index";
import usePermissions from "../../components/common/Permissions.js";
import SearchBar from "../../components/datatable/SearchBar";
import SortDropdown from "../../components/datatable/SortDropDown";
import { deleteLoanMaster, fetchLoanMaster } from "../../redux/LoanMaster";
import DeleteAlert from "./alert/DeleteAlert";
import ManageStatus from "./ManageStatus";
import AddEditModal from "./modal/AddEditModal";

const LoanMaster = () => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [mode, setMode] = React.useState("add"); // 'add' or 'edit'
  const [paginationData, setPaginationData] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("ascending"); // Sorting

  const { isView, isUpdate, isDelete } = usePermissions("Loan Master");

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Loan Code",
      dataIndex: "loan_code",
      render: (value) => value || "0",
      sorter: (a, b) => a.loan_code - b.loan_code,
    },
    {
      title: "Loan Name",
      dataIndex: "loan_name",
      render: (value) => value || "0",
      sorter: (a, b) => a.loan_name - b.loan_name,
    },
    {
      title: "Loan Type",
      dataIndex: "loan_master_loan_type",
      render: (value) => <div>{value?.loan_name || "—"}</div>,
      sorter: (a, b) =>
        (a.loan_types?.loan_name || "").localeCompare(
          b.loan_type?.loan_name || ""
        ),
    },
    {
      title: "Wage Type",
      dataIndex: "wage_type",
      render: (value) => value || "0",
      sorter: (a, b) => a.wage_type - b.wage_type,
    },
    {
      title: "Min Tenure",
      dataIndex: "minimum_tenure",
      render: (value) => value || "0",
      sorter: (a, b) => a.minimum_tenure - b.minimum_tenure,
    },
    {
      title: "Mix tenure",
      dataIndex: "maximum_tenure",
      render: (value) => value || "0",
      sorter: (a, b) => a.maximum_tenure - b.maximum_tenure,
    },
    {
      title: "Tenure Divider",
      dataIndex: "tenure_divider",
      render: (value) => value || "0",
      sorter: (a, b) => a.tenure_divider - b.tenure_divider,
    },
    {
      title: "Min Amount",
      dataIndex: "minimum_amount",
      render: (value) => value || "0",
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Max Amount",
      dataIndex: "maximum_amount",
      render: (value) => value || "0",
      sorter: (a, b) => a.maximum_amount - b.maximum_amount,
    },
    {
      title: " Amount Currency",
      dataIndex: "loan_master_amount_currency",
      render: (value) => value?.currency_code || "—",
      sorter: (a, b) =>
        (a.loan_req_currency?.currency_code || "").localeCompare(
          b.loan_req_currency?.currency_code || ""
        ),
    },

    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) => new Date(a.createdate) - new Date(b.createdate),
    },
    {
      title: "Status",
      dataIndex: "in_active",
      render: (value) =>
        !value ? (
          <span className="badge bg-danger">Inactive</span>
        ) : (
          <span className="badge bg-success">Active</span>
        ),
    },

    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (value) => (
    //     <div
    //       className={`text-capitalize badge ${
    //         value.startsWith("P")
    //           ? "bg-warning"
    //           : value.startsWith("A")
    //             ? "bg-success"
    //             : value.startsWith("R")
    //               ? "bg-danger"
    //               : "bg-secondary"
    //       }`}
    //     >
    //       {value.startsWith("P")
    //         ? "Pending"
    //         : value.startsWith("A")
    //           ? "Approved"
    //           : value.startsWith("R")
    //             ? "Rejected"
    //             : "Pending"}
    //     </div>
    //   ),
    //   sorter: (a, b) => (a.status || "").localeCompare(b.status || ""),
    // },

    ...(isUpdate || isDelete
      ? [
          {
            title: "In-Actions",
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
                      data-bs-target="#add_edit_loan_Master_modal"
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
                      onClick={() => handleDeleteLoanMaster(record)}
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

  const { loanMaster, loading } = useSelector((state) => state.loanMaster);

  React.useEffect(() => {
    dispatch(fetchLoanMaster({ search: searchText }));
  }, [dispatch, searchText]);
  React.useEffect(() => {
    setPaginationData({
      currentPage: loanMaster?.currentPage,
      totalPage: loanMaster?.totalPages,
      totalCount: loanMaster?.totalCount,
      pageSize: loanMaster?.size,
    });
  }, [loanMaster]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchLoanMaster({
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
    let data = loanMaster?.data || [];

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
  }, [searchText, loanMaster, columns, sortOrder]);

  const handleDeleteLoanMaster = (loanMaster) => {
    setSelectedLoanMaster(loanMaster);
    setShowDeleteModal(true);
  };

  const [selectedLoanMaster, setSelectedLoanMaster] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const deleteData = () => {
    if (selectedLoanMaster) {
      dispatch(deleteLoanMaster(selectedLoanMaster.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Loan Master</title>
        <meta
          name="Loan Master"
          content="This is loan Master page of DCC HRMS."
        />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Loan Master
                    <span className="count-title">
                      {loanMaster?.totalCount || 0}
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
                    <div className="icon-form mb-sm-6">
                      <SearchBar
                        searchText={searchText}
                        handleSearch={handleSearch}
                        label="Search Loan Master"
                      />
                    </div>
                  </div>

                  <div className="col-sm-4 justify-content-end d-flex">
                    <Link
                      to=""
                      className="btn btn-primary"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#add_edit_loan_Master_modal"
                      onClick={() => setMode("add")}
                      style={{
                        width: "100px",
                      }}
                    >
                      <i className="ti ti-square-rounded-plus me-2" />
                      Create
                    </Link>
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

      <AddEditModal mode={mode} selected={selected} setSelected={setSelected} />
      <DeleteAlert
        label="Loan Master"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
      <ManageStatus selected={selected} open={open} setOpen={setOpen} />
    </div>
  );
};

export default LoanMaster;
