import "bootstrap-daterangepicker/daterangepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import React, { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import CollapseHeader from "../../components/common/collapse-header";
import { countryList } from "../../components/common/data/json/countriesData";
import Table from "../../components/common/dataTable/index";
import FlashMessage from "../../components/common/modals/FlashMessage";
import usePermissions from "../../components/common/Permissions.js/index.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent";
import ExportData from "../../components/datatable/ExportData";
import SearchBar from "../../components/datatable/SearchBar";
import SortDropdown from "../../components/datatable/SortDropDown";
import {
  clearMessages,
  deleteProject,
  fetchProjects,
} from "../../redux/projects";
import DeleteAlert from "./alert/DeleteAlert";
import AddProjectModal from "./modal/AddProjectModal";
import EditProjectModal from "./modal/EditProjectModal";
import FilterComponent from "./modal/FilterComponent";

const ProjectList = () => {
  const [paginationData, setPaginationData] = useState();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const { isView, isCreate, isUpdate, isDelete } = usePermissions("Projects");

  const columns = [
    {
      title: "Project Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Code",
      dataIndex: "code",
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
    },
    {
      title: "Employee",
      dataIndex: "projects_employee_detail",
      render: (text) => <span>{text?.full_name || "--"}</span>,
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
    },
    {
      title: "Is Locked",
      dataIndex: "locked",
      render: (text) => <span>{text === "Y" ? "Yes" : "No"}</span>,
      sorter: (a, b) => (a.amount || 0) - (b.amount || 0),
    },
    {
      title: "Valid From",
      dataIndex: "valid_from",
      render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
      sorter: (a, b) => moment(a.startDate).diff(moment(b.startDate)),
    },
    {
      title: "Valid To",
      render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
      dataIndex: "valid_to",
      sorter: (a, b) => moment(a.dueDate).diff(moment(b.dueDate)),
    },
    {
      title: "Created Date",
      render: (text) => <span>{moment(text).format("DD MMM YYYY")}</span>,
      dataIndex: "createdDate",
      sorter: (a, b) => moment(a.dueDate).diff(moment(b.dueDate)),
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
    ...(isDelete || isUpdate
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
                      data-bs-target="#offcanvas_edit_project"
                      onClick={() => setSelectedProject(record)}
                    >
                      <i className="ti ti-edit text-blue"></i> Edit
                    </Link>
                  )}
                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteProject(record)}
                    >
                      <i className="ti ti-trash text-danger"></i> Delete
                    </Link>
                  )}
                  {/* {isView && (
                    <Link
                      className="dropdown-item"
                      to={`/projects/${record?.id}`}
                    >
                      <i className="ti ti-eye text-blue-light"></i> Preview
                    </Link>
                  )} */}
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  React.useEffect(() => {
    dispatch(fetchProjects({ search: searchText, ...selectedDateRange }));
  }, [dispatch, searchText, selectedDateRange]);
  const { projects, loading, error, success } = useSelector(
    (state) => state.projects
  );
  React.useEffect(() => {
    setPaginationData({
      currentPage: projects?.currentPage,
      totalPage: projects?.totalPages,
      totalCount: projects?.totalCount,
      pageSize: projects?.size,
    });
  }, [projects]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchProjects({
        search: searchText,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const handleSearch = useCallback((e) => {
    setSearchText(e.target.value);
  }, []);

  const filteredData = useMemo(() => {
    let data = projects?.data || [];

    if (selectedStatus !== null) {
      data = data.filter((item) => item.is_active === selectedStatus);
    }

    if (sortOrder === "ascending") {
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdate);
        const dateB = moment(b.createdate);
        return dateA.isBefore(dateB) ? -1 : 1;
      });
    } else if (sortOrder === "descending") {
      data = [...data].sort((a, b) => {
        const dateA = moment(a.createdate);
        const dateB = moment(b.createdate);
        return dateA.isBefore(dateB) ? 1 : -1;
      });
    }
    return data;
  }, [searchText, filteredCountries, selectedStatus, projects, columns]);

  const exportToExcel = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
    XLSX.writeFile(workbook, "projects.xlsx");
  }, [filteredData]);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Exported Projects", 14, 10);
    doc.autoTable({
      head: [columns.map((col) => (col.title !== "Actions" ? col.title : ""))],
      body: filteredData.map((row) =>
        columns.map((col) => {
          if (col.dataIndex === "startDate") {
            return moment(row.startDate).format("DD-MM-YYYY") || "";
          }
          if (col.dataIndex === "createdDate") {
            return moment(row.createdDate).format("DD-MM-YYYY") || "";
          }
          if (col.dataIndex === "dueDate") {
            return moment(row.dueDate).format("DD-MM-YYYY") || "";
          }
          return row[col.dataIndex] || "";
        })
      ),
      startY: 20,
    });
    doc.save("projects.pdf");
  }, [filteredData, columns]);

  const handleDeleteProject = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const deleteData = () => {
    if (selectedProject) {
      dispatch(deleteProject(selectedProject.id));
      setShowDeleteModal(false);
    }
  };
  return (
    <div className="page-wrapper">
      <Helmet>
        <title>DCC HRMS - Projects</title>
        <meta name="Projects" content="This is Projects page of DCC HRMS." />
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
                    Projects
                    <span className="count-title">
                      {projects?.data?.length || 0}
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
                    label="Search Projects"
                  />

                  <div className="col-sm-8">
                    <ExportData
                      exportToPDF={exportToPDF}
                      exportToExcel={exportToExcel}
                      label="Add Projects"
                      isCreate={isCreate}
                      id="offcanvas_add_project"
                    />
                  </div>
                </div>
              </div>

              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    <SortDropdown
                      sortOrder={sortOrder}
                      setSortOrder={setSortOrder}
                    />
                    <DateRangePickerComponent
                      selectedDateRange={selectedDateRange}
                      setSelectedDateRange={setSelectedDateRange}
                    />
                  </div>
                  <div className="d-flex align-items-center flex-wrap row-gap-2">
                    <FilterComponent
                      countryList={countryList}
                      applyFilters={({ countries, status }) => {
                        setFilteredCountries(countries);
                        setSelectedStatus(status);
                      }}
                    />
                  </div>
                </div>

                {isView ? (
                  <div className="table-responsive custom-table">
                    <Table
                      dataSource={filteredData}
                      columns={columns}
                      loading={loading}
                      paginationData={paginationData}
                      onPageChange={handlePageChange}
                    />
                  </div>
                ) : (
                  <UnauthorizedImage />
                )}
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="datatable-length" />
                  </div>
                  <div className="col-md-6">
                    <div className="datatable-paginate" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddProjectModal />
      <EditProjectModal project={selectedProject} />
      <DeleteAlert
        label="Project"
        showModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={deleteData}
      />
    </div>
  );
};

export default ProjectList;
