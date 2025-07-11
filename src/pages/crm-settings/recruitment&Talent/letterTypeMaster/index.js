import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React, { useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../../components/common/collapse-header";
import Table from "../../../../components/common/dataTableNew/index";
import AddButton from "../../../../components/datatable/AddButton";
import SearchBar from "../../../../components/datatable/SearchBar";
import SortDropdown from "../../../../components/datatable/SortDropDown";
import {
  deletelatter_type,
  fetchlatter_type,
} from "../../../../redux/letterType";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";
import { Button } from "antd";
import {
  FileExcelFilled,
  FileFilled,
  FileImageFilled,
  FilePdfFilled,
  FileWordFilled,
} from "@ant-design/icons";

const LetterTypeMaster = () => {
  const [mode, setMode] = React.useState("add");
  const [paginationData, setPaginationData] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("ascending");
  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Letter Type Master"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const dispatch = useDispatch();

  const handleDownload = (url, filename) => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream", // Treat as a binary file
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", filename || "file.jpg"); // Force download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Download failed:", error));
  };

  const columns = [
    {
      title: "Letter Type Name",
      dataIndex: "letter_name",
      render: (text) => text || "-",
      sorter: (a, b) =>
        (a.letter_name || "").localeCompare(b.letter_name || ""),
    },
    {
      title: "Attachment",
      dataIndex: "template_path",
      render: (text) => {
        return text ? (
          <a
            href={text}
            target="_blank"
            rel="noreferrer"
            className="d-flex align-items-center gap-2"
          >
            {text.split(".").pop()?.toLowerCase() === "pdf" ? (
              <Button className="rounded-circle bg-danger p-2">
                <FilePdfFilled />
              </Button>
            ) : text.split(".").pop()?.toLowerCase() === "jpg" ||
              text.split(".").pop()?.toLowerCase() === "jpeg" ||
              text.split(".").pop()?.toLowerCase() === "png" ? (
              <Button className="rounded-circle bg-primary p-2">
                <FileImageFilled />
              </Button>
            ) : text.split(".").pop()?.toLowerCase() === "doc" ||
              text.split(".").pop()?.toLowerCase() === "docx" ? (
              <Button className="rounded-circle bg-success p-2">
                <FileWordFilled />
              </Button>
            ) : text.split(".").pop()?.toLowerCase() === "xls" ||
              text.split(".").pop()?.toLowerCase() === "xlsx" ? (
              <Button className="rounded-circle bg-success p-2">
                <FileExcelFilled />
              </Button>
            ) : (
              <Button className="rounded-circle bg-primary p-2">
                <FileFilled />
              </Button>
            )}
            {text.split("/").pop().split("-").pop()}
          </a>
        ) : (
          <p className="text-danger">No Document</p>
        );
      },
      sorter: (a, b) =>
        (a.template_path || "").localeCompare(b.template_path || ""),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (text) => (
        <>
          {text === "Y" ? (
            <span className="badge badge-pill badge-status bg-success">
              Active
            </span>
          ) : (
            <span className="badge badge-pill badge-status bg-danger">
              Inactive
            </span>
          )}
        </>
      ),
      sorter: (a, b) => a.is_active.localeCompare(b.is_active),
    },
    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
      sorter: (a, b) =>
        moment(a.createdate).unix() - moment(b.createdate).unix(),
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
                      data-bs-target="#add_edit_latter_type_modal"
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

  const { latter_type, loading } = useSelector(
    (state) => state.letterTypeMaster
  );

  React.useEffect(() => {
    dispatch(fetchlatter_type({ search: searchText }));
  }, [dispatch, searchText]);
  React.useEffect(() => {
    setPaginationData({
      currentPage: latter_type?.currentPage,
      totalPage: latter_type?.totalPages,
      totalCount: latter_type?.totalCount,
      pageSize: latter_type?.size,
    });
  }, [latter_type]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchlatter_type({
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
    let data = latter_type?.data || [];

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
  }, [searchText, latter_type, columns, sortOrder]);

  const handleDeleteIndustry = (industry) => {
    setSelected(industry);
    setShowDeleteModal(true);
  };

  const [selected, setSelected] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const deleteData = () => {
    if (selected) {
      dispatch(deletelatter_type(selected.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS -Letter Type</title>
        <meta
          name="DepanrtmentList"
          content="This is latter_type page of DCC HRMS."
        />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Letter Type
                    <span className="count-title">
                      {latter_type?.totalCount || 0}
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
                    label="Search Letter Type"
                  />
                  {isCreate && (
                    <div className="col-sm-8">
                      <AddButton
                        label="Create"
                        id="add_edit_latter_type_modal"
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
        label="Letter Type"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default LetterTypeMaster;
