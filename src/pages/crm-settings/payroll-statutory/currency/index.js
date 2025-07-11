import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../../components/common/collapse-header";
import Table from "../../../../components/common/dataTableNew/index";
import usePermissions from "../../../../components/common/Permissions.js";
import AddButton from "../../../../components/datatable/AddButton";
import SearchBar from "../../../../components/datatable/SearchBar";
import SortDropdown from "../../../../components/datatable/SortDropDown";
import { deleteCurrencies, fetchCurrencies } from "../../../../redux/currency";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

const CurrenciesList = () => {
  const [mode, setMode] = React.useState("add");
  const [paginationData, setPaginationData] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("ascending");
  const [selected, setSelected] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const { isView, isCreate, isUpdate, isDelete } = usePermissions("Currency");

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Currency Name",
      dataIndex: "currency_name",
      render: (_text, record) => (
        <Link to={`#`}>{record.currency_name || "-"}</Link>
      ),
      sorter: (a, b) =>
        (a.currency_name || "").localeCompare(b.currency_name || ""),
    },
    {
      title: "Currency Code",
      dataIndex: "currency_code",
      render: (_text, record) => (
        <Link to={`#`}>{record.currency_code || "-"}</Link>
      ),
      sorter: (a, b) =>
        (a.currency_code || "").localeCompare(b.currency_code || ""),
    },
    {
      title: "Created Date",
      dataIndex: "create_date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
      sorter: (a, b) => new Date(a.create_date) - new Date(b.create_date),
    },
    {
      title: "Status",
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
                      data-bs-toggle="modal"
                      data-bs-target="#add_edit_currencies_modal"
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

  const { currencies, loading } = useSelector((state) => state.currencies);

  React.useEffect(() => {
    dispatch(fetchCurrencies({ search: searchText, page: 1, size: 10 }));
  }, [dispatch, searchText]);
  React.useEffect(() => {
    setPaginationData({
      currentPage: currencies?.currentPage,
      totalPage: currencies?.totalPages,
      totalCount: currencies?.totalCount,
      pageSize: currencies?.size,
    });
  }, [currencies]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchCurrencies({
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
    let data = currencies?.data || [];

    if (data && sortOrder === "ascending") {
      data = [...data].sort((a, b) =>
        moment(a.create_date).isBefore(moment(b.create_date)) ? -1 : 1
      );
    } else if (data && sortOrder === "descending") {
      data = [...data].sort((a, b) =>
        moment(a.create_date).isBefore(moment(b.create_date)) ? 1 : -1
      );
    }
    return data;
  }, [searchText, currencies, columns, sortOrder]);

  const handleDeleteIndustry = (industry) => {
    setSelected(industry);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selected) {
      dispatch(deleteCurrencies(selected.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Currency</title>
        <meta
          name="DepanrtmentList"
          content="This is currencies page of DCC HRMS."
        />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Currency
                    <span className="count-title">
                      {currencies?.totalCount || 0}
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
                    label="Search Currency"
                  />
                  {isCreate && (
                    <div className="col-sm-8">
                      <AddButton
                        label="Create "
                        id="add_edit_currencies_modal"
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
        label="Currency"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default CurrenciesList;
