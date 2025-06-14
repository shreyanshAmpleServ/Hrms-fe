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
import AddButton from "../../components/datatable/AddButton";
import SearchBar from "../../components/datatable/SearchBar";
import SortDropdown from "../../components/datatable/SortDropDown";
import {
  clearMessages,
  deleteloan_requests,
  fetchloan_requests,
} from "../../redux/loanRequests";

const LoanRequests = () => {
  const [mode, setMode] = React.useState("add"); // 'add' or 'edit'
  const [paginationData, setPaginationData] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("ascending"); // Sorting
  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Manufacturer",
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
      dataIndex: "loan_req_employee",
      render: (value) => <div>{value?.full_name}</div>,
      sorter: (a, b) =>
        (a.loan_req_employee?.full_name || "").localeCompare(
          b.loan_req_employee?.full_name || "",
        ),
    },
    {
      title: "Loan Type",
      dataIndex: "loan_types",
      render: (value) => <div>{value?.loan_name || "—"}</div>, // assuming loan_types is an object with loan_name
      sorter: (a, b) =>
        (a.loan_types?.loan_name || "").localeCompare(
          b.loan_type?.loan_name || "",
        ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (value) => <div>₹ {Number(value).toLocaleString()}</div>,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "EMI Months",
      dataIndex: "emi_months",
      sorter: (a, b) => a.emi_months - b.emi_months,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => <div>{value || "Pending"}</div>,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Requested On",
      dataIndex: "request_date",
      render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,
      sorter: (a, b) => new Date(a.request_date) - new Date(b.request_date),
    },
    ...(isUpdate || isDelete
      ? [
          {
            title: "Actions",
            dataIndex: "actions",
            render: (_text, record) => (
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
                      data-bs-target="#add_edit_loan_requests_modal"
                      onClick={() => {
                        setSelectedIndustry(record);
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

  const { loan_requests, loading, error, success } = useSelector(
    (state) => state.loan_requests,
  );

  React.useEffect(() => {
    dispatch(fetchloan_requests({ search: searchText }));
  }, [dispatch, searchText]);
  React.useEffect(() => {
    setPaginationData({
      currentPage: loan_requests?.currentPage,
      totalPage: loan_requests?.totalPages,
      totalCount: loan_requests?.totalCount,
      pageSize: loan_requests?.size,
    });
  }, [loan_requests]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchloan_requests({
        search: searchText,
        page: currentPage,
        size: pageSize,
      }),
    );
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = loan_requests?.data || [];

    if (sortOrder === "ascending") {
      data = [...data].sort((a, b) =>
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? -1 : 1,
      );
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) =>
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? 1 : -1,
      );
    }
    return data;
  }, [searchText, loan_requests, columns, sortOrder]);

  const handleDeleteIndustry = (industry) => {
    setSelectedIndustry(industry);
    setShowDeleteModal(true);
  };

  const [selectedIndustry, setSelectedIndustry] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const deleteData = () => {
    if (selectedIndustry) {
      dispatch(deleteloan_requests(selectedIndustry.id));
      // navigate(`/loan_requests`);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Loan Requests</title>
        <meta
          name="DepanrtmentList"
          content="This is loan_requests page of DCC HRMS."
        />
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
                    Loan Requests
                    <span className="count-title">
                      {loan_requests?.totalCount || 0}
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
                        label="Search lone Requests"
                      />
                    </div>
                  </div>

                  {/* Add Offer Letter button aligned to the right at the end */}
                  <div className="col-sm-2 ms-auto">
                    <Link
                      to=""
                      className="btn btn-primary"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#add_edit_loan_requests_modal"
                      onClick={() => setMode("add")}
                    >
                      <i className="ti ti-square-rounded-plus me-2" />
                      Add Offer Letter
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

      <AddEditModal mode={mode} initialData={selectedIndustry} />
      <DeleteAlert
        label="Industry"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedIndustry={selectedIndustry}
        onDelete={deleteData}
      />
    </div>
  );
};

export default LoanRequests;
