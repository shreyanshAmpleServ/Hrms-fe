// components/EmployeeDashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeeDetails,
  fetchEmployeeAttendance,
  fetchEmployeeLeaves,
} from "../../../redux/employeeDashboard";

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  // const leaveStats = leaves || {};
  const { loading, error, profile, birthdays, attendance, leaves } =
    useSelector((state) => state.employeeDashboard);

  useEffect(() => {
    dispatch(fetchEmployeeDetails());
    dispatch(fetchEmployeeAttendance());
    dispatch(fetchEmployeeLeaves());
  }, [dispatch]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;

  return (
    <div className="row mb-4">
      {/* Profile Card */}
      <div className="col-md-4">
        <div className="shadow-sm rounded p-4 bg-white h-100">
          <div className="d-flex gap-3 mb-3 align-items-center">
            <img
              src={
                profile?.profile_pic && profile.profile_pic.trim() !== ""
                  ? profile.profile_pic
                  : "https://i.pravatar.cc/100"
              }
              className="rounded-circle"
              width={60}
              height={60}
              alt="avatar"
            />
            <div>
              <h6 className="mb-0">{profile?.full_name || "Unnamed"}</h6>
              <p className="text-muted small mb-0">
                {profile?.designation || "-"}
              </p>
              <p className="text-success small">{profile?.department || "-"}</p>
            </div>
          </div>

          <p>
            <strong>Full Name:</strong> {profile?.full_name || "-"}
          </p>
          <p>
            <strong>Phone:</strong> {profile?.phone_number || "-"}
          </p>
          <p>
            <strong>Email:</strong> {profile?.email || "-"}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {profile?.join_date
              ? new Date(profile.join_date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "-"}
          </p>
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
      <div className="col-md-4">
        <div className="shadow-sm rounded p-4 bg-white h-100">
          <h5 className="mb-3">🕒 Attendance Summary</h5>

          <p>
            <strong>Today:</strong> {attendance?.today?.working_hours ?? 0}{" "}
            hours
          </p>

          <p>
            <strong>This Week:</strong> {attendance?.thisWeek?.total_hours ?? 0}{" "}
            / {attendance?.thisWeek?.target ?? 0} hrs (
            {attendance?.thisWeek?.percentage ?? 0}%)
          </p>

          <p>
            <strong>Last Week:</strong> {attendance?.lastWeek?.total_hours ?? 0}{" "}
            / {attendance?.lastWeek?.target ?? 0} hrs (
            {attendance?.lastWeek?.percentage ?? 0}%)
          </p>

          <p>
            <strong>This Month:</strong>{" "}
            {attendance?.thisMonth?.total_hours ?? 0} /{" "}
            {attendance?.thisMonth?.target ?? 0} hrs (
            {attendance?.thisMonth?.percentage ?? 0}%)
          </p>

          <p>
            <strong>Last Month:</strong>{" "}
            {attendance?.lastMonth?.total_hours ?? 0} /{" "}
            {attendance?.lastMonth?.target ?? 0} hrs (
            {attendance?.lastMonth?.percentage ?? 0}%)
          </p>
        </div>
      </div>
      {/* Leaves Summary */}
      <div className="col-md-4">
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
      </div>

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
