import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header";
import Table from "../../components/common/dataTableNew/index";
import FlashMessage from "../../components/common/modals/FlashMessage";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";
import moment from "moment";
import { Helmet } from "react-helmet-async";
import SearchBar from "../../components/datatable/SearchBar";
import SortDropdown from "../../components/datatable/SortDropDown";
import {
  clearMessages,
  deleteloanEmi,
  fetchloanEmi,
} from "../../redux/LoanEmi";
import ManageStatus from "./ManageStatus";

const LoanEmi = () => {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [mode, setMode] = React.useState("add"); // 'add' or 'edit'
  const [paginationData, setPaginationData] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("ascending"); // Sorting
  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "loan Emi"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Employee",
      dataIndex: "loan_emi_employee",
      render: (value) => <div>{value?.full_name || "—"}</div>,
      sorter: (a, b) =>
        (a.loanemi_employee?.full_name || "").localeCompare(
          b.loanemi_employee?.full_name || ""
        ),
    },
    // {
    //   title: "Loan Amount",
    //   dataIndex: "loanemi_loan_request",
    //   render: (value) =>
    //     value?.amount ? `₹ ${Number(value.amount).toLocaleString()}` : "—",
    //   sorter: (a, b) =>
    //     Number(a.loanemi_loan_request?.amount || 0) -
    //     Number(b.loanemi_loan_request?.amount || 0),
    // },
    {
      title: "EMI Amount",
      dataIndex: "emi_amount",
      render: (value) => `₹ ${Number(value).toLocaleString()}`,
      sorter: (a, b) => a.emi_amount - b.emi_amount,
    },
    {
      title: "Due Month",
      dataIndex: "loan_emi_payslip",
      render: (value) => value?.month || "—",
      sorter: (a, b) =>
        (a.loanemi_payslip?.month || "").localeCompare(
          b.loanemi_payslip?.month || ""
        ),
    },

    {
      title: "Status",
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
                      data-bs-target="#add_edit_loanEmi_modal"
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

  const { loanEmi, loading, error, success } = useSelector(
    (state) => state.loanEmi
  );
  const Emi = useSelector((state) => state.loanEmi);

  console.log(Emi);

  React.useEffect(() => {
    dispatch(fetchloanEmi({ search: searchText }));
  }, [dispatch, searchText]);
  React.useEffect(() => {
    setPaginationData({
      currentPage: loanEmi?.currentPage,
      totalPage: loanEmi?.totalPages,
      totalCount: loanEmi?.totalCount,
      pageSize: loanEmi?.size,
    });
  }, [loanEmi]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchloanEmi({
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
    let data = loanEmi?.data || [];

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
  }, [searchText, loanEmi, columns, sortOrder]);

  const handleDeleteIndustry = (industry) => {
    setSelectedIndustry(industry);
    setShowDeleteModal(true);
  };

  const [selectedIndustry, setSelectedIndustry] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const deleteData = () => {
    if (selectedIndustry) {
      dispatch(deleteloanEmi(selectedIndustry.id));
      // navigate(`/loanEmi`);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Loan EMI</title>
        <meta name="Loan EMI" content="This is loanEmi page of DCC HRMS." />
      </Helmet>
      <div className="content">
        {error && (
          <FlashMessage
            type="error"
            message={error}
            onClose={() => dispatch(clearMessages())}
          />
        )}
        {success && (
          <FlashMessage
            type="success"
            message={success}
            onClose={() => dispatch(clearMessages())}
          />
        )}

        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Loan EMI
                    <span className="count-title">
                      {loanEmi?.totalCount || 0}
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
                        label="Search lone EMI"
                      />
                    </div>
                  </div>

                  {/* Add Offer Letter button aligned to the right at the end */}
                  <div className="col-sm-2 ms-auto">
                    <Link
                      to=""
                      className="btn btn-primary"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#add_edit_loanEmi_modal"
                      onClick={() => setMode("add")}
                    >
                      <i className="ti ti-square-rounded-plus me-2" />
                      Add Loan EMI
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

      <AddEditModal mode={mode} initialData={selected} />
      <DeleteAlert
        label="lone Emi"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedIndustry={selectedIndustry}
        onDelete={deleteData}
      />
      <ManageStatus selected={selected} open={open} setOpen={setOpen} />
    </div>
  );
};

export default LoanEmi;
