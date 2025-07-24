import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../../components/common/collapse-header";
import Table from "../../../../components/common/dataTableNew/index";
import usePermissions from "../../../../components/common/Permissions.js";
import SearchBar from "../../../../components/datatable/SearchBar";
import SortDropdown from "../../../../components/datatable/SortDropDown";
import {
  deletepay_component,
  fetchpay_component,
} from "../../../../redux/pay-component";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

const Paycomponent = () => {
  const [mode, setMode] = React.useState("add");
  const [paginationData, setPaginationData] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("ascending");
  const [selected, setSelected] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const { isView, isCreate, isUpdate, isDelete } =
    usePermissions("Pay Component");

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Name",
      dataIndex: "component_name",
      render: (text, record) =>
        (
          <Link
            to="#"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvas_add"
            onClick={() => {
              setSelected(record);
              setMode("edit");
            }}
          >
            {text}
          </Link>
        ) || "-",
      sorter: (a, b) =>
        (a.component_name || "").localeCompare(b.component_name || ""),
    },
    {
      title: "Code",
      dataIndex: "component_code",
      render: (text, record) =>
        (
          <Link
            to="#"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvas_add"
            onClick={() => {
              setSelected(record);
              setMode("edit");
            }}
          >
            {text}
          </Link>
        ) || "-",
      sorter: (a, b) =>
        (a.component_code || "").localeCompare(b.component_code || ""),
    },
    {
      title: "Type",
      dataIndex: "component_type",
      render: (text) =>
        text?.slice(0, 1) === "E"
          ? "EARNING"
          : text?.slice(0, 1) === "D"
            ? "DEDUCTION"
            : text?.slice(0, 1) === "A"
              ? "ALLOWANCE"
              : text?.slice(0, 1) === "B"
                ? "BONUS"
                : text?.slice(0, 1) === "O"
                  ? "OVERTIME"
                  : "-",
      sorter: (a, b) =>
        (a.component_type || "").localeCompare(b.component_type || ""),
    },
    {
      title: "Auto Fill",
      dataIndex: "auto_fill",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) => (a.auto_fill || "").localeCompare(b.auto_fill || ""),
    },

    {
      title: "Is Taxable?",
      dataIndex: "is_taxable",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) => (a.is_taxable || "").localeCompare(b.is_taxable || ""),
    },
    {
      title: "Is Statutory?",
      dataIndex: "is_statutory",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) =>
        (a.is_statutory || "").localeCompare(b.is_statutory || ""),
    },
    {
      title: "Is Recurring?",
      dataIndex: "is_recurring",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) =>
        (a.is_recurring || "").localeCompare(b.is_recurring || ""),
    },
    {
      title: "Is Advance?",
      dataIndex: "is_advance",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) => (a.is_advance || "").localeCompare(b.is_advance || ""),
    },
    {
      title: "Is Basic Salary?",
      dataIndex: "is_basic",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) => (a.is_basic || "").localeCompare(b.is_basic || ""),
    },
    {
      title: "Is Grossable?",
      dataIndex: "is_grossable",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) =>
        (a.is_grossable || "").localeCompare(b.is_grossable || ""),
    },
    {
      title: "Is Overtime Related?",
      dataIndex: "is_overtime_related",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) =>
        (a.is_overtime_related || "").localeCompare(
          b.is_overtime_related || ""
        ),
    },
    {
      title: "Is Worklife Related?",
      dataIndex: "is_worklife_related",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) =>
        (a.is_worklife_related || "").localeCompare(
          b.is_worklife_related || ""
        ),
    },
    {
      title: "Is Unpaid Leave?",
      dataIndex: "unpaid_leave",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) =>
        (a.unpaid_leave || "").localeCompare(b.unpaid_leave || ""),
    },
    {
      title: "Is Contributes to NSSF?",
      dataIndex: "contributes_to_nssf",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) =>
        (a.contributes_to_nssf || "").localeCompare(
          b.contributes_to_nssf || ""
        ),
    },
    {
      title: "Is Contributes to PayE?",
      dataIndex: "contributes_to_paye",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) =>
        (a.contributes_to_paye || "").localeCompare(
          b.contributes_to_paye || ""
        ),
    },
    {
      title: "Contribution to Employee",
      dataIndex: "contribution_of_employee",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) =>
        (a.contribution_of_employee || "").localeCompare(
          b.contribution_of_employee || ""
        ),
    },
    {
      title: "GL Account",
      dataIndex: "gl_account_id",
      render: (text) => text || "-",
      sorter: (a, b) =>
        (a.gl_account_id || "").localeCompare(b.gl_account_id || ""),
    },
    {
      title: "Project",
      dataIndex: "project_id",
      render: (text) => text || "-",
      sorter: (a, b) => (a.project_id || "").localeCompare(b.project_id || ""),
    },
    {
      title: "Tax Code",
      dataIndex: "tax_code_id",
      render: (text) => text || "-",
      sorter: (a, b) =>
        (a.tax_code_id || "").localeCompare(b.tax_code_id || ""),
    },
    {
      title: "Payable GL Account",
      dataIndex: "payable_glaccount_id",
      render: (text) => text || "-",
      sorter: (a, b) =>
        (a.payable_glaccount_id || "").localeCompare(
          b.payable_glaccount_id || ""
        ),
    },
    {
      title: "Pay or Deduct",
      dataIndex: "pay_or_deduct",
      render: (text) => (text === "P" ? "Pay" : "Deduct") || "-",
      sorter: (a, b) =>
        (a.pay_or_deduct || "").localeCompare(b.pay_or_deduct || ""),
    },
    {
      title: "Factor",
      dataIndex: "factor",
      render: (text) => text || "-",
      sorter: (a, b) => (a.factor || "").localeCompare(b.factor || ""),
    },
    {
      title: "Execution Order",
      dataIndex: "execution_order",
      render: (text) => text || "-",
      sorter: (a, b) =>
        (a.execution_order || "").localeCompare(b.execution_order || ""),
    },
    {
      title: "Formula Editable",
      dataIndex: "formula_editable",
      render: (text) => (text === "Y" ? "Yes" : "No") || "-",
      sorter: (a, b) =>
        (a.formula_editable || "").localeCompare(b.formula_editable || ""),
    },
    {
      title: "Default Formula",
      dataIndex: "default_formula",
      render: (text) => text || "-",
      sorter: (a, b) =>
        (a.default_formula || "").localeCompare(b.default_formula || ""),
    },
    {
      title: "Employer Default Formula",
      dataIndex: "employer_default_formula",
      render: (text) => text || "-",
      sorter: (a, b) =>
        (a.employer_default_formula || "").localeCompare(
          b.employer_default_formula || ""
        ),
    },
    {
      title: "Cost Center 1",
      dataIndex: "pay_component_cost_center1",
      render: (text) => text?.name || "-",
      sorter: (a, b) =>
        (a.pay_component_cost_center1?.name || "").localeCompare(
          b.pay_component_cost_center1?.name || ""
        ),
    },
    {
      title: "Cost Center 2",
      dataIndex: "pay_component_cost_center2",
      render: (text) => text?.name || "-",
      sorter: (a, b) =>
        (a.pay_component_cost_center2?.name || "").localeCompare(
          b.pay_component_cost_center2?.name || ""
        ),
    },
    {
      title: "Cost Center 3",
      dataIndex: "pay_component_cost_center3",
      render: (text) => text?.name || "-",
      sorter: (a, b) =>
        (a.pay_component_cost_center3?.name || "").localeCompare(
          b.pay_component_cost_center3?.name || ""
        ),
    },
    {
      title: "Cost Center 4",
      dataIndex: "pay_component_cost_center4",
      render: (text) => text?.name || "-",
      sorter: (a, b) =>
        (a.pay_component_cost_center4?.name || "").localeCompare(
          b.pay_component_cost_center4?.name || ""
        ),
    },
    {
      title: "Cost Center 5",
      dataIndex: "pay_component_cost_center5",
      render: (text) => text?.name || "-",
      sorter: (a, b) =>
        (a.pay_component_cost_center5?.name || "").localeCompare(
          b.pay_component_cost_center5?.name || ""
        ),
    },
    {
      title: "Is Active?",
      dataIndex: "is_active",
      render: (text) => (
        <div>
          {text === "Y" ? (
            <span className="badge badge-pill badge-status bg-success">
              Active
            </span>
          ) : (
            <span className="badge badge-pill badge-status bg-danger">
              Inactive
            </span>
          )}
        </div>
      ),
      sorter: (a, b) => (a.is_active || "").localeCompare(b.is_active || ""),
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
                      data-bs-target="#offcanvas_add"
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

  const { pay_component, loading } = useSelector((state) => state.payComponent);

  React.useEffect(() => {
    dispatch(fetchpay_component({ search: searchText }));
  }, [dispatch, searchText]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: pay_component?.currentPage,
      totalPage: pay_component?.totalPages,
      totalCount: pay_component?.totalCount,
      pageSize: pay_component?.size,
    });
  }, [pay_component]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchpay_component({
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
    let data = pay_component?.data || [];

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
  }, [searchText, pay_component, columns, sortOrder]);

  const handleDeleteIndustry = (industry) => {
    setSelected(industry);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selected) {
      dispatch(deletepay_component(selected.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Pay Component</title>
        <meta
          name="Pay Component"
          content="This is pay_component page of DCC HRMS."
        />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Pay Component
                    <span className="count-title">
                      {pay_component?.totalCount || 0}
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
                <div className="row align-items-center justify-content-between">
                  <SearchBar
                    searchText={searchText}
                    handleSearch={handleSearch}
                    label="Search Pay Component..."
                  />
                  {isCreate && (
                    <div className="col-sm-4 d-flex justify-content-end">
                      <Link
                        to="#"
                        className="btn btn-primary"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_add"
                        style={{ width: "100px" }}
                        onClick={() => {
                          setMode("add");
                        }}
                      >
                        <i className="ti ti-square-rounded-plus me-2" /> Create
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
        setMode={setMode}
        initialData={selected}
        setSelected={setSelected}
      />
      <DeleteAlert
        label="Pay Component"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default Paycomponent;
