import "bootstrap-daterangepicker/daterangepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import CollapseHeader from "../../../components/common/collapse-header";
import Table from "../../../components/common/dataTableNew/index";
import AddButton from "../../../components/datatable/AddButton";
import SearchBar from "../../../components/datatable/SearchBar";
import SortDropdown from "../../../components/datatable/SortDropDown";
import { fetchCountries } from "../../../redux/country";
import { deleteState, fetchStates } from "../../../redux/state";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

const StatesList = () => {
  const [mode, setMode] = useState("add");
  const [countryId, setCountryId] = useState();
  const [paginationData, setPaginationData] = useState();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [selectedState, setSelectedState] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "State"
  )?.[0]?.permissions;
  const isView = allPermissions?.view;
  const isCreate = allPermissions?.create;
  const isUpdate = allPermissions?.update;
  const isDelete = allPermissions?.delete;

  const dispatch = useDispatch();

  const columns = [
    {
      title: "State Name",
      dataIndex: "name",
      render: (text) => <div>{text}</div>,
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      title: "Country",
      dataIndex: "country_details",
      render: (text) => text.name,
      sorter: (a, b) =>
        (a.country_details?.name || "").localeCompare(
          b.country_details?.name || ""
        ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (text) => (
        <span className={`badge ${text === "Y" ? "bg-success" : "bg-danger"}`}>
          {text === "Y" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) => new Date(a.createdate) - new Date(b.createdate),
    },
    ...(isUpdate || isDelete
      ? [
          {
            title: "Actions",
            dataIndex: "actions",
            render: (text, record) => (
              <div className="dropdown table-action">
                <button
                  className="action-icon btn btn-link"
                  data-bs-toggle="dropdown"
                  aria-expanded="true"
                >
                  <i className="fa fa-ellipsis-v"></i>
                </button>
                <div className="dropdown-menu dropdown-menu-end">
                  {isUpdate && (
                    <button
                      className="dropdown-item edit-popup"
                      data-bs-toggle="modal"
                      data-bs-target="#add_edit_state_modal"
                      onClick={() => {
                        console.log("Editing record:", record);
                        setSelectedState(record);
                        setMode("edit");
                      }}
                    >
                      <i className="ti ti-edit text-blue"></i> Edit
                    </button>
                  )}
                  {isDelete && (
                    <button
                      className="dropdown-item"
                      onClick={() => handleDeleteState(record)}
                    >
                      <i className="ti ti-trash text-danger"></i> Delete
                    </button>
                  )}
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  const { states, loading } = useSelector((state) => state.states);

  React.useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(fetchStates({ search: searchText, country_id: countryId?.value }));
  }, [dispatch, countryId, searchText]);
  React.useEffect(() => {
    setPaginationData({
      currentPage: states?.currentPage,
      totalPage: states?.totalPages,
      totalCount: states?.totalCount,
      pageSize: states?.size,
    });
  }, [states]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchStates({
        search: searchText,
        country_id: countryId?.value,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const { countries } = useSelector((state) => state.countries);

  const countryList = [
    { label: "All", value: "" },
    ...countries?.map((i) => ({ label: i?.name, value: i?.id })),
  ];

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = states?.data || [];
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
  }, [searchText, states, sortOrder]);

  const handleDeleteState = (state) => {
    setSelectedState(state);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedState) {
      dispatch(deleteState(selectedState.id));
      setShowDeleteModal(false);
    }
  };

  console.log("countryId", countryId);

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - States</title>
        <meta name="States" content="This is States page of DCC HRMS." />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    States
                    <span className="count-title">
                      {states?.totalCount || 0}
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
                    label="Search States"
                  />
                  {isCreate && (
                    <div className="col-sm-8">
                      <AddButton
                        label="Add State"
                        id="add_edit_state_modal"
                        setMode={() => setMode("add")}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2">
                    <SortDropdown
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2">
                    <Select
                      className="select"
                      placeholder="Select Country"
                      options={countryList}
                      value={countryId}
                      classNamePrefix="react-select"
                      onChange={(value) => setCountryId(value)}
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
        initialData={selectedState}
        setSelectedState={setSelectedState}
      />
      <DeleteAlert
        label="State"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedState={selectedState}
        onDelete={deleteData}
      />
    </div>
  );
};

export default StatesList;
