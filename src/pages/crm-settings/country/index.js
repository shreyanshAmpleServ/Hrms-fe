import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../components/common/collapse-header";
import Table from "../../../components/common/dataTable/index";
import AddButton from "../../../components/datatable/AddButton";
import SearchBar from "../../../components/datatable/SearchBar";
import SortDropdown from "../../../components/datatable/SortDropDown";
import { deleteCountry, fetchCountries } from "../../../redux/country";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

const CountriesList = () => {
  const [mode, setMode] = useState("add");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Country"
  )?.[0]?.permissions;
  const isView = allPermissions?.view;
  const isCreate = allPermissions?.create;
  const isUpdate = allPermissions?.update;
  const isDelete = allPermissions?.delete;

  const dispatch = useDispatch();
  const columns = [
    {
      title: "Country Code",
      dataIndex: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Country",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },

    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => <span>{moment(text).format("DD MMM YYYY")}</span>,
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
            render: (_, record) => (
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
                      data-bs-target="#add_edit_country_modal"
                      onClick={() => {
                        setSelectedCountry(record);
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
                      onClick={() => handleDeleteCountry(record)}
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

  React.useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const { countries, loading } = useSelector((state) => state.countries);

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = countries;
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
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? -1 : 1
      );
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) =>
        moment(a.createdDate).isBefore(moment(b.createdDate)) ? 1 : -1
      );
    }
    return data;
  }, [searchText, countries, columns, sortOrder]);

  const handleDeleteCountry = (country) => {
    setSelectedCountry(country);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedCountry) {
      dispatch(deleteCountry(selectedCountry.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Country</title>
        <meta name="Country" content="This is Country page of DCC HRMS." />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Country
                    <span className="count-title">
                      {countries?.length || 0}
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
                    label="Search Country"
                  />
                  {isCreate && (
                    <div className="col-sm-8">
                      <AddButton
                        label="Create"
                        id="add_edit_country_modal"
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
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddEditModal
        mode={mode}
        initialData={selectedCountry}
        setSelected={setSelectedCountry}
      />
      <DeleteAlert
        label="Country"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default CountriesList;
