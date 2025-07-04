import "bootstrap-daterangepicker/daterangepicker.css";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../components/common/collapse-header";
import Table from "../../../components/common/dataTable/index";
import DeleteAlert from "./alert/DeleteAlert";

import moment from "moment";

import { Helmet } from "react-helmet-async";
import usePermissions from "../../../components/common/Permissions.js";
import SearchBar from "../../../components/datatable/SearchBar";
import SortDropdown from "../../../components/datatable/SortDropDown";
import { deleteTaxSlab, fetchTaxSlab } from "../../../redux/taxSlab";
import ManageTaxModal from "./modal/ManageTaxModal";

const TaxSlab = () => {
  const { isView, isCreate, isUpdate, isDelete } = usePermissions("Tax Slab");

  const dispatch = useDispatch();
  const columns = [
    {
      title: "Rule Type",
      dataIndex: "rule_type",
      sorter: (a, b) => (a.rule_type || "").localeCompare(b.rule_type || ""),
    },

    {
      title: "Slab Min",
      dataIndex: "slab_min",
      sorter: (a, b) => (a.slab_min || "").localeCompare(b.slab_min || ""),
    },
    {
      title: "Slab Max",
      dataIndex: "slab_max",
      sorter: (a, b) => a.slab_max.localeCompare(b.slab_max),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      sorter: (a, b) => (a.rate || "").localeCompare(b.rate || ""),
    },
    {
      title: "Flat Amount",
      dataIndex: "flat_amount",
      sorter: (a, b) =>
        (a.flat_amount || "").localeCompare(b.flat_amount || ""),
    },
    {
      title: "Formula Text",
      dataIndex: "formula_text",
      sorter: (a, b) =>
        (a.formula_text || "").localeCompare(b.formula_text || ""),
    },
    {
      title: "Effective From",
      dataIndex: "effective_from",
      render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) => new Date(a.validFrom) - new Date(b.validFrom),
    },
    {
      title: "Effective To",
      dataIndex: "effective_to",
      render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) => new Date(a.effective_from) - new Date(b.effective_from),
    },

    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) => new Date(a.createdate) - new Date(b.createdate),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (text) =>
        text === "Y" ? (
          <span className="badge bg-success">Active</span>
        ) : (
          <span className="badge bg-danger">Inactive</span>
        ),
      sorter: (a, b) => (a.is_active || "").localeCompare(b.is_active || ""),
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
                      data-bs-target="#offcanvas_add_edit_tax_setup"
                      onClick={() => {
                        setSelectedTax(record);
                      }}
                    >
                      <i className="ti ti-edit text-blue"></i> Edit
                    </Link>
                  )}
                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteTax(record)}
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

  const { taxSlab: taxs, loading } = useSelector((state) => state.taxSlab);

  React.useEffect(() => {
    dispatch(fetchTaxSlab());
  }, [dispatch]);

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = taxs?.data || [];
    if (searchText) {
      data = data.filter((item) =>
        columns.some((col) =>
          item[col.dataIndex]
            ?.toString()
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
      );
    }
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
  }, [searchText, taxs, columns, sortOrder]);

  const handleDeleteTax = (tax) => {
    setSelectedTax(tax);
    setShowDeleteModal(true);
  };

  const [selectedTax, setSelectedTax] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteData = () => {
    if (selectedTax) {
      dispatch(deleteTaxSlab(selectedTax.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Tax Setup</title>
        <meta name="Tax Setup" content="This is Tax Setup page of DCC HRMS." />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Tax Slab
                    <span className="count-title">
                      {taxs?.data?.length || 0}
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
                    label="Search Tax"
                  />
                  {isCreate && (
                    <div className="col-8">
                      <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end">
                        <Link
                          to="#"
                          className="btn btn-primary"
                          data-bs-toggle="offcanvas"
                          data-bs-target={`#offcanvas_add_edit_tax_setup`}
                          style={{ width: "100px" }}
                        >
                          <i className="ti ti-square-rounded-plus me-2" />
                          Create
                        </Link>{" "}
                      </div>
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
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ManageTaxModal tax={selectedTax} setTax={setSelectedTax} />
      <DeleteAlert
        label="Tax Slab"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedTax={selectedTax}
        onDelete={deleteData}
      />
    </div>
  );
};

export default TaxSlab;
