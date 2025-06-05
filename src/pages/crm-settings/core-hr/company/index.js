import "bootstrap-daterangepicker/daterangepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import CollapseHeader from "../../../../components/common/collapse-header";
import Table from "../../../../components/common/dataTable/index";
import FlashMessage from "../../../../components/common/modals/FlashMessage";
import UnauthorizedImage from "../../../../components/common/UnAuthorized.js";
import DateRangePickerComponent from "../../../../components/datatable/DateRangePickerComponent";
import ExportData from "../../../../components/datatable/ExportData";
import SearchBar from "../../../../components/datatable/SearchBar";
import SortDropdown from "../../../../components/datatable/SortDropDown";
import {
  clearMessages,
  deleteCompany,
  fetchCompany,
} from "../../../../redux/company";
import DeleteAlert from "./alert/DeleteAlert";
import AddCompanyModal from "./modal/AddCompanyModal";
import EditCompanyModal from "./modal/EditCompanyModal";

const Company = () => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState();
  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Company",
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const columns = useMemo(
    () => [
      {
        title: "Company Name",
        dataIndex: "company_name",
        render: (text, record) => (
          <Link to={`/company/${record.id}`}>{record.company_name}</Link>
        ),
        sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      },
      {
        title: "Company Code",
        dataIndex: "company_code",
        sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      },
      {
        title: "Currency Code",
        dataIndex: "currency_code",
        sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      },
      {
        title: "Financial Year Start",
        dataIndex: "financial_year_start",
        render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,
        sorter: (a, b) =>
          new Date(a.financial_year_start) - new Date(b.financial_year_start),
      },
      {
        title: "Address",
        dataIndex: "address",
        sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      },
      {
        title: "Contact Person",
        dataIndex: "contact_person",
        sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      },
      {
        title: "Country Id",
        dataIndex: "country_id",
        sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      },
      {
        title: "Contact Phone",
        dataIndex: "contact_phone",
        sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      },
      {
        title: "Contact Email",
        dataIndex: "contact_email",
        sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      },
      {
        title: "Createdate",
        dataIndex: "createdate",
        render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,
        sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
      },
      {
        title: "Timezone",
        dataIndex: "timezone",
        sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
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
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_edit_company"
                        onClick={() => setSelectedCompany(record)}
                      >
                        <i className="ti ti-edit text-blue"></i> Edit
                      </Link>
                    )}
                    {isDelete && (
                      <Link
                        className="dropdown-item"
                        to="#"
                        onClick={() => handleDeleteCompany(record)}
                      >
                        <i className="ti ti-trash text-danger"></i> Delete
                      </Link>
                    )}
                    {isView && (
                      <Link
                        className="dropdown-item"
                        to={`/company/${record?.id}`}
                      >
                        <i className="ti ti-eye text-blue-light"></i> Preview
                      </Link>
                    )}
                  </div>
                </div>
              ),
            },
          ]
        : []),
    ],
    [isUpdate, isDelete, isView],
  );

  const navigate = useNavigate();
  const { company, loading, error, success } = useSelector(
    (state) => state.company,
  );

  React.useEffect(() => {
    dispatch(fetchCompany({ search: searchText, ...selectedDateRange }));
  }, [dispatch, searchText, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: company?.currentPage,
      totalPage: company?.totalPages,
      totalCount: company?.totalCount,
      pageSize: company?.size,
    });
  }, [company]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchCompany({
        search: searchText,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      }),
    );
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = company?.data || [];

    if (sortOrder === "ascending") {
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdate);
        const dateB = moment(b.createdate);
        return dateA.isBefore(dateB) ? -1 : 1;
      });
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdate);
        const dateB = moment(b.createdate);
        return dateA.isBefore(dateB) ? 1 : -1;
      });
    }
    return data;
  }, [company, sortOrder]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "company");
    XLSX.writeFile(workbook, "company.xlsx");
  }, [filteredData]);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Exported company", 14, 10);
    doc.autoTable({
      head: [columns.map((col) => (col.title !== "Actions" ? col.title : ""))],
      body: filteredData.map((row) =>
        columns.map((col) => row[col.dataIndex] || ""),
      ),
      startY: 20,
    });
    doc.save("company.pdf");
  }, [filteredData, columns]);

  const handleDeleteCompany = (company) => {
    setSelectedCompany(company);
    setShowDeleteModal(true);
  };
  const deleteData = () => {
    if (selectedCompany) {
      dispatch(deleteCompany(selectedCompany.id));
      navigate(`/company`);
      setShowDeleteModal(false);
    }
  };
  return (
    <>
      <Helmet>
        <title>DCC HRMS - Company</title>
        <meta name="Company" content="This is company page of DCC HRMS." />
      </Helmet>
      <div className="page-wrapper">
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
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-8">
                    <h4 className="page-title">
                      Company
                      <span className="count-title">
                        {company?.data?.length || 0}
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
              {/* /Page Header */}
              <div className="card ">
                <div className="card-header">
                  {/* Search */}
                  <div className="row align-items-center">
                    <SearchBar
                      searchText={searchText}
                      handleSearch={handleSearch}
                      label="Search company"
                    />

                    <div className="col-sm-8">
                      {/* Export Start & Add Button */}
                      <ExportData
                        exportToPDF={exportToPDF}
                        exportToExcel={exportToExcel}
                        label="Add Company"
                        isCreate={isCreate}
                        id="offcanvas_add_company"
                      />
                      {/* Export End & Add Button  */}
                    </div>
                  </div>
                  {/* /Search */}
                </div>

                <div className="card-body">
                  {/* Filter */}
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                    <div className="d-flex align-items-center flex-wrap row-gap-2">
                      <SortDropdown
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                      />
                      <DateRangePickerComponent
                        selectedDateRange={selectedDateRange}
                        setSelectedDateRange={setSelectedDateRange}
                      />
                    </div>
                  </div>

                  {isView ? (
                    <div className="table-responsive custom-table">
                      <Table
                        dataSource={filteredData}
                        columns={columns}
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
        <AddCompanyModal />
        <EditCompanyModal company={selectedCompany} />
        <DeleteAlert
          label="Company"
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
          selectedCompany={selectedCompany}
          onDelete={deleteData}
        />
      </div>
    </>
  );
};

export default Company;
