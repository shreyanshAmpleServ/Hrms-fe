import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Table,
  Badge,
} from "react-bootstrap";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../components/common/imageWithBasePath";
import { all_routes } from "../../routes/all_routes";
import CollapseHeader from "../../components/common/collapse-header";
import { IoMdHome } from "react-icons/io";
import image1 from "../../assets/avatar1.webp";
import { Doughnutptions } from "../../components/common/Chats";
import { ActBirth } from "./Components/Activities&Birthday";
import { Attendance } from "./Components/Attendance";
import { EmployeeDept } from "./Components/EmpDept";
import SalesOverview from "./Components/SalesOverview";
import Invoices from "./Components/InvoiceOverview";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
// import FlashMessage from "../../components/common/modals/FlashMessage";

const AdminDashboard = () => {
  const route = all_routes;
  const barData = {
    labels: [
      "HR",
      "Marketing",
      "Accounting",
      "Development",
      "Marketing",
      "Accounting",
      "Design",
    ],
    datasets: [
      {
        label: "Employees",
        data: [20, 40, 35, 25, 43, 65, 30],
        backgroundColor: "#0d6efd",
      },
    ],
  };

  const doughnutData = {
    labels: ["Present", "Late", "Half Day", "Absent"],
    datasets: [
      {
        label: "Attendance",
        data: [75, 10, 5, 10],
        backgroundColor: ["#198754", "#ffc107", "#0dcaf0", "#dc3545"],
        // borderWidth: 2,
        // cutout: '70%',
      },
    ],
  };

  const taskData = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        label: "Tasks",
        data: [124, 16, 40],
        backgroundColor: ["#198754", "#ffc107", "#dc3545"],
      },
    ],
  };

  const numberData = [
    {
      title: "Attendance",
      value: "92.99%",
      status: "+2.1%",
      color: "bg-dark text-white",
      icon: "ti-calendar-check",
    },
    {
      title: "Total Projects",
      value: "50/94",
      status: "-2.1%",
      color: "bg-secondary text-white",
      icon: "ti-layout-dashboard",
    },
    {
      title: "Total Clients",
      value: "69/86",
      status: "+1.1%",
      color: "bg-primary text-white",
      icon: "ti-users",
    },
    {
      title: "Total Tasks",
      value: "25/28",
      status: "+2.1%",
      color: "bg-success text-white",
      icon: "ti-list-check",
    },
    {
      title: "Earnings",
      value: "$2144",
      status: "+2.6%",
      color: "bg-warning text-dark",
      icon: "ti-currency-dollar",
    },
    {
      title: "Profit This Week",
      value: "$5544",
      status: "+2.4%",
      color: "bg-danger text-white",
      icon: "ti-chart-bar",
    },
    {
      title: "Avg. Task Time",
      value: "1h 32m",
      status: "-0.6%",
      color: "bg-info text-dark",
      icon: "ti-clock-hour-4",
    },
    {
      title: "New Signups",
      value: "124",
      status: "+3.8%",
      color: "bg-danger text-white",
      icon: "ti-user-plus",
    },
  ];

  return (
    <>
      <Helmet>
        <title>DCC HRMS - Admin Dashboard</title>
        <meta name="Companies" content="This is Companies page of DCC HRMS." />
      </Helmet>
      <div className="page-wrapper">
        <div className="content">
          {/* {error && (
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
            )} */}

          <div className="row">
            <div className="col-md-12">
              <Container fluid className="p-4 pt-0">
                <div className="col-md-12">
                  {/* Page Header */}
                  <div className="page-header mb-0">
                    <div className="row align-items-center">
                      <div className="col-sm-4">
                        <h3 className="page-title fw-bold mb-0">
                          Admin Dashboard
                        </h3>
                      </div>
                      <div className="col-sm-8 text-sm-end">
                        <div className="head-icons">
                          <CollapseHeader />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Page Header */}
                </div>
                {/* Contact User */}
                <div className="contact-head mt-n1">
                  <div className="row align-items-center">
                    <div className="col-sm-6">
                      <ul
                        className="contact-breadcrumb"
                        style={{ marginTop: "-3px", fontSize: "13px" }}
                      >
                        <li>
                          <Link to={route.contactGrid}>
                            <IoMdHome /> / Dashboard
                          </Link>
                        </li>
                        <li>Admin Dashboard</li>
                      </ul>
                    </div>
                    <div className="col-sm-6 text-sm-end">
                      {/* <div className="contact-pagination">
                      <ul>
                        <li>
                          <Link to={route.contactDetails}>
                            <i className="ti ti-chevron-left" />
                          </Link>
                        </li>
                        <li>
                          <Link to={route.contactDetails}>
                            <i className="ti ti-chevron-right" />
                          </Link>
                        </li>
                      </ul>
                    </div> */}
                    </div>
                  </div>
                </div>
                <div className="card shadow-xl border">
                  <div className="card-body pb-2">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center mb-2">
                        <div className="avatar avatar-xl rounded online online-sm me-3 flex-shrink-0">
                          {/* {companyDetail?.logo ? (
                          <img
                            src={companyDetail?.logo} 
                            alt="Company Logo"
                            className="preview"
                          />
                        ) : ( */}
                          <img
                            src={image1}
                            alt="Company Logo"
                            className="preview rounded-circle"
                          />
                          {/* )} */}
                          <span className="status online" />
                        </div>
                        <div>
                          <h4 className="mb-2 text-capitalize">
                            Welcome Back , Admin
                          </h4>
                          <p
                            style={{ fontSize: "14px" }}
                            className="mb-0 text-capitalize"
                          >
                            You have 21 Pending Approvals & 14 Leave Requests
                          </p>
                        </div>
                      </div>
                      <div className="contacts-action">
                        <Link
                          to="#"
                          className="btn btn-danger"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_add_deal"
                        >
                          <i className="ti ti-circle-plus" />
                          Add Project
                        </Link>
                        <Link
                          to="#"
                          className="btn-icon"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit_company"
                        >
                          <i className="ti ti-edit-circle" />
                        </Link>
                        <div className="act-dropdown">
                          <Link
                            to="#"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="ti ti-dots-vertical" />
                          </Link>
                          <div className="dropdown-menu dropdown-menu-right">
                            <Link
                              className="dropdown-item"
                              to="#"
                              // onClick={() => handleDeleteCompany(true)}
                            >
                              <i className="ti ti-trash text-danger" />
                              Delete
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Top Cards */}
                <Row className=" mb-4">
                  {numberData.map((item, i) => (
                    <Col key={i} md={6} lg={3} className="mb-3 h-100">
                      <Card className="shadow-lg">
                        <Card.Body>
                          <div
                            className={`p-2 text-center rounded-circle ${item.color} h-25 w-25`}
                          >
                            <i className={`ti ${item.icon}`} />
                          </div>
                          <h3 className="small h5 my-2 text-muted">
                            {item.title}
                          </h3>
                          <div className="d-flex gap-2  mb-3">
                            <h5>{item.value}</h5>
                            <small className="text-success">
                              {item.status}
                            </small>
                          </div>
                          <div className="small text-muted"> View All</div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* Employee by Department */}
                <EmployeeDept />
                {/* <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Employees by Department</Card.Title>
              <Bar data={barData} options={{ responsive: true }} height={100} />
            </Card.Body>
          </Card>
        </Col>
      </Row> */}

                {/* Status & Attendance */}
                <Row className="mb-4">
                  <Col md={6}>
                    <Card className="shadow-sm">
                      <Card.Body>
                        <Card.Title>Attendance Overview</Card.Title>
                        <Doughnut
                          data={doughnutData}
                          options={Doughnutptions}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="shadow-sm">
                      <Card.Body>
                        <Card.Title>Task Statistics</Card.Title>
                        <Pie data={taskData} />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <div className="row d-flex">
                  <div className="col-lg-6 d-flex min-vh-50">
                    <div className=" card shadow-lg w-100">
                      <SalesOverview />
                    </div>
                  </div>
                  <div className="col-lg-6 d-flex min-vh-50">
                    <div className="card shadow-lg w-100">
                      <Invoices />
                    </div>
                  </div>
                </div>
                <Attendance />
                <ActBirth />
              </Container>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default AdminDashboard;
