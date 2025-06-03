import { Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchdisciplinryAction } from "../../redux/disciplinaryActionLog/index.js";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManagedisciplinryAction from "./ManagedisciplinryAction";

const DisciplinaryActionLog = () => {
    const [searchValue, setSearchValue] = useState("");
    const [selecteddisciplinryAction, setSelecteddisciplinryAction] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [paginationData, setPaginationData] = useState({});
    const [selectedDateRange, setSelectedDateRange] = useState({
        startDate: moment().subtract(30, "days"),
        endDate: moment(),
    });
    const dispatch = useDispatch();

    const { disciplinryAction, loading } = useSelector((state) => state.disciplinryAction || {});

    React.useEffect(() => {
        dispatch(
            fetchdisciplinryAction({
                search: searchValue,
                ...selectedDateRange,
            })
        );
    }, [dispatch, searchValue, selectedDateRange]);

    React.useEffect(() => {
        setPaginationData({
            currentPage: disciplinryAction?.currentPage,
            totalPage: disciplinryAction?.totalPages,
            totalCount: disciplinryAction?.totalCount,
            pageSize: disciplinryAction?.size,
        });
    }, [disciplinryAction]);
    const handlePageChange = ({ currentPage, pageSize }) => {
        setPaginationData((prev) => ({
            ...prev,
            currentPage,
            pageSize,
        }));
        dispatch(
            fetchdisciplinryAction({
                search: searchValue,
                ...selectedDateRange,
                page: currentPage,
                size: pageSize,
            })
        );
    };

    const data = disciplinryAction?.data;


    const permissions = JSON?.parse(localStorage.getItem("permissions"));
    const allPermissions = permissions?.filter(
        (i) => i?.module_name === "Time Sheet Entry"
    )?.[0]?.permissions;
    const isAdmin = localStorage.getItem("role")?.includes("admin");
    const isView = isAdmin || allPermissions?.view;
    const isCreate = isAdmin || allPermissions?.create;
    const isUpdate = isAdmin || allPermissions?.update;
    const isDelete = isAdmin || allPermissions?.delete;

    const columns = [
        {
            title: "Employee Name",
            render: (text) => text?.employee?.full_name || "-",
        },
        {
            title: "Incident Date",
            dataIndex: "incident_date",
            render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
            sorter: (a, b) => new Date(a.incident_date) - new Date(b.incident_date),
        },
        {
            title: "Description",
            dataIndex: "incident_description",
            render: (text) => text || "-",
        },
        {
            title: "Action Taken",
            dataIndex: "action_taken",
            render: (text) => text || "-",
        },
        {
            title: "Committee Notes",
            dataIndex: "committee_notes",
            render: (text) => text || "-",
        },
        {
            title: "Penalty Type",
            render: (text) => text?.disciplinary_penalty
                ?.penalty_type ?? "-",
        },
        {
            title: "Effective From",
            dataIndex: "effective_from",
            render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
            sorter: (a, b) => new Date(a.effective_from) - new Date(b.effective_from),

        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text) => text || "-",
        },
        {
            title: "Created On",
            dataIndex: "createdate",
            render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
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
                                        onClick={() => setSelecteddisciplinryAction(a)}
                                    >
                                        <i className="ti ti-edit text-blue" /> Edit
                                    </Link>
                                )}

                                {isDelete && (
                                    <Link
                                        className="dropdown-item"
                                        to="#"
                                        onClick={() => handleDeletedisciplinryAction(a)}
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

    const handleDeletedisciplinryAction = (disciplinryAction) => {
        setSelecteddisciplinryAction(disciplinryAction);
        setShowDeleteModal(true);
    };

    return (
        <>
            <Helmet>
                <title>DCC HRMS - Disciplinary Action Log</title>
                <meta
                    name="time-sheet"
                    content="This is time sheet page of DCC HRMS."
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
                                            Disciplinary Action Log
                                            <span className="count-title">
                                                {disciplinryAction?.totalCount}
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
                                                    placeholder="Search Disciplinary Action"
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
                                                        Add New  Disciplinary Action
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="card-body">
                                    <>
                                        {/* Filter */}
                                        <div className="d-flex align-items-center justify-content-between flex-wrap mb-4 row-gap-2">
                                            <div className="d-flex align-items-center flex-wrap row-gap-2">
                                                <div className="d-flex align-items-center flex-wrap row-gap-2">
                                                    <h4 className="mb-0 me-3">All Disciplinary Action Log </h4>
                                                </div>
                                            </div>
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
                <ManagedisciplinryAction
                    setdisciplinryAction={setSelecteddisciplinryAction}
                    disciplinryAction={selecteddisciplinryAction}
                />
            </div>
            <DeleteConfirmation
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                disciplinryActionId={selecteddisciplinryAction?.id}
            />
        </>
    );
};

export default DisciplinaryActionLog;
