import { Button, Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchEmployeeAttachment } from "../../redux/EmployeeAttachment";
import DeleteConfirmation from "./DeleteConfirmation";
import ManageEmployeeAttachment from "./ManageEmployeeAttachment";
import {
  FileExcelFilled,
  FileFilled,
  FileImageFilled,
  FilePdfFilled,
  FileWordFilled,
} from "@ant-design/icons";

const EmployeeAttachment = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedEmployeeAttachment, setSelectedEmployeeAttachment] =
    useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { employeeAttachment, loading } = useSelector(
    (state) => state.employeeAttachment || {}
  );

  React.useEffect(() => {
    dispatch(
      fetchEmployeeAttachment({
        search: searchValue,
        ...selectedDateRange,
      })
    );
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: employeeAttachment?.currentPage,
      totalPage: employeeAttachment?.totalPages,
      totalCount: employeeAttachment?.totalCount,
      pageSize: employeeAttachment?.size,
    });
  }, [employeeAttachment]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchEmployeeAttachment({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = employeeAttachment?.data;

  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Employee Attachment"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "document_upload_employee",
      render: (text) => text?.full_name || "-",
      sorter: (a, b) =>
        a.document_upload_employee.full_name.localeCompare(
          b.document_upload_employee.full_name
        ),
    },
    {
      title: "Attachment",
      dataIndex: "document_path",
      render: (text) => (
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
      ),
    },
    {
      title: "Attachment Type",
      dataIndex: "document_type",
      render: (text) => <p className="text-capitalize">{text}</p> || "-",
    },
    {
      title: "Uploaded On",
      dataIndex: "createdate",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
      sorter: (a, b) => moment(a.createdate).diff(moment(b.createdate)),
    },
    ...(isDelete || isUpdate
      ? [
          {
            title: "Action",
            render: (text, a) => (
              <div className="dropdown table-action">
                <Link
                  to="#"
                  className="action-icon "
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa fa-ellipsis-v"></i>
                </Link>
                <div className="dropdown-menu dropdown-menu-right">
                  {isUpdate && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add"
                      onClick={() => setSelectedEmployeeAttachment(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}

                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteEmployeeAttachment(a)}
                    >
                      <i className="ti ti-trash text-danger" /> Delete
                    </Link>
                  )}
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  const handleDeleteEmployeeAttachment = (employeeAttachment) => {
    setSelectedEmployeeAttachment(employeeAttachment);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Employee Attachments</title>
        <meta
          name="employee-attachments"
          content="This is employee attachments page of DCC HRMS."
        />
      </Helmet>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-4">
                    <h4 className="page-title">
                      Employee Attachments
                      <span className="count-title">
                        {employeeAttachment?.totalCount}
                      </span>
                    </h4>
                  </div>
                  <div className="col-8 text-end">
                    <div className="head-icons">
                      <CollapseHeader />
                    </div>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
              <div className="card">
                <div className="card-header">
                  {/* Search */}
                  <div className="row align-items-center">
                    <div className="col-sm-4">
                      <div className="icon-form mb-3 mb-sm-0">
                        <span className="form-icon">
                          <i className="ti ti-search" />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Employee Attachments"
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                    </div>
                    {isCreate && (
                      <div className="col-sm-8">
                        <div className="text-sm-end">
                          <Link
                            to="#"
                            className="btn btn-primary"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvas_add"
                          >
                            <i className="ti ti-square-rounded-plus me-2" />
                            Add New Employee Attachment
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <>
                    {/* Filter */}
                    <div className="d-flex align-items-center justify-content-end flex-wrap mb-4 row-gap-2">
                      <div className="d-flex align-items-center flex-wrap row-gap-2">
                        <div className="mx-2">
                          <DateRangePickerComponent
                            selectedDateRange={selectedDateRange}
                            setSelectedDateRange={setSelectedDateRange}
                          />
                        </div>
                      </div>
                    </div>
                  </>

                  {isView ? (
                    <div className="table-responsive custom-table">
                      <Table
                        columns={columns}
                        dataSource={data}
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
        <ManageEmployeeAttachment
          setEmployeeAttachment={setSelectedEmployeeAttachment}
          employeeAttachment={selectedEmployeeAttachment}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        employeeAttachmentId={selectedEmployeeAttachment?.id}
      />
    </>
  );
};

export default EmployeeAttachment;
