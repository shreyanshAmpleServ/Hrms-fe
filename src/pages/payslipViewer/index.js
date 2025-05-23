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
import { clearMessages, deletepayslip, fetchpayslip } from "../../redux/payslipViewer";

const PayslipViewer = () => {
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
            title: "Employee",
            dataIndex: "payslip_employee",
            render: (value) => <div>{value?.full_name}</div>,
            sorter: (a, b) =>
                (a.payslip_employee?.full_name || "").localeCompare(b.payslip_employee?.full_name || ""),
        },
        {
            title: "Month",
            dataIndex: "month",
            render: (text) => <div>{text}</div>, // You can use moment if it's a date
            sorter: (a, b) => (a.month || "").localeCompare(b.month || ""),
        },
        {
            title: "Year",
            dataIndex: "year",
            render: (text) => <div>{text?.split("-")[0]}</div>,
            sorter: (a, b) => (a.Year || "").localeCompare(b.Year || ""),
        },

        {
            title: "Net Salary",
            dataIndex: "net_salary",
            render: (text) => `₹ ${parseFloat(text).toFixed(2)}`,
            sorter: (a, b) => parseFloat(a.net_salary) - parseFloat(b.net_salary),
        },
        // {
        //     title: "Resume",
        //     dataIndex: "resume_path",
        //     render: (_text, record) => (
        //         <a
        //             href={record.resume_path}
        //             target="_blank"
        //             rel="noopener noreferrer"
        //             download
        //             className="d-inline-flex align-items-center gap-2 text-decoration-none"
        //             title="View or Download PDF"
        //         >
        //             <i className="ti ti-file-type-pdf fs-5"></i>
        //             <span>View PDF</span>
        //         </a>
        //     ),
        // },
        {
            title: "Payslip PDF",
            dataIndex: "pdf_path",
            render: (_text, record) => (
                <a
                    href={record.pdf_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="d-inline-flex align-items-center gap-2 text-decoration-none"
                    title="Download Payslip"
                >
                    <i className="ti ti-file-invoice fs-5"></i>
                    <span>Download</span>
                </a>
            ),
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
                        {record.resume_path && (
                            <a
                                className="dropdown-item"
                                href={record.resume_path}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="ti ti-download text-success"></i> Download
                            </a>
                        )}

                        {isUpdate && <Link
                            className="dropdown-item edit-popup"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#add_edit_payslip_modal"
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

    const { payslip, loading, error, success } = useSelector(
        (state) => state.payslip
    );

    React.useEffect(() => {
        dispatch(fetchpayslip({ search: searchText }));
    }, [dispatch, searchText]);
    React.useEffect(() => {
        setPaginationData({
            currentPage: payslip?.currentPage,
            totalPage: payslip?.totalPages,
            totalCount: payslip?.totalCount,
            pageSize: payslip?.size
        })
    }, [payslip])

    const handlePageChange = ({ currentPage, pageSize }) => {
        setPaginationData((prev) => ({
            ...prev,
            currentPage,
            pageSize
        }));
        dispatch(fetchpayslip({ search: searchText, page: currentPage, size: pageSize }));
    };

    const handleSearch = useCallback((e) => {
        setSearchText(e.target.value);
    }, []);

    const filteredData = useMemo(() => {
        let data = payslip?.data || [];

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
    }, [searchText, payslip, columns, sortOrder]);

    const handleDeleteIndustry = (industry) => {
        setSelectedIndustry(industry);
        setShowDeleteModal(true);
    };

    const [selectedIndustry, setSelectedIndustry] = React.useState(null);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const deleteData = () => {
        if (selectedIndustry) {
            dispatch(deletepayslip(selectedIndustry.id));
            // navigate(`/payslip`);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="page-wrapper">
            <Helmet>
                <title>DCC HRMS - Payslip Viewer</title>
                <meta name="DepanrtmentList" content="This is payslip page of DCC CRMS." />
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
                                        Payslip Viewer
                                        <span className="count-title">
                                            {payslip?.totalCount || 0}
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
                                        label="Search Payslip Viewer"
                                    />
                                    {isCreate && <div className="col-sm-8">
                                        <AddButton
                                            label="Add PayslipViewer"
                                            id="add_edit_payslip_modal"
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

export default PayslipViewer
    ;
