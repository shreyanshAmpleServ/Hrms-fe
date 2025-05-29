import { Table } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js/index.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchmonthlyPayroll } from "../../redux/monthlyPayrollProcessing/index.js";
import DeleteConfirmation from "./DeleteConfirmation/index.js";
import ManagemonthlyPayroll from "./Managepayroll/index.js";

const MonthlyPayrollProcessing = () => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedmonthlyPayroll, setSelectedmonthlyPayroll] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [paginationData, setPaginationData] = useState({});
    const [selectedDateRange, setSelectedDateRange] = useState({
        startDate: moment().subtract(30, "days"),
        endDate: moment(),
    });
    const dispatch = useDispatch();

    const { monthlyPayroll, loading } = useSelector((state) => state.monthlyPayroll || {});

    React.useEffect(() => {
        dispatch(
            fetchmonthlyPayroll({
                search: searchValue,
                ...selectedDateRange,
            })
        );
    }, [dispatch, searchValue, selectedDateRange]);

    React.useEffect(() => {
        setPaginationData({
            currentPage: monthlyPayroll?.currentPage,
            totalPage: monthlyPayroll?.totalPages,
            totalCount: monthlyPayroll?.totalCount,
            pageSize: monthlyPayroll?.size,
        });
    }, [monthlyPayroll]);

    const handlePageChange = ({ currentPage, pageSize }) => {
        setPaginationData((prev) => ({
            ...prev,
            currentPage,
            pageSize,
        }));
        dispatch(
            fetchmonthlyPayroll({
                search: searchValue,
                ...selectedDateRange,
                page: currentPage,
                size: pageSize,
            })
        );
    };

    const data = monthlyPayroll?.data;

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
            render: (text) => text?.employee?.full_name || "-", // assuming relation
        },
        {
            title: "Grievance Type",
            dataIndex: "grievance_type",
            render: (text) => text || "-",
        },
        {
            title: "Description",
            dataIndex: "description",
            render: (text) => text || "-",
        },
        {
            title: "Anonymous",
            dataIndex: "anonymous",
            render: (val) => (val ? "Yes" : "No"),
        },
        {
            title: "Submitted On",
            dataIndex: "submitted_on",
            render: (text) => (text ? moment(text).format("DD-MM-YYYY HH:mm") : "-"),
            sorter: (a, b) => new Date(a.submitted_on) - new Date(b.submitted_on),
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text) => text || "-",
        },
        {
            title: "Assigned To",
            render: (text) => text?.assigned_to_user?.full_name || "-", // assuming relation
        },
        {
            title: "Resolution Notes",
            dataIndex: "resolution_notes",
            render: (text) => text || "-",
        },
        {
            title: "Resolved On",
            dataIndex: "resolved_on",
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
                                        onClick={() => setSelectedmonthlyPayroll(a)}
                                    >
                                        <i className="ti ti-edit text-blue" /> Edit
                                    </Link>
                                )}

                                {isDelete && (
                                    <Link
                                        className="dropdown-item"
                                        to="#"
                                        onClick={() => handleDeletemonthlyPayroll(a)}
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

    const handleDeletemonthlyPayroll = (monthlyPayroll) => {
        setSelectedmonthlyPayroll(monthlyPayroll);
        setShowDeleteModal(true);
    };

    return (
        <>
            <Helmet>
                <title>DCC HRMS -Monthly Payroll Processing</title>
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
                                            Monthly Payroll Processing
                                            <span className="count-title">
                                                {monthlyPayroll?.totalCount}
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
                                                    placeholder="Search Grievance Submission"
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
                                                        Monthly Payroll Processing
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
                                                    <h4 className="mb-0 me-3">All Monthly Payroll Processing</h4>
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
                <ManagemonthlyPayroll
                    setmonthlyPayroll={setSelectedmonthlyPayroll}
                    monthlyPayroll={selectedmonthlyPayroll}
                />
            </div>
            <DeleteConfirmation
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                monthlyPayrollId={selectedmonthlyPayroll?.id}
            />
        </>
    );
};

export default MonthlyPayrollProcessing;
