import Table from "../../components/common/dataTableNew/index.js";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import usePermissions from "../../components/common/Permissions.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchMedicalRecord } from "../../redux/MedicalRecord";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManageMedicalRecord from "./ManageMedicalRecord/index.js";

const MedicalRecord = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(30, "days"),
    endDate: moment(),
  });
  const dispatch = useDispatch();

  const { medicalRecord, loading } = useSelector(
    (state) => state.medicalRecord || {}
  );

  React.useEffect(() => {
    dispatch(fetchMedicalRecord({ search: searchValue, ...selectedDateRange }));
  }, [dispatch, searchValue, selectedDateRange]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: medicalRecord?.currentPage,
      totalPage: medicalRecord?.totalPages,
      totalCount: medicalRecord?.totalCount,
      pageSize: medicalRecord?.size,
    });
  }, [medicalRecord]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchMedicalRecord({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const data = medicalRecord?.data;

  const { isView, isCreate, isUpdate, isDelete } =
    usePermissions("Medical Record");

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "medical_employee_id",
      render: (text) => text?.full_name || "-",
    },
    {
      title: "Record Type",
      dataIndex: "record_type",
      render: (text) => <p className="text-capitalize">{text}</p> || "-",
    },

    {
      title: "Record Date",
      dataIndex: "record_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Next Review Date",
      dataIndex: "next_review_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Document Path",
      dataIndex: "document_path",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          <i className="ti ti-file-document" /> View
        </a>
      ),
    },
    {
      title: "Hospital Name",
      dataIndex: "hospital_name",
      render: (text) => text || "-",
    },
    {
      title: "Doctor Name",
      dataIndex: "doctor_name",
      render: (text) => text || "-",
    },
    {
      title: "Diagnosis",
      dataIndex: "diagnosis",
      render: (text) => text || "-",
    },
    {
      title: "Treatment",
      dataIndex: "treatment",
      render: (text) => text || "-",
    },
    {
      title: "Prescription Path",
      dataIndex: "prescription_path",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          <i className="ti ti-file-document" /> View
        </a>
      ),
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
                      onClick={() => setSelectedMedicalRecord(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}

                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteMedicalRecord(a)}
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

  const handleDeleteMedicalRecord = (medicalRecord) => {
    setSelectedMedicalRecord(medicalRecord);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Medical Record</title>
        <meta
          name="medical-record"
          content="This is medical record page of DCC HRMS."
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
                      Medical Record
                      <span className="count-title">
                        {medicalRecord?.totalCount}
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
                          placeholder="Search Medical Record"
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
                            Add Medical Record
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
                        scroll={{ x: "max-content" }}
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
        <ManageMedicalRecord
          setMedicalRecord={setSelectedMedicalRecord}
          medicalRecord={selectedMedicalRecord}
        />
      </div>
      <DeleteConfirmation
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        medicalRecordId={selectedMedicalRecord?.id}
      />
    </>
  );
};

export default MedicalRecord;
