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
import {
  deleteassets_type,
  fetchassets_type,
} from "../../../../redux/assetType";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

const AssetTypeMaster = () => {
  const [mode, setMode] = React.useState("add"); // 'add' or 'edit'
  const [paginationData, setPaginationData] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("ascending"); // Sorting
  const [selected, setSelected] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const { isView, isCreate, isUpdate, isDelete } =
    usePermissions("Asset Type Master");

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Asset Type Name",
      dataIndex: "asset_type_name",
      render: (text) => text || "-",
      sorter: (a, b) =>
        (a.asset_type_name || "").localeCompare(b.asset_type_name || ""),
    },
    {
      title: "Depreciation Rate",
      dataIndex: "depreciation_rate",
      sorter: (a, b) =>
        (a.depreciation_rate || "").localeCompare(b.depreciation_rate || ""),
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
    },
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => moment(text).format("DD-MM-YYYY") || "-",
      sorter: (a, b) => (a.createdate || "").localeCompare(b.createdate || ""),
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
                      data-bs-target="#add_edit_assets_type_modal"
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

  const { assets_type, loading } = useSelector(
    (state) => state.assetTypeMaster
  );

  React.useEffect(() => {
    dispatch(fetchassets_type({ search: searchText }));
  }, [dispatch, searchText]);
  React.useEffect(() => {
    setPaginationData({
      currentPage: assets_type?.currentPage,
      totalPage: assets_type?.totalPages,
      totalCount: assets_type?.totalCount,
      pageSize: assets_type?.size,
    });
  }, [assets_type]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchassets_type({
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
    let data = assets_type?.data || [];

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
  }, [searchText, assets_type, columns, sortOrder]);

  const handleDeleteIndustry = (industry) => {
    setSelected(industry);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selected) {
      dispatch(deleteassets_type(selected.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Asset Type</title>
        <meta
          name="AssetTypeList"
          content="This is Asset Type page of DCC HRMS."
        />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Asset Type
                    <span className="count-title">
                      {assets_type?.totalCount || 0}
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
                    label="Search Asset Type"
                  />
                  {isCreate && (
                    <div className="col-sm-8">
                      <AddButton
                        label="Create"
                        id="add_edit_assets_type_modal"
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
        label="Asset Type"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default AssetTypeMaster;
