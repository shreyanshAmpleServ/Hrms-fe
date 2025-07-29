import moment from "moment";
import React, { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import CollapseHeader from "../../components/common/collapse-header.js";
import Table from "../../components/common/dataTableNew/index.js";
import EmployeeSelect from "../../components/common/EmployeeSelect/index.js";
import usePermissions from "../../components/common/Permissions.js";
import UnauthorizedImage from "../../components/common/UnAuthorized.js";
import DateRangePickerComponent from "../../components/datatable/DateRangePickerComponent.js";
import { fetchComponentsFn } from "../../redux/MonthlyPayroll/index.js";
import { fetchpayslip } from "../../redux/payslipViewer";
import DeleteAlert from "./alert/DeleteAlert.js";
import AddEditModal from "./modal/AddEditModal.js";
import { FilePdfFilled } from "@ant-design/icons";
const payslipMonthOptions = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: new Date(0, i).toLocaleString("default", { month: "long" }),
}));

const PayslipViewer = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedpayslip, setSelectedpayslip] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payroll, setPayroll] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: moment().subtract(365, "days"),
    endDate: moment().endOf("month"),
  });
  const dispatch = useDispatch();
  const { componentNames } = useSelector((s) => s.monthlyPayroll);

  const { payslip, loading } = useSelector((state) => state.payslip || {});

  React.useEffect(() => {
    dispatch(fetchComponentsFn());
  }, [dispatch]);

  const data = payslip?.data;

  React.useEffect(() => {
    if (data && componentNames?.length > 0) {
      const formattedPayroll = data?.map((item) => {
        const components = [];
        const employeeDetails = {};

        for (const [key, value] of Object.entries(item)) {
          if (/^\d+$/.test(key)) {
            const compMeta = componentNames.find(
              (c) => String(c.component_code) === key
            );

            const component_value = parseFloat(value) || 0;

            components.push({
              component_code: key,
              component_name: compMeta?.component_name,
              component_value: component_value,
            });
          } else {
            employeeDetails[key] = item[key];
          }
        }

        return {
          ...employeeDetails,
          components,
          total_earnings: item?.total_earnings,
          total_deductions: item?.total_deductions,
          net_pay: item?.net_pay,
          TaxableIncome: item?.TaxableIncome,
          TaxPayee: item?.TaxPayee,
        };
      });

      setPayroll(formattedPayroll);
    }
  }, [data, componentNames]);

  React.useEffect(() => {
    dispatch(
      fetchpayslip({
        search: searchValue,
        startDate: moment(selectedDateRange?.startDate)?.toISOString(),
        endDate: moment(selectedDateRange?.endDate)?.toISOString(),
        year: selectedYear,
        month: selectedMonth,
        employee_id: selectedEmployee?.value,
      })
    );
  }, [
    dispatch,
    searchValue,
    selectedDateRange,
    selectedYear,
    selectedMonth,
    selectedEmployee?.value,
  ]);

  React.useEffect(() => {
    setPaginationData({
      currentPage: payslip?.currentPage,
      totalPage: payslip?.totalPages,
      totalCount: payslip?.totalCount,
      pageSize: payslip?.size,
    });
  }, [payslip]);

  const handlePageChange = ({ currentPage, pageSize }) => {
    setPaginationData((prev) => ({
      ...prev,
      currentPage,
      pageSize,
    }));
    dispatch(
      fetchpayslip({
        search: searchValue,
        ...selectedDateRange,
        page: currentPage,
        size: pageSize,
      })
    );
  };

  const { isView } = usePermissions();

  const components = useMemo(() => {
    return (
      componentNames?.map((component) => {
        const { component_code, component_name } = component;
        return {
          title: component_name,
          dataIndex: component_code,
          render: (_, record) => {
            const comp = record.components?.find(
              (c) => c.component_code === component_code
            );
            return <span>{comp?.component_value || 0}</span>;
          },
        };
      }) || []
    );
  }, [componentNames]);

  const columns = [
    {
      title: "Employee Code",
      dataIndex: "hrms_monthly_payroll_employee",
      render: (text) => (
        <Link
          className="d-flex gap-1 align-items-center"
          target="_blank"
          to={`/employee/${text?.id}`}
        >
          {text?.employee_code || "--"}
        </Link>
      ),
    },
    {
      title: "Employee Name",
      dataIndex: "hrms_monthly_payroll_employee",
      render: (text) => text?.full_name || "--",
    },
    // {
    //   title: "Component Assit ID",
    //   dataIndex: "component_assit_id",
    //   render: (text) => text || "--",
    // },
    {
      title: "Currency",
      dataIndex: "hrms_monthly_payroll_currency",
      render: (text) => text?.currency_code || "--",
    },
    ...components,
    {
      title: "Tax Payee",
      dataIndex: "tax_amount",
      render: (value) => value || 0,
    },
    {
      title: "Taxable Income",
      dataIndex: "taxable_earnings",
      render: (value) => value || 0,
    },
    {
      title: "Net Pay",
      dataIndex: "net_pay",
      render: (value) => value || 0,
    },
    {
      title: "Total Deductions",
      dataIndex: "total_deductions",
      render: (value) => value || 0,
    },
    {
      title: "Total Earnings",
      dataIndex: "total_earnings",
      render: (value) => value || 0,
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => (
        <Link
          to={`${process.env.REACT_APP_API_BASE_URL}/v1/monthly-payroll-download/download?payroll_year=${record?.payroll_year}&payroll_month=${record?.payroll_month}&employee_id=${record?.hrms_monthly_payroll_employee?.id}`}
          className="btn btn-primary btn-sm"
          target="_blank"
        >
          <FilePdfFilled /> <span className="ms-2"> Download</span>
        </Link>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Payslip</title>
        <meta
          name="arrear-adjustments"
          content="This is arrear adjustments page of DCC HRMS."
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
                      Payslip
                      <span className="count-title">{payslip?.totalCount}</span>
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
                          placeholder="Search Payslip"
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* {isCreate && (
                      <div className="col-sm-8">
                        <div className="text-sm-end">
                          <Link
                            to="#"
                            className="btn btn-primary"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvas_add"
                            style={{ width: "100px" }}
                          >
                            <i className="ti ti-square-rounded-plus me-2" />
                            Create
                          </Link>
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>

                <div className="card-body">
                  <>
                    {/* Filter */}
                    <div className="d-flex row align-items-center justify-content-between flex-wrap mb-4 row-gap-2">
                      <div className="d-flex align-items-center justify-content-start col-md-6 gap-2">
                        <div className="d-flex align-items-center justify-content-start col-md-6">
                          <EmployeeSelect
                            placeholder={"Select Employee"}
                            value={selectedEmployee?.value}
                            onChange={(e) => setSelectedEmployee(e)}
                          />
                        </div>
                        <div className="d-flex align-items-center justify-content-start col-md-3">
                          <ReactSelect
                            options={[
                              { value: "", label: "Select Month" },
                              ...payslipMonthOptions,
                            ]}
                            value={selectedMonth?.value}
                            className="Select"
                            onChange={(e) => setSelectedMonth(e.value)}
                            placeholder="Select Month"
                            classNamePrefix="react-select"
                          />
                        </div>
                        <div className="d-flex align-items-center justify-content-start col-md-3">
                          <DatePicker
                            className="form-control"
                            placeholderText="Select Year"
                            showYearPicker
                            dateFormat="yyyy"
                            selected={
                              selectedYear ? new Date(selectedYear, 0, 1) : null
                            }
                            onChange={(date) => {
                              if (date) {
                                setSelectedYear(date.getFullYear());
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-end col-md-6">
                        <DateRangePickerComponent
                          selectedDateRange={selectedDateRange}
                          setSelectedDateRange={setSelectedDateRange}
                        />
                      </div>
                    </div>
                  </>

                  {isView ? (
                    <div className="table-responsive custom-table">
                      <Table
                        columns={columns}
                        dataSource={payroll}
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
        <AddEditModal
          setpayslip={setSelectedpayslip}
          payslip={selectedpayslip}
        />
      </div>
      <DeleteAlert
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        payslipId={selectedpayslip?.id}
      />
    </>
  );
};

export default PayslipViewer;
