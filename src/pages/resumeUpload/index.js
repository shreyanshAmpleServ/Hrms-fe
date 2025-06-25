import "bootstrap-daterangepicker/daterangepicker.css";

import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header";
import Table from "../../components/common/dataTableNew/index";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

import moment from "moment";

import { Helmet } from "react-helmet-async";
import AddButton from "../../components/datatable/AddButton";
import SearchBar from "../../components/datatable/SearchBar";
import SortDropdown from "../../components/datatable/SortDropDown";
import {
  deleteresume_upload,
  fetchresume_upload,
} from "../../redux/resumeUpload";

const ResumeUpload = () => {
  const [mode, setMode] = React.useState("add"); // 'add' or 'edit'
  const [paginationData, setPaginationData] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("ascending"); // Sorting
  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Resume Upload"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Candidate",
      dataIndex: "resume_candidate",
      render: (value) => <div>{value?.full_name}</div>,
      sorter: (a, b) =>
        (a.resume_candidate?.full_name || "").localeCompare(
          b.resume_candidate?.full_name || ""
        ),
    },
    // {
    //     title: "Resume",
    //     dataIndex: "resume_path",
    //     render: (_text, record) => (
    //         <Link to={record.resume_path} target="_blank" rel="noopener noreferrer">
    //             View Resume
    //         </Link>
    //     ),
    //     sorter: (a, b) => (a.resume_path || "").localeCompare(b.resume_path || ""),
    // },

    {
      title: "Resume",
      dataIndex: "resume_path",
      render: (_text, record) => (
        <a
          href={record.resume_path}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="d-inline-flex align-items-center gap-2 text-decoration-none"
          title="View or Download PDF"
        >
          <i className="ti ti-file-type-pdf fs-5"></i>
          <span>View </span>
        </a>
      ),
    },

    {
      title: "Uploaded On",
      dataIndex: "uploaded_on",
      render: (text) => moment(text).format("DD-MM-YYYY"),
      sorter: (a, b) => new Date(a.uploaded_on) - new Date(b.uploaded_on),
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
                  {record.resume_path && (
                    <a
                      className="dropdown-item"
                      href={record.resume_path}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="ti ti-download text-success"></i> Download
                    </a>
                  )}

                  {isUpdate && (
                    <Link
                      className="dropdown-item edit-popup"
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#add_edit_resume_upload_modal"
                      onClick={() => {
                        setSelectedIndustry(record);
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

  const { resume_upload, loading } = useSelector(
    (state) => state.resume_upload
  );

  React.useEffect(() => {
    dispatch(fetchresume_upload({ search: searchText }));
  }, [dispatch, searchText]);
  React.useEffect(() => {
    setPaginationData({
      currentPage: resume_upload?.currentPage,
      totalPage: resume_upload?.totalPages,
      totalCount: resume_upload?.totalCount,
      pageSize: resume_upload?.size,
    });
  }, [resume_upload]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchresume_upload({
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
    let data = resume_upload?.data || [];

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
  }, [searchText, resume_upload, columns, sortOrder]);

  const handleDeleteIndustry = (industry) => {
    setSelectedIndustry(industry);
    setShowDeleteModal(true);
  };

  const [selectedIndustry, setSelectedIndustry] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const deleteData = () => {
    if (selectedIndustry) {
      dispatch(deleteresume_upload(selectedIndustry.id));
      // navigate(`/resume_upload`);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Resume Upload</title>
        <meta
          name="DepanrtmentList"
          content="This is resume_upload page of DCC HRMS."
        />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Resume Upload
                    <span className="count-title">
                      {resume_upload?.totalCount || 0}
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
                    label="Search Resume Upload"
                  />
                  {isCreate && (
                    <div className="col-sm-8">
                      <AddButton
                        label="Add Resume Upload"
                        id="add_edit_resume_upload_modal"
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

      <AddEditModal mode={mode} initialData={selectedIndustry} />
      <DeleteAlert
        label="Industry"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedIndustry={selectedIndustry}
        onDelete={deleteData}
      />
    </div>
  );
};

export default ResumeUpload;
