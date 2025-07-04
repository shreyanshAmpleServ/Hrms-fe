// components/EmployeeDashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeeDetails,
  fetchEmployeeAttendance,
  fetchEmployeeLeaves,
} from "../../../redux/employeeDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MdWatchLater } from "react-icons/md";
import EmpDashboardInform from "../Components/EmpDashboardInform";
const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { loading, error, profile, attendance } = useSelector(
    (state) => state.employeeDashboard
  );
  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };
  const data = [
    {
      label: "Today",
      hours: attendance?.today?.working_hours ?? 0,
    },
    {
      label: "This Week",
      hours: attendance?.thisWeek?.total_hours ?? 0,
    },
    {
      label: "Last Week",
      hours: attendance?.lastWeek?.total_hours ?? 0,
    },
    {
      label: "This Month",
      hours: attendance?.thisMonth?.total_hours ?? 0,
    },
    {
      label: "Last Month",
      hours: attendance?.lastMonth?.total_hours ?? 0,
    },
  ];
  const totalHours = data.reduce((sum, item) => sum + item.hours, 0);

  useEffect(() => {
    dispatch(fetchEmployeeDetails());
    dispatch(fetchEmployeeAttendance());

    dispatch(fetchEmployeeLeaves());
  }, [dispatch]);

  // if (loading) {
  //   return <div className="text-center mt-5">Loading...</div>;
  // }
  // if (error) {
  //   return <div className="text-danger text-center mt-5">{error}</div>;
  // }

  return (
    <div className="row h-100">
      {/* Profile Card */}
      <div className="col-md-12">
        <div
          className="shadow-sm rounded h-100 bg-white"
          style={{ borderRadius: "1rem", overflow: "hidden" }}
        >
          {/* Top Section */}
          <div
            className="d-flex gap-3 mb-4 align-items-center p-2 w-400 h-30"
            style={{
              background: "linear-gradient(135deg, #343a40, #495057)",
              borderRadius: "0.75rem",
              color: "#fff",
            }}
          >
            <img
              src={
                profile?.profile_pic && profile.profile_pic.trim() !== ""
                  ? profile.profile_pic
                  : "https://i.pravatar.cc/100"
              }
              className="rounded-circle border border-3"
              width={70}
              height={70}
              alt="avatar"
            />
            <div>
              <h5 className="mb-1 text-white ">
                {profile?.full_name
                  ? capitalizeWords(profile.full_name)
                  : "Unnamed"}
              </h5>

              <p className="mb-0 small text-light">
                {profile?.designation || "-"}
              </p>
              <p className="mb-0 small text-success fw-bold">
                {profile?.department || "-"}
              </p>
            </div>
          </div>

          {/* Details */}
          <div style={{ lineHeight: "1.8", margin: "0 1rem" }}>
            <p className="mb-2  fs-5 text-dark">
              <strong>Employee Code:</strong> {profile?.employee_code || "-"}
            </p>
            <hr />
            <p className="mb-2">
              📞 <strong>Phone:</strong> {profile?.phone_number || "-"}
            </p>

            <p className="mb-2">
              📧 <strong>Email:</strong> {profile?.email || "-"}
            </p>

            <p className="mb-2">
              🚻 <strong>Gender:</strong> {profile?.gender || "-"}
            </p>

            <p className="mb-2">
              🏢 <strong>Date of Birth:</strong>{" "}
              {profile?.date_of_birth
                ? new Date(profile.date_of_birth).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </p>

            <p className="mb-2">
              🏢 <strong>Joined:</strong>{" "}
              {profile?.join_date
                ? new Date(profile.join_date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "-"}
            </p>

            <hr />
          </div>
        </div>
      </div>

      {/* <div className="col-md-4">
          <div className="shadow-sm rounded p-4 bg-white h-100">
            <h5 className="mb-3">🎂 Upcoming Birthdays</h5>
            {birthdays.length === 0 ? (
              <p className="text-muted">No upcoming birthdays.</p>
            ) : (
              <ul className="list-unstyled">
                {birthdays.map((b, i) => (
                  <li key={i} className="mb-2">
                    <strong>{b.name}</strong> - {b.date}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div> */}
      {/* Attendance Summary */}
      {/* <div className="col-md-4">
        <div
          className="shadow-sm rounded p-4 bg-white h-100"
          style={{ borderRadius: "1rem", lineHeight: "1.8" }}
        >
          <h5 className="mb-4 d-flex align-items-center">
            <MdWatchLater size={22} className="me-2 text-primary" />
            Attendance Summary
          </h5>

          <p className="mb-2">
            <strong>📅 Today:</strong>{" "}
            <span className="text-dark">
              {attendance?.today?.working_hours ?? 0} hours
            </span>
          </p>

          <p className="mb-2">
            <strong>📈 This Week:</strong>{" "}
            <span className="text-dark">
              {attendance?.thisWeek?.total_hours ?? 0} /{" "}
              {attendance?.thisWeek?.target ?? 0} hrs (
              {attendance?.thisWeek?.percentage ?? 0}%)
            </span>
          </p>

          <p className="mb-2">
            <strong>📉 Last Week:</strong>{" "}
            <span className="text-dark">
              {attendance?.lastWeek?.total_hours ?? 0} /{" "}
              {attendance?.lastWeek?.target ?? 0} hrs (
              {attendance?.lastWeek?.percentage ?? 0}%)
            </span>
          </p>

          <p className="mb-2">
            <strong>📆 This Month:</strong>{" "}
            <span className="text-dark">
              {attendance?.thisMonth?.total_hours ?? 0} /{" "}
              {attendance?.thisMonth?.target ?? 0} hrs (
              {attendance?.thisMonth?.percentage ?? 0}%)
            </span>
          </p>

          <p className="mb-0">
            <strong>🗓️ Last Month:</strong>{" "}
            <span className="text-dark">
              {attendance?.lastMonth?.total_hours ?? 0} /{" "}
              {attendance?.lastMonth?.target ?? 0} hrs (
              {attendance?.lastMonth?.percentage ?? 0}%)
            </span>
          </p>
        </div>
      </div> */}

      {/* <div className="col-md-8">
        <div className="shadow-sm rounded p-4 bg-white h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">📊 Attendance Summary</h5>
            <span className="badge bg-primary fs-6">
              🕒 Total: {totalHours.toFixed(2)} hours
            </span>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(value) => `${value}h`} />
              <Tooltip formatter={(value) => `${value} hours`} />
              <Legend />
              <Bar dataKey="hours" fill="#4c8bf5" name="Working Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {/* Leaves Summary */}
      {/* <div className="col-md-4">
        <div className="shadow-sm rounded p-4 bg-white h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">📅 Leave Details</h5>
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ti-calendar"></i> 2024
            </button>
          </div>

          <div className="row text-center mb-3">
            <div className="col-6">
              <p className="mb-1 text-muted">Total Leaves</p>
              <h6 className="fw-bold">16</h6>
            </div>
            <div className="col-6">
              <p className="mb-1 text-muted">Taken</p>
              <h6 className="fw-bold">10</h6>
            </div>
          </div>

          <div className="row text-center mb-3">
            <div className="col-6">
              <p className="mb-1 text-muted">Absent</p>
              <h6 className="fw-bold">2</h6>
            </div>
            <div className="col-6">
              <p className="mb-1 text-muted">Request</p>
              <h6 className="fw-bold">0</h6>
            </div>
          </div>

          <div className="row text-center mb-4">
            <div className="col-6">
              <p className="mb-1 text-muted">Worked Days</p>
              <h6 className="fw-bold">240</h6>
            </div>
            <div className="col-6">
              <p className="mb-1 text-muted">Loss of Pay</p>
              <h6 className="fw-bold">2</h6>
            </div>
          </div>

          <div className="d-grid">
            <button className="btn btn-dark btn-sm">Apply New Leave</button>
          </div>
        </div>
      </div> */}

      {/* <div className="col-md-4">
        <div className="shadow-sm rounded p-4 bg-white h-100">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">📅 Leave Details</h5>
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ti-calendar"></i> {new Date().getFullYear()}
            </button>
          </div>

          <div className="row text-center mb-3">
            <div className="col-6">
              <p className="mb-1 text-muted">Total Leaves</p>
              <h6 className="fw-bold">{leaveStats.total_leaves ?? "-"}</h6>
            </div>
            <div className="col-6">
              <p className="mb-1 text-muted">Taken</p>
              <h6 className="fw-bold">{leaveStats.taken ?? "-"}</h6>
            </div>
          </div>

          <div className="row text-center mb-3">
            <div className="col-6">
              <p className="mb-1 text-muted">Absent</p>
              <h6 className="fw-bold">{leaveStats.absent ?? "-"}</h6>
            </div>
            <div className="col-6">
              <p className="mb-1 text-muted">Request</p>
              <h6 className="fw-bold">{leaveStats.request ?? "-"}</h6>
            </div>
          </div>

          <div className="row text-center mb-4">
            <div className="col-6">
              <p className="mb-1 text-muted">Worked Days</p>
              <h6 className="fw-bold">{leaveStats.worked_days ?? "-"}</h6>
            </div>
            <div className="col-6">
              <p className="mb-1 text-muted">Loss of Pay</p>
              <h6 className="fw-bold">{leaveStats.loss_of_pay ?? "-"}</h6>
            </div>
          </div>

          <div className="d-grid">
            <button className="btn btn-dark btn-sm">Apply New Leave</button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default EmployeeDashboard;
