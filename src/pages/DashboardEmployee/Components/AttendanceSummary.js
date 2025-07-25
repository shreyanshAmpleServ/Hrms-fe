import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeAttendance } from "../../../redux/employeeDashboard";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// utility to capitalize
const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const AttendanceSummary = () => {
  const dispatch = useDispatch();
  const { attendance } = useSelector((state) => state.employeeDashboard);

  useEffect(() => {
    dispatch(fetchEmployeeAttendance());
  }, [dispatch]);

  // show loader when fetching
  if (attendance.loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Fetching attendance data...</p>
        </div>
      </div>
    );
  }

  if (attendance.error) {
    return (
      <div
        className="col-md-12 d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <p className="text-danger">Error: {attendance.error}</p>
      </div>
    );
  }

  // always prepare data — even if empty
  const attendanceData = attendance.data?.data || {};

  const { today, thisWeek, lastWeek, thisMonth, lastMonth } = attendanceData;

  const data = [
    { label: "Today", hours: today?.working_hours ?? 0 },
    { label: "This Week", hours: thisWeek?.total_hours ?? 0 },
    { label: "Last Week", hours: lastWeek?.total_hours ?? 0 },
    { label: "This Month", hours: thisMonth?.total_hours ?? 0 },
    { label: "Last Month", hours: lastMonth?.total_hours ?? 0 },
  ];

  const chartData = data.map((item) => ({
    ...item,
    label: capitalizeWords(item.label),
  }));

  const totalHours = chartData.reduce((sum, item) => sum + item.hours, 0);

  return (
    <div className="col-md-12">
      <div className="shadow-sm rounded p-4 bg-white h-100">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">📊 Attendance Summary</h5>
          <span className="badge bg-primary fs-6">
            🕒 Total: {totalHours.toFixed(2)} hours
          </span>
        </div>

        {/* If totalHours is 0, show a friendly message inside chart */}
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
            <Bar
              dataKey="hours"
              fill={totalHours === 0 ? "#ccc" : "#6c63ff"}
              name="Working Hours"
            />
          </BarChart>
        </ResponsiveContainer>

        {totalHours === 0 && (
          <div className="text-center mt-3 text-muted">
            📭 No attendance records found yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSummary;
