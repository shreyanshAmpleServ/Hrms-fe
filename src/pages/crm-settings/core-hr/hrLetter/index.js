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
import { deleteHRLetter, fetchHRLetters } from "../../../../redux/HRLetters";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

const HRLetterList = () => {
  const [mode, setMode] = React.useState("add");
  const [paginationData, setPaginationData] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("ascending");
  const [selected, setSelected] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const { isView, isCreate, isUpdate, isDelete } = usePermissions("HR Letters");

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "hrms_d_employee",
      render: (text) => text?.full_name || "-",
    },
    {
      title: "Letter Type",
      dataIndex: "hr_letter_letter_type",
      render: (text) => text?.letter_name || "-",
    },
    {
      title: "Letter Subject",
      dataIndex: "letter_ subject",
      render: (text, record) => (
        <Link to={`#`}>{record?.letter_subject || "-"}</Link>
      ),
      sorter: (a, b) => a?.letter_subject?.localeCompare(b?.letter_subject),
    },
    {
      title: "Letter Content",
      dataIndex: "letter_content",
      render: (text) => (
        <p
          title={text}
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            width: "200px",
          }}
        >
          {text}
        </p>
      ),
    },

    {
      title: "Document",
      dataIndex: "document_path",
      render: (text) =>
        text ? (
          <a href={text} target="_blank" rel="noopener noreferrer">
            <i className="fa fa-file-pdf"></i> View
          </a>
        ) : (
          "-"
        ),
    },
    {
      title: "Request Date",
      dataIndex: "request_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) =>
        moment(a?.request_date).isBefore(moment(b?.request_date)) ? -1 : 1,
    },
    {
      title: "Issue Date",
      dataIndex: "issue_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) =>
        moment(a?.issue_date).isBefore(moment(b?.issue_date)) ? -1 : 1,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) =>
        text === "P" ? (
          <span className="badge bg-warning">Pending</span>
        ) : text === "A" ? (
          <span className="badge bg-success">Approved</span>
        ) : (
          <span className="badge bg-danger">Rejected</span>
        ),
      sorter: (a, b) => a?.status?.localeCompare(b?.status),
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

  const { hrLetters, loading } = useSelector((state) => state.hrLetters);

  React.useEffect(() => {
    dispatch(fetchHRLetters({ search: searchText }));
  }, [dispatch, searchText]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: hrLetters?.currentPage,
      totalPage: hrLetters?.totalPages,
      totalCount: hrLetters?.totalCount,
      pageSize: hrLetters?.size,
    });
  }, [hrLetters]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchHRLetters({ search: searchText, page: currentPage, size: pageSize })
    );
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = hrLetters?.data || [];
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
  }, [hrLetters, sortOrder]);

  const handleDeleteIndustry = (industry) => {
    setSelected(industry);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selected) {
      dispatch(deleteHRLetter(selected.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - HR Letters</title>
        <meta name="hr letter" content="This is hr letter page of DCC HRMS." />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    HR Letters
                    <span className="count-title">
                      {hrLetters?.totalCount || 0}
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
                    label="Search HR Letters"
                  />
                  {isCreate && (
                    <div className="col-sm-3 d-flex justify-content-end">
                      <Link
                        to="#"
                        className="btn btn-primary"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_add"
                      >
                        <i className="ti ti-square-rounded-plus me-2" />
                        Add HR Letters
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
        initialData={selected}
        setHrLetter={setSelected}
      />
      <DeleteAlert
        label="HR Letters"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default HRLetterList;
