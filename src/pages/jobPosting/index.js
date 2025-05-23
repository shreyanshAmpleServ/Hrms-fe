import "bootstrap-daterangepicker/daterangepicker.css";

import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header";
import Table from "../../components/common/dataTableNew/index";
import FlashMessage from "../../components/common/modals/FlashMessage";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

import moment from 'moment';

import { Helmet } from "react-helmet-async";
import AddButton from "../../components/datatable/AddButton";
import SearchBar from "../../components/datatable/SearchBar";
import SortDropdown from "../../components/datatable/SortDropDown";
import { clearMessages, deletejob_posting, fetchjob_posting } from "../../redux/JobPosting";

const JobPosting = () => {
    const [mode, setMode] = React.useState("add"); // 'add' or 'edit'
    const [paginationData, setPaginationData] = React.useState()
    const [searchText, setSearchText] = React.useState("");
    const [sortOrder, setSortOrder] = React.useState("ascending"); // Sorting
    const permissions = JSON?.parse(localStorage.getItem("permissions"))
    const allPermissions = permissions?.filter((i) => i?.module_name === "Manufacturer")?.[0]?.permissions
    const isAdmin = localStorage.getItem("role")?.includes("admin")
    const isView = isAdmin || allPermissions?.view
    const isCreate = isAdmin || allPermissions?.create
    const isUpdate = isAdmin || allPermissions?.update
    const isDelete = isAdmin || allPermissions?.delete

    const dispatch = useDispatch();

    const columns = [

        {
            title: "Job Title",
            dataIndex: "job_title",
            sorter: (a, b) => a.job_title - b.job_title,
        },
        {
            title: "Department",
            dataIndex: "hrms_job_department",
            render: (value) => <div>{value?.department_name}</div>,
            sorter: (a, b) =>
                (a.hrms_job_department?.department_name || "").localeCompare(
                    b.hrms_job_department?.department_name || ""
                ),
        },
        {
            title: "Designation",
            dataIndex: "hrms_job_designation",
            render: (value) => <div>{value?.designation_name}</div>,
            sorter: (a, b) =>
                (a.hrms_job_designation?.designation_name || "").localeCompare(
                    b.hrms_job_designation?.designation_name || ""
                ),
        },


        {
            title: "Required Experience",
            dataIndex: "required_experience",
            // render: (value) => value ? `${value} years` : "—",
            sorter: (a, b) => a.required_experience - b.required_experience,

        },

        {
            title: "Posting Date",
            dataIndex: "posting_date",
            render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,

            sorter: (a, b) => new Date(a.posting_date) - new Date(b.posting_date),
        },
        {
            title: "Closing Date",
            dataIndex: "closing_date",
            render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,

            sorter: (a, b) => new Date(a.closing_date) - new Date(b.closing_date),
        },

        {
            title: "Description",
            dataIndex: "description",
            sorter: (a, b) => a.description - b.description,
        },
        {
            title: "Is Internal",
            dataIndex: "is_internal",
            render: (value) => (<div>{value ? "Yes" : "NO"}</div>),
            sorter: (a, b) => {
                const valA = a.is_internal === "Yes" || a.is_internal === true;
                const valB = b.is_internal === "Yes" || b.is_internal === true;
                return valA - valB;
            },

        },
        {
            title: "Created At",
            dataIndex: "created_date",
            render: (text) => <div>{moment(text).format("DD-MM-YYYY")}</div>,
            sorter: (a, b) => a.created_date.length - b.created_date.length,
        },
        ...((isUpdate || isDelete) ? [{
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
                        {isUpdate && <Link
                            className="dropdown-item edit-popup"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#add_edit_job_posting_modal"
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
        }] : [])
    ];

    const { job_posting, loading, error, success } = useSelector(
        (state) => state.job_posting
    );

    React.useEffect(() => {
        dispatch(fetchjob_posting({ search: searchText }));
    }, [dispatch, searchText]);
    React.useEffect(() => {
        setPaginationData({
            currentPage: job_posting?.currentPage,
            totalPage: job_posting?.totalPages,
            totalCount: job_posting?.totalCount,
            pageSize: job_posting?.size
        })
    }, [job_posting])

    const handlePageChange = ({ currentPage, pageSize }) => {
        setPaginationData((prev) => ({
            ...prev,
            currentPage,
            pageSize
        }));
        dispatch(fetchjob_posting({ search: searchText, page: currentPage, size: pageSize }));
    };

    const handleSearch = useCallback((e) => {
        setSearchText(e.target.value);
    }, []);

    const filteredData = useMemo(() => {
        let data = job_posting?.data || [];

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
    }, [searchText, job_posting, columns, sortOrder]);

    const handleDeleteIndustry = (industry) => {
        setSelectedIndustry(industry);
        setShowDeleteModal(true);
    };

    const [selectedIndustry, setSelectedIndustry] = React.useState(null);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const deleteData = () => {
        if (selectedIndustry) {
            dispatch(deletejob_posting(selectedIndustry.id));
            // navigate(`/job_posting`);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Helmet>
                <title>DCC HRMS - Job Posting</title>
                <meta name="DepanrtmentList" content="This is job_posting page of DCC CRMS." />
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
                                        Job Posting
                                        <span className="count-title">
                                            {job_posting?.totalCount || 0}
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
                                        label="Search  Job Posting"
                                    />
                                    {isCreate && <div className="col-sm-8">
                                        <AddButton
                                            label="Add Job Posting"
                                            id="add_edit_job_posting_modal"
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
                label="Industry"
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                selectedIndustry={selectedIndustry}
                onDelete={deleteData}
            />
        </div>
    );
};

export default JobPosting;
