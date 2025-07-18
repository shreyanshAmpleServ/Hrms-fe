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
import { deletebranch, fetchbranch } from "../../../../redux/branch";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";
import usePermissions from "../../../../components/common/Permissions.js";

const BranchList = () => {
  const [mode, setMode] = React.useState("add"); // 'add' or 'edit'
  const [paginationData, setPaginationData] = React.useState();
  const [searchText, setSearchText] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("ascending"); // Sorting
  const [selectedIndustry, setSelectedIndustry] = React.useState(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const { isView, isCreate, isUpdate, isDelete } = usePermissions("Branch");

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Branch Name",
      dataIndex: "branch_name",
      render: (_, record) => <Link to={`#`}>{record?.branch_name}</Link>,
      sorter: (a, b) => a.branch_name.localeCompare(b.branch_name),
    },
    {
      title: "Company Name",
      dataIndex: "branch_company",
      render: (text) => text?.company_name || "-",
    },
    {
      title: "Company Code",
      dataIndex: "branch_company",
      render: (text) => text?.company_code || "-",
    },
    {
      title: "Location",
      dataIndex: "location",
      render: (_, record) => <Link to={`#`}>{record?.location || "-"}</Link>,
      sorter: (a, b) => a.location.localeCompare(b.location),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (_, record) =>
        record?.is_active === "Y" ? (
          <span className="badge bg-success">Active</span>
        ) : (
          <span className="badge bg-danger">Inactive</span>
        ),
    },
    {
      title: "Created Date",
      dataIndex: "createddate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
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
                      data-bs-target="#add_edit_branch_modal"
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

  const { branch, loading } = useSelector((state) => state.branch);

  React.useEffect(() => {
    dispatch(fetchbranch({ search: searchText }));
  }, [dispatch, searchText]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: branch?.currentPage,
      totalPage: branch?.totalPages,
      totalCount: branch?.totalCount,
      pageSize: branch?.size,
    });
  }, [branch]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchbranch({ search: searchText, page: currentPage, size: pageSize })
    );
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = branch?.data || [];
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
  }, [branch, sortOrder]);

  const handleDeleteIndustry = (industry) => {
    setSelectedIndustry(industry);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedIndustry) {
      dispatch(deletebranch(selectedIndustry.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Branch</title>
        <meta name="branch" content="This is banks page of DCC HRMS." />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Branch
                    <span className="count-title">
                      {branch?.totalCount || 0}
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
                    label="Search Branch"
                  />
                  {isCreate && (
                    <div className="col-sm-8">
                      <AddButton
                        label="Add Branch"
                        id="add_edit_branch_modal"
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
        label="Branch"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedIndustry={selectedIndustry}
        onDelete={deleteData}
      />
    </div>
  );
};

export default BranchList;
