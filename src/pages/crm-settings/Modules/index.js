import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../components/common/collapse-header";
import Table from "../../../components/common/dataTableNew/index";
import usePermissions from "../../../components/common/Permissions.js";
import AddButton from "../../../components/datatable/AddButton";
import SearchBar from "../../../components/datatable/SearchBar";
import SortDropdown from "../../../components/datatable/SortDropDown";
import { deleteModules, fetchModules } from "../../../redux/Modules";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

const Modules = () => {
  const [mode, setMode] = useState("add");
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [paginationData, setPaginationData] = useState();
  const [selectedModule, setSelectedModule] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { isView, isCreate, isUpdate, isDelete } = usePermissions("Modules");

  const dispatch = useDispatch();
  const columns = [
    {
      title: "Module",
      dataIndex: "module_name",
      sorter: (a, b) => a.module_name.localeCompare(b.module_name),
    },

    {
      title: "Description",
      dataIndex: "description",
      render: (text) => <span className="text-wrap">{text}</span>,
      sorter: (a, b) => a.description.localeCompare(b.description),
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
      sorter: (a, b) => a.is_active.localeCompare(b.is_active),
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
                      data-bs-toggle="modal"
                      data-bs-target="#add_edit_module_modal"
                      onClick={() => {
                        setSelectedModule(record);
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
                      onClick={() => handleDeleteModule(record)}
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

  const { modules, loading, error, success } = useSelector(
    (state) => state.modules
  );

  React.useEffect(() => {
    dispatch(fetchModules({ search: searchText }));
  }, [dispatch, searchText]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: modules?.currentPage,
      totalPage: modules?.totalPages,
      totalCount: modules?.totalCount,
      pageSize: modules?.size,
    });
  }, [modules]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchModules({ search: searchText, page: currentPage, size: pageSize })
    );
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = modules?.data || [];

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
  }, [modules, sortOrder]);

  const handleDeleteModule = (Module) => {
    setSelectedModule(Module);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedModule) {
      dispatch(deleteModules(selectedModule.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Modules</title>
        <meta name="Modules" content="This is Modules page of DCC HRMS." />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Modules
                    <span className="count-title">
                      {modules?.totalCount || 0}
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
                    label="Search modules"
                  />
                  {isCreate && (
                    <div className="col-sm-8">
                      <AddButton
                        label="Create"
                        id="add_edit_module_modal"
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
        initialData={selectedModule}
        setSelectedModule={setSelectedModule}
      />
      <DeleteAlert
        label="Module"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default Modules;
