import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import "bootstrap-daterangepicker/daterangepicker.css";
import { useDispatch, useSelector } from "react-redux";
import CollapseHeader from "../../../../components/common/collapse-header";
import AddEditModal from "./modal/AddEditModal";
import FlashMessage from "../../../../components/common/modals/FlashMessage";
import Table from "../../../../components/common/dataTable/index";
import DeleteAlert from "./alert/DeleteAlert";


import moment from "moment";

import SortDropdown from "../../../../components/datatable/SortDropDown";
import SearchBar from "../../../../components/datatable/SearchBar";
import { useNavigate } from "react-router-dom";
import AddButton from "../../../../components/datatable/AddButton";
import { Helmet } from "react-helmet-async";
import { clearMessages, deleteShift, fetchShift } from "../../../../redux/Shift";

const ShiftList = () => {
  const [mode, setMode] = useState("add"); // 'add' or 'edit'
 
  const permissions =JSON?.parse(localStorage.getItem("permissions"))
  const allPermissions = permissions?.filter((i)=>i?.module_name === "Shift")?.[0]?.permissions
 const isAdmin = localStorage.getItem("role")?.includes("admin")
  const isView = isAdmin || allPermissions?.view
  const isCreate = isAdmin || allPermissions?.create
  const isUpdate = isAdmin || allPermissions?.update
  const isDelete = isAdmin || allPermissions?.delete

  const dispatch = useDispatch();
  const columns = [
    {
      title: "Shift Name",
      dataIndex: "shift_name",
      render: (text, record) => (
        <div>{text}</div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      render: (text, record) => (
     <div>{moment(text).format("hh:mm A")}</div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      render: (text, record) => (
          <div>{moment(text).format("hh:mm A")}</div>

      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },

    {
      title: "Created Date",
      dataIndex: "createdate",
      render: (text) => (
        <span>{moment(text).format("DD MMM YYYY, hh:mm a")}</span> // Format the date as needed
      ),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate), // Sort by date
    },
    // {
    //   title: "Status",
    //   dataIndex: "is_active",
    //   render: (text) => (
    //     <div>
    //       {text === "Y" ? (
    //         <span className="badge badge-pill badge-status bg-success">
    //           Active
    //         </span>
    //       ) : (
    //         <span className="badge badge-pill badge-status bg-danger">
    //           Inactive
    //         </span>
    //       )}
    //     </div>
    //   ),
    //   sorter: (a, b) => a.is_active.localeCompare(b.is_active),
    // },
   ...((isUpdate || isDelete) ?[ {
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
           {isUpdate && <Link
              className="dropdown-item edit-popup"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#add_edit_shift_modal"
              onClick={() => {
                setSelectedIndustry(record);
                setMode("edit");
              }}
            >
              <i className="ti ti-edit text-blue"></i> Edit
            </Link>}
           {isDelete && <Link
              className="dropdown-item"
              to="#"
              onClick={() => handleDeleteIndustry(record)}
            >
              <i className="ti ti-trash text-danger"></i> Delete
            </Link>}
          </div>
        </div>
      ),
    }]:[])
  ];

  const navigate = useNavigate();
  const { shift, loading, error, success } = useSelector(
    (state) => state.shift
  );
  
  console.log("Shift",shift)
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending"); // Sorting
    const [paginationData , setPaginationData] = useState()
  
    React.useEffect(() => {
      dispatch(fetchShift({search:searchText}));
    }, [dispatch, searchText]);
  
  React.useEffect(()=>{
      setPaginationData({
        currentPage:shift?.currentPage,
        totalPage:shift?.totalPages,
        totalCount:shift?.totalCount,
        pageSize : shift?.size
      })
    },[shift])
  
    const handlePageChange = ({ currentPage, pageSize }) => {
      setPaginationData((prev) => ({
        ...prev,
        currentPage,
        pageSize
      }));
      dispatch(fetchShift({search:searchText , page: currentPage, size: pageSize })); 
    };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = shift?.data || [];
    // if (searchText) {
    //   data = data.filter((item) =>
    //     columns.some((col) =>
    //       item[col.dataIndex]
    //         ?.toString()
    //         .toLowerCase()
    //         .includes(searchText.toLowerCase())
    //     )
    //   );
    // }
    // if (sortOrder === "ascending") {
    //   data = [...data].sort((a, b) =>
    //     moment(a.createdDate).isBefore(moment(b.createdDate)) ? -1 : 1
    //   );
    // } else if (sortOrder === "descending") {
    //   data = [...data].sort((a, b) =>
    //     moment(a.createdDate).isBefore(moment(b.createdDate)) ? 1 : -1
    //   );
    // }
    return data;
  }, [searchText, shift, columns, sortOrder]);

  const handleDeleteIndustry = (industry) => {
    setSelectedIndustry(industry);
    setShowDeleteModal(true);
  };

  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteData = () => {
    if (selectedIndustry) {
      dispatch(deleteShift(selectedIndustry.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Shift</title>
        <meta name="Shift" content="This is Shift page of DCC CRMS." />
      </Helmet>
      <div className="content">
        {error && (
          <FlashMessage
            type="error"
            message={error}
            onClose={() => dispatch(clearMessages())}
          />
        )}
        {success && (
          <FlashMessage
            type="success"
            message={success}
            onClose={() => dispatch(clearMessages())}
          />
        )}

        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Shift
                    <span className="count-title">
                      {shift?.data?.length || 0}
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
                    label="Search Shift"
                  />
                {isCreate &&  <div className="col-sm-8">
                    <AddButton
                      label="Add Shift"
                      id="add_edit_shift_modal"
                      setMode={() => setMode("add")}
                    />
                  </div>}
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
        label="Leave Type"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedIndustry={selectedIndustry}
        onDelete={deleteData}
      />
    </div>
  );
};

export default ShiftList;
