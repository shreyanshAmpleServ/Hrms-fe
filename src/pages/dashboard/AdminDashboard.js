import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import image1 from "../../assets/avatar1.webp";
import CollapseHeader from "../../components/common/collapse-header";
import { all_routes } from "../../routes/all_routes";
import { ActBirth } from "./Components/Activities&Birthday";
import { EmployeeDept } from "./Components/EmpDept";
import { EmployeeByDesignations } from "./Components/EmployeeByDesignations";
import { EmployeeByStatus } from "./Components/EmployeeByStatus";
import { useDispatch } from "react-redux";
import { fetchEmployeeAttendanceCount } from "../../redux/Dashboards/DashboardsCount";
import { useSelector } from "react-redux";
import { fetchEmployeeByDepartment } from "../../redux/Dashboards/EmployeeByDepartment";
import { fetchEmployeeByDesignations } from "../../redux/Dashboards/EmployeeByDesignations";
import { fetchEmployeeByStatus } from "../../redux/Dashboards/EmployeeByStatus";
import { fetchUpcomingBirthdays } from "../../redux/Dashboards/UpcomingBirthdays";
import { fetchUpcomingAnniversaries } from "../../redux/Dashboards/UpcomingAnniversaries";
import { fetchAttendanceOverview } from "../../redux/Dashboards/AttendanceOverview";

const notifications = [
  {
    image: "image1.jpg",
    name: "Matt Morgan",
    project: "Added new project HRMS Dashboard",
    time: "5:30 PM",
  },
  {
    image: "image2.jpg",
    name: "John Doe",
    project: "Completed the Marketing Plan",
    time: "3:00 PM",
  },
  {
    image: "image3.jpg",
    name: "Jane Smith",
    project: "Reviewed User Stories for the App",
    time: "1:15 PM",
  },
  {
    image: "image1.jpg",
    name: "Matt Morgan",
    project: "Added new project HRMS Dashboard",
    time: "5:30 PM",
  },
  {
    image: "image2.jpg",
    name: "John Doe",
    project: "Completed the Marketing Plan",
    time: "3:00 PM",
  },
  {
    image: "image3.jpg",
    name: "Jane Smith",
    project: "Reviewed User Stories for the App",
    time: "1:15 PM",
  },
  {
    image: "image1.jpg",
    name: "Matt Morgan",
    project: "Added new project HRMS Dashboard",
    time: "5:30 PM",
  },
  {
    image: "image2.jpg",
    name: "John Doe",
    project: "Completed the Marketing Plan",
    time: "3:00 PM",
  },
  {
    image: "image3.jpg",
    name: "Jane Smith",
    project: "Reviewed User Stories for the App",
    time: "1:15 PM",
  },
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { attendanceCount } = useSelector((state) => state.dashboardsCount);
  const { employeeByDepartment } = useSelector(
    (state) => state.employeeByDepartment
  );
  const { employeeByDesignations } = useSelector(
    (state) => state.employeeByDesignations
  );
  const { employeeByStatus } = useSelector((state) => state.employeeByStatus);
  const { upcomingBirthdays } = useSelector((state) => state.upcomingBirthdays);
  const { upcomingAnniversaries } = useSelector(
    (state) => state.upcomingAnniversaries
  );
  const { attendanceOverview } = useSelector(
    (state) => state.attendanceOverview
  );
  useEffect(() => {
    dispatch(fetchEmployeeAttendanceCount());
    dispatch(fetchEmployeeByDepartment());
    dispatch(fetchEmployeeByDesignations());
    dispatch(fetchEmployeeByStatus());
    dispatch(fetchUpcomingBirthdays());
    dispatch(fetchUpcomingAnniversaries());
    dispatch(fetchAttendanceOverview());
  }, []);

  const attendance = {
    labels: attendanceOverview?.labels || [],
    datasets: [
      {
        label: " Employees",
        data: attendanceOverview?.values || [],
        backgroundColor: ["#198754", "#dc3545", "#0dcaf0", "#ffc107"],
      },
    ],
  };

  const departmentData = {
    labels: employeeByDepartment?.labels || [],
    datasets: [
      {
        label: " Employees",
        data: employeeByDepartment?.values || [],
        backgroundColor: [
          "#FF6B6B",
          "#4ECDC4",
          "#45B7D1",
          "#96CEB4",
          "#FFEEAD",
          "#D4A5A5",
          "#9B59B6",
        ],
      },
    ],
  };

  const numberData = [
    {
      title: "Total Employees",
      value: attendanceCount?.total_employees || 0,
      color: "bg-dark text-white",
      icon: "ti-users",
    },
    {
      title: "Absent Employees",
      value: attendanceCount?.absent || 0,
      color: "bg-secondary text-white",
      icon: "ti-users",
    },
    {
      title: "Present Employees",
      value: attendanceCount?.present || 0,
      color: "bg-primary text-white",
      icon: "ti-users",
    },
    {
      title: "WFH Employees",
      value: attendanceCount?.work_from_home || 0,
      color: "bg-success text-white",
      icon: "ti-users",
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
          <div className="row">
            <div className="col-md-12">
              <div className="">
                <div className="col-md-12">
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
                </div>

                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center mb-2">
                        <div className="avatar avatar-xl rounded online online-sm me-3 flex-shrink-0">
                          <img
                            src={image1}
                            alt="Company Logo"
                            className="preview rounded-circle"
                          />
                          <span className="status online" />
                        </div>
                        <div>
                          <h4 className="mb-2 text-capitalize">
                            Welcome Back, Admin
                          </h4>
                          <p
                            style={{ fontSize: "14px" }}
                            className="mb-0 text-capitalize"
                          >
                            You have 21 Pending Approvals & 14 Leave Requests
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {numberData.map((item, i) => (
                    <div key={i} className="col-md-6 col-lg-3 h-100">
                      <div className="card shadow-sm">
                        <div className="p-3">
                          <div
                            className={`p-2 d-flex bg-white align-items-center justify-content-center text-center rounded-circle ${item.color}`}
                            style={{ width: "40px", height: "40px" }}
                          >
                            <i className={`ti ${item.icon}`} />
                          </div>
                          <h3 className="small h5 my-2 text-muted">
                            {item.title}
                          </h3>
                          <div className="d-flex gap-2 mb-3">
                            <h5>{item.value}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <EmployeeDept data={employeeByDepartment} />
                <EmployeeByDesignations data={employeeByDesignations} />
                <EmployeeByStatus data={employeeByStatus} />

                <div className="row">
                  <div className="col-md-6">
                    <div className="card shadow-sm">
                      <div className="d-flex flex-column">
                        <div className="row align-items-center p-3">
                          <h5 className="col-10 fw-semibold">
                            Attendance Overview
                          </h5>
                        </div>
                        <hr className="border-secondary my-1" />
                        <div className="mb-3 flex-grow-1 p-2">
                          <div style={{ minHeight: "350px" }}>
                            <Pie data={attendance} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card shadow-sm">
                      <div className="d-flex flex-column">
                        <div className="row align-items-center p-3">
                          <h5 className="col-10 fw-semibold">
                            Department Overview
                          </h5>
                        </div>
                        <hr className="border-secondary my-1" />
                        <div className="mb-3 flex-grow-1 p-2">
                          <div style={{ minHeight: "350px" }}>
                            <Pie data={departmentData} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <ActBirth
                  upcomingBirthdays={upcomingBirthdays}
                  upcomingAnniversaries={upcomingAnniversaries}
                />
                <div className="col-lg-12">
                  <div className="card shadow-sm w-100">
                    <div className="d-flex flex-column">
                      <div className="row d-flex align-items-center p-3">
                        <h5 className="col-10 fw-semibold">
                          Recent Activities
                        </h5>
                        <Link to="#" className="text-end col-2">
                          View All
                        </Link>
                      </div>
                      <hr className="border-secondary my-1" />
                      <div className="flex-grow-1">
                        {notifications.map((notification, index) => (
                          <div key={index} className="row px-3 py-2">
                            <div className="col-10 align-items-center gap-2 d-flex">
                              <img
                                src={image1}
                                alt="Logo"
                                style={{ height: "2.5rem", width: "2.5rem" }}
                                className="preview rounded-circle"
                              />
                              <div>
                                <div className="h6">{notification.name}</div>
                                <div style={{ fontSize: ".7rem" }}>
                                  {notification.project}
                                </div>
                              </div>
                            </div>
                            <div className="col-2 p-0 text-nowrap fw-bolder mt-2">
                              {notification.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default AdminDashboard;
