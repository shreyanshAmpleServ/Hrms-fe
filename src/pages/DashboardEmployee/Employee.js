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
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import CollapseHeader from "../../components/common/collapse-header";
import { fetchEmployeeAttendanceCount } from "../../redux/Dashboards/DashboardsCount";
import { fetchEmployeeByDepartment } from "../../redux/Dashboards/EmployeeByDepartment";
import { fetchEmployeeByDesignations } from "../../redux/Dashboards/EmployeeByDesignations";
import { fetchEmployeeByStatus } from "../../redux/Dashboards/EmployeeByStatus";
import { fetchUpcomingBirthdays } from "../../redux/Dashboards/UpcomingBirthdays";
import { fetchUpcomingAnniversaries } from "../../redux/Dashboards/UpcomingAnniversaries";
import { fetchAttendanceOverview } from "../../redux/Dashboards/AttendanceOverview";

import DashboardFetch from "./Components/DashboardFetch";
import AttendanceSummary from "./Components/AttendanceSummary";
import EmployeeLeaveSummary from "./Components/EmpDashboardInform";
import { ActBirth } from "./Components/Activities&Birthday";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardEmployee = () => {
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
  }, [dispatch]);

  const attendance = {
    labels: attendanceOverview?.labels || [],
    datasets: [
      {
        label: "Employees",
        data: attendanceOverview?.values || [],
        backgroundColor: ["#198754", "#dc3545", "#0dcaf0", "#ffc107"],
      },
    ],
  };

  const departmentData = {
    labels: employeeByDepartment?.labels || [],
    datasets: [
      {
        label: "Employees",
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
        <title>DCC HRMS - Employee Dashboard</title>
        <meta name="Companies" content="This is Companies page of DCC HRMS." />
      </Helmet>

      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="page-header mb-0">
                <div className="row align-items-center">
                  <div className="col-sm-12 text-sm-end">
                    <CollapseHeader />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🟢 SIDE BY SIDE ROW */}
          <div className="row">
            <div className="col-md-4">
              <DashboardFetch />
            </div>
            <div className="col-md-8">
              <AttendanceSummary />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card shadow-sm mt-4">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <EmployeeLeaveSummary />{" "}
                  </div>
                </div>
              </div>
            </div>

            <ActBirth
              upcomingBirthdays={upcomingBirthdays}
              upcomingAnniversaries={upcomingAnniversaries}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardEmployee;
