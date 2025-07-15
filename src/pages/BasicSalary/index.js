import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import Table from "../../components/common/dataTableNew/index";
import usePermissions from "../../components/common/Permissions.js/index.js";
import SearchBar from "../../components/datatable/SearchBar.js";
import SortDropdown from "../../components/datatable/SortDropDown.js";
import { deleteBasicSalary, fetchBasicSalary } from "../../redux/BasicSalary";
import DeleteAlert from "./alert/DeleteAlert.js";
import AddEditModal from "./modal/AddEditModal.js";

const BasicSalary = () => {
  const [mode, setMode] = useState("add");
  const [selected, setSelected] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [paginationData, setPaginationData] = useState();

  const { isView, isCreate, isUpdate, isDelete } =
    usePermissions("Basic Payroll");

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Employee",
      dataIndex: "hrms_d_employee",
      render: (text) => <div>{text?.full_name}</div>,
      sorter: (a, b) =>
        (a?.hrms_d_employee?.full_name || "").localeCompare(
          b?.hrms_d_employee?.full_name || ""
        ),
    },
    {
      title: "Employee Code",
      dataIndex: "hrms_d_employee",
      render: (text) => <div>{text?.employee_code}</div>,
      sorter: (a, b) =>
        (a?.hrms_d_employee?.employee_code || "").localeCompare(
          b?.hrms_d_employee?.employee_code || ""
        ),
    },

    {
      title: "Department",
      dataIndex: "hrms_d_employee",
      render: (text) => text?.hrms_employee_department?.department_name || "-",
      sorter: (a, b) =>
        (
          a?.hrms_d_employee?.hrms_employee_department?.department_name || ""
        ).localeCompare(
          b?.hrms_d_employee?.hrms_employee_department?.department_name || ""
        ),
    },
    {
      title: "Branch",
      dataIndex: "branch_pay_component_header",
      render: (text) => text?.branch_name || "-",
      sorter: (a, b) =>
        (a?.branch_pay_component_header?.branch_name || "").localeCompare(
          b?.branch_pay_component_header?.branch_name || ""
        ),
    },
    {
      title: "Position",
      dataIndex: "hrms_d_employee",
      render: (text) =>
        text?.hrms_employee_designation?.designation_name || "-",
      sorter: (a, b) =>
        (
          a?.hrms_d_employee?.hrms_employee_designation?.designation_name || ""
        ).localeCompare(
          b?.hrms_d_employee?.hrms_employee_designation?.designation_name || ""
        ),
    },
    {
      title: "Pay Grade",
      dataIndex: "pay_grade_id",
      render: (text) =>
        text === 1
          ? "Grade A - ₹15,000 to ₹25,000"
          : text === 2
            ? "Grade B - ₹25,001 to ₹40,000"
            : text === 3
              ? "Grade C - ₹40,001 to ₹60,000"
              : text === 4
                ? "Grade D - ₹60,001 to ₹90,000"
                : text === 5
                  ? "Grade E - ₹90,001 and above"
                  : "-",
      sorter: (a, b) =>
        (a?.pay_grade_id?.name || "").localeCompare(
          b?.pay_grade_id?.name || ""
        ),
    },
    {
      title: "Pay Grade Level",
      dataIndex: "pay_grade_level",
      render: (text) =>
        text === 1
          ? "Level 1 - Entry"
          : text === 2
            ? "Level 2 - Junior"
            : text === 3
              ? "Level 3 - Mid"
              : text === 4
                ? "Level 4 - Senior"
                : text === 5
                  ? "Level 5 - Executive"
                  : "-",
      sorter: (a, b) => a?.pay_grade_level - b?.pay_grade_level,
    },
    {
      title: "Allowance Group",
      dataIndex: "allowance_group",
      render: (text) =>
        text === "1"
          ? "Standard Allowance"
          : text === "2"
            ? "Executive Allowance"
            : text === "3"
              ? "Managerial Allowance"
              : text === "4"
                ? "Field Staff Allowance"
                : text === "5"
                  ? "Housing Allowance"
                  : text === "6"
                    ? "Technical Staff Allowance"
                    : "-",
      sorter: (a, b) =>
        (a?.allowance_group || "").localeCompare(b?.allowance_group || ""),
    },
    // {
    //   title: "Effective From",
    //   dataIndex: "effective_from",
    //   render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    //   sorter: (a, b) =>
    //     moment(a.effective_from).isBefore(moment(b.effective_from)) ? -1 : 1,
    // },
    // {
    //   title: "Effective To",
    //   dataIndex: "effective_to",
    //   render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    //   sorter: (a, b) =>
    //     moment(a.effective_to).isBefore(moment(b.effective_to)) ? -1 : 1,
    // },
    {
      title: "Work Life Entry",
      dataIndex: "work_life_entry_pay_header",
      render: (text) => text?.work_life_event_type?.event_type_name || "-",
      sorter: (a, b) =>
        (
          a?.work_life_entry_pay_header?.work_life_event_type
            ?.event_type_name || ""
        )?.localeCompare(
          b?.work_life_entry_pay_header?.work_life_event_type
            ?.event_type_name || ""
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) =>
        text === "Active" ? (
          <span className="badge bg-success">Active</span>
        ) : (
          <span className="badge bg-danger">Inactive</span>
        ),
      sorter: (a, b) => (a?.status || "").localeCompare(b?.status || ""),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (text) => text || "-",
      sorter: (a, b) => (a?.remarks || "").localeCompare(b?.remarks || ""),
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
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add_edit_basic_salary"
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
                      onClick={() => handleDeleteBasicSalary(record)}
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

  const { basicSalary, loading } = useSelector((state) => state.basicSalary);

  React.useEffect(() => {
    dispatch(fetchBasicSalary({ search: searchText }));
  }, [dispatch, searchText]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: basicSalary?.currentPage,
      totalPage: basicSalary?.totalPages,
      totalCount: basicSalary?.totalCount,
      pageSize: basicSalary?.size,
    });
  }, [basicSalary]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchBasicSalary({
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
    let data = basicSalary?.data || [];
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
  }, [basicSalary, sortOrder]);

  const handleDeleteBasicSalary = (basicSalary) => {
    setSelected(basicSalary);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selected) {
      dispatch(deleteBasicSalary(selected.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Component Assignment</title>
        <meta
          name="basicSalary"
          content="This is basicSalary page of DCC HRMS."
        />
      </Helmet>
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="page-header">
              <div className="row align-items-center">
                <div className="col-8">
                  <h4 className="page-title">
                    Component Assignment
                    <span className="count-title">
                      {basicSalary?.data?.length || 0}
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
            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-8">
                    <SearchBar
                      searchText={searchText}
                      handleSearch={handleSearch}
                      label="Search Component Assignment"
                    />
                  </div>
                  {isCreate && (
                    <div className="col-4 text-end">
                      <Link
                        to="#"
                        className="btn btn-primary"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_add_edit_basic_salary"
                        onClick={() => setMode("add")}
                        style={{ width: "100px" }}
                      >
                        <i className="ti ti-square-rounded-plus me-2" />
                        Create
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
        setMode={setMode}
        initialData={selected}
        setSelected={setSelected}
      />
      <DeleteAlert
        label="Component Assignment"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </div>
  );
};

export default BasicSalary;
