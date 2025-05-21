import "bootstrap-daterangepicker/daterangepicker.css";

import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../../../components/common/collapse-header";
import Table from "../../../../components/common/dataTableNew/index";
import FlashMessage from "../../../../components/common/modals/FlashMessage";
import DeleteAlert from "./alert/DeleteAlert";
import AddEditModal from "./modal/AddEditModal";

import moment from 'moment';

import { Helmet } from "react-helmet-async";
import AddButton from "../../../../components/datatable/AddButton";
import SearchBar from "../../../../components/datatable/SearchBar";
import SortDropdown from "../../../../components/datatable/SortDropDown";
import { clearMessages, deletesurvey, fetchsurvey } from "../../../../redux/surveyMaster";

const SurveyMaster = () => {
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
            title: "Survey Title",
            dataIndex: "survey_title",
            render: (_text, record) => (
                <Link to={`#`}>{record.survey_title}</Link>
            ),
            sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
        },
        {
            title: " Launch Date",
            dataIndex: "launch_date",
            render: (text) => moment(text).format('DD-MM-YYYY'),

            sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
        },
        {
            title: " Close Date",
            dataIndex: "close_date",
            render: (text) => moment(text).format('DD-MM-YYYY'),

            sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
        },
        {
            title: " Description ",
            dataIndex: "description",

            sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
        },

        {
            title: "Created Date",
            dataIndex: "create_date",
            render: (text) => moment(text).format('DD-MM-YYYY'),
            sorter: (a, b) => new Date(a.create_date) - new Date(b.create_date),
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
            sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
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
                            data-bs-target="#add_edit_survey_modal"
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

    const { survey, loading, error, success } = useSelector(
        (state) => state.surveyMaster
    );

    React.useEffect(() => {
        dispatch(fetchsurvey({ search: searchText }));
    }, [dispatch, searchText]);
    React.useEffect(() => {
        setPaginationData({
            currentPage: survey?.currentPage,
            totalPage: survey?.totalPages,
            totalCount: survey?.totalCount,
            pageSize: survey?.size
        })
    }, [survey])

    const handlePageChange = ({ currentPage, pageSize }) => {
        setPaginationData((prev) => ({
            ...prev,
            currentPage,
            pageSize
        }));
        dispatch(fetchsurvey({ search: searchText, page: currentPage, size: pageSize }));
    };

    const handleSearch = useCallback((e) => {
        setSearchText(e.target.value);
    }, []);

    const filteredData = useMemo(() => {
        let data = survey?.data || [];

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
    }, [searchText, survey, columns, sortOrder]);

    const handleDeleteIndustry = (industry) => {
        setSelectedIndustry(industry);
        setShowDeleteModal(true);
    };

    const [selectedIndustry, setSelectedIndustry] = React.useState(null);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const deleteData = () => {
        if (selectedIndustry) {
            dispatch(deletesurvey(selectedIndustry.id));
            // navigate(`/survey`);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Helmet>
                <title>DCC HRMS - Survey</title>
                <meta name="DepanrtmentList" content="This is survey page of DCC CRMS." />
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
                                        Survey                                        <span className="count-title">
                                            {survey?.totalCount || 0}
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
                                        label="Search Survey"
                                    />
                                    {isCreate && <div className="col-sm-8">
                                        <AddButton
                                            label="Add Survey"
                                            id="add_edit_survey_modal"
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

export default SurveyMaster;
