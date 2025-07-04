import Table from "../../components/common/dataTableNew/index.js";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchpayslip } from "../../redux/payslipViewer";
import DeleteAlert from "./alert/DeleteAlert.js";
import AddEditModal from "./modal/AddEditModal.js";

const PayslipViewer = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedpayslip, setSelectedpayslip] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { payslip, loading } = useSelector((state) => state.payslip || {});

  React.useEffect(() => {
    dispatch(
      fetchpayslip({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: payslip?.currentPage,
      totalPage: payslip?.totalPages,
      totalCount: payslip?.totalCount,
      pageSize: payslip?.size,
    });
  }, [payslip]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchpayslip({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = payslip?.data;

  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Arrear Adjustments"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const columns = [
    {
      title: "Employee",
      dataIndex: "payslip_employee",
      render: (value) => <div>{value?.full_name}</div>,
      sorter: (a, b) =>
        (a.payslip_employee?.full_name || "").localeCompare(
          b.payslip_employee?.full_name || ""
        ),
    },
    {
      title: "Month",
      dataIndex: "month",
      render: (text) => <div>{text}</div>, // You can use moment if it's a date
      sorter: (a, b) => (a.month || "").localeCompare(b.month || ""),
    },
    {
      title: "Year",
      dataIndex: "year",
      render: (text) => <div>{text?.split("-")[0]}</div>,
      sorter: (a, b) => (a.Year || "").localeCompare(b.Year || ""),
    },

    {
      title: <span className="text-nowrap">Net Salary</span>,
      dataIndex: "net_salary",
      render: (text) => `₹ ${parseFloat(text).toFixed(2)}`,

      sorter: (a, b) => parseFloat(a.net_salary) - parseFloat(b.net_salary),
    },
    {
      title: "Gross Salary",
      dataIndex: "gross_salary",
      render: (text) => `₹ ${parseFloat(text).toFixed(2)}`,
      sorter: (a, b) => parseFloat(a.gross_salary) - parseFloat(b.gross_salary),
    },
    {
      title: "Total Earning",
      dataIndex: "total_earnings",
      render: (text) => `₹ ${parseFloat(text).toFixed(2)}`,
      sorter: (a, b) =>
        parseFloat(a.total_earnings) - parseFloat(b.total_earnings),
    },
    {
      title: "Total Deduction",
      dataIndex: "total_deductions",
      render: (text) => `₹ ${parseFloat(text).toFixed(2)}`,
      sorter: (a, b) =>
        parseFloat(a.total_deductions) - parseFloat(b.total_deductions),
    },
    {
      title: <span className="text-nowrap">Pay Summary</span>,
      dataIndex: "pay_component_summary",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Tax Deduction",
      dataIndex: "tax_deductions",
      render: (text) => `₹ ${parseFloat(text).toFixed(2)}`,
      sorter: (a, b) =>
        parseFloat(a.tax_deductions) - parseFloat(b.tax_deductions),
    },
    {
      title: "Loan Deduction",
      dataIndex: "loan_deductions",
      render: (text) => `₹ ${parseFloat(text).toFixed(2)}`,
      sorter: (a, b) =>
        parseFloat(a.loan_deductions) - parseFloat(b.loan_deductions),
    },
    {
      title: "Other Adjustment",
      dataIndex: "other_adjustments",
      render: (text) => `₹ ${parseFloat(text).toFixed(2)}`,
      sorter: (a, b) =>
        parseFloat(a.other_adjustments) - parseFloat(b.other_adjustments),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (text) => <div>{text}</div>,
    },

    {
      title: "Payslip",
      dataIndex: "pdf_path",
      render: (_text, record) => (
        <a
          href={record.pdf_path}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="d-inline-flex align-items-center gap-2 text-decoration-none"
          title="Download Payslip"
        >
          <i className="ti ti-file-invoice fs-5"></i>
          <span>Download</span>
        </a>
      ),
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
                      data-bs-target="#offcanvas_add"
                      onClick={() => setSelectedpayslip(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}

                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeletepayslip(a)}
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

  const handleDeletepayslip = (payslip) => {
    setSelectedpayslip(payslip);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Payslip</title>
        <meta
          name="arrear-adjustments"
          content="This is arrear adjustments page of DCC HRMS."
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
                      Payslip
                      <span className="count-title">{payslip?.totalCount}</span>
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
                          placeholder="Search Payslip"
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
                        scroll={{ x: "max-content" }}
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
        <AddEditModal
          setpayslip={setSelectedpayslip}
          payslip={selectedpayslip}
        />
      </div>
      <DeleteAlert
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        payslipId={selectedpayslip?.id}
      />
    </>
  );
};

export default PayslipViewer;
