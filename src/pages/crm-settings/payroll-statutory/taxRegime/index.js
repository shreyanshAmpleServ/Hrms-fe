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
import { deletetax_relief, fetchtax_relief } from "../../../../redux/taxRelief";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

const TaxRelief = () => {
  const [mode, setMode] = React.useState("add"); // 'add' or 'edit'
  const [paginationData, setPaginationData] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [selected, setSelected] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [sortOrder, setSortOrder] = React.useState("ascending"); // Sorting
  const { isView, isCreate, isUpdate, isDelete } = usePermissions("Tax Relief");

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Relief Name",
      dataIndex: "relief_name",
      render: (text) => text || "-",
      sorter: (a, b) =>
        (a.relief_name || "").localeCompare(b.relief_name || ""),
    },

    {
      title: "Amount",
      dataIndex: "amount",
      render: (text) => text ?? "-",
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
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
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => moment(text).format("YYYY-MM-DD"),
      sorter: (a, b) => new Date(a.createdate) - new Date(b.createdate),
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
                      data-bs-target="#add_edit_tax_relief_modal"
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

  const { tax_relief, loading } = useSelector((state) => state.taxRelief);

  React.useEffect(() => {
    dispatch(fetchtax_relief({ search: searchText }));
  }, [dispatch, searchText]);
  React.useEffect(() => {
    setPaginationData({
      currentPage: tax_relief?.currentPage,
      totalPage: tax_relief?.totalPages,
      totalCount: tax_relief?.totalCount,
      pageSize: tax_relief?.size,
    });
  }, [tax_relief]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchtax_relief({
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
    let data = tax_relief?.data || [];

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
  }, [searchText, tax_relief, columns, sortOrder]);

  const handleDeleteIndustry = (industry) => {
    setSelected(industry);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selected) {
      dispatch(deletetax_relief(selected.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Tax Relief</title>
        <meta
          name="Tax Relief"
          content="This is tax relief page of DCC HRMS."
        />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Tax Relief
                    <span className="count-title">
                      {tax_relief?.totalCount || 0}
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
                    label="Search Tax Relief"
                  />
                  {isCreate && (
                    <div className="col-sm-8">
                      <AddButton
                        label="Add Tax Relief"
                        id="add_edit_tax_relief_modal"
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
        label="Tax Relief"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default TaxRelief;
