import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployeeDetails,
  fetchEmployeeAttendance,
  fetchEmployeeLeaves,
} from "../../../redux/employeeDashboard";
import UpdateBasicInfo from "../Components/DashboardUpdateBasicInfo";

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
    { label: "Today", hours: attendance?.today?.working_hours ?? 0 },
    { label: "This Week", hours: attendance?.thisWeek?.total_hours ?? 0 },
    { label: "Last Week", hours: attendance?.lastWeek?.total_hours ?? 0 },
    { label: "This Month", hours: attendance?.thisMonth?.total_hours ?? 0 },
    { label: "Last Month", hours: attendance?.lastMonth?.total_hours ?? 0 },
  ];

  const totalHours = data.reduce((sum, item) => sum + item.hours, 0);

  useEffect(() => {
    dispatch(fetchEmployeeDetails());
    dispatch(fetchEmployeeAttendance());
    dispatch(fetchEmployeeLeaves());
  }, [dispatch]);

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
            className="d-flex justify-content-between align-items-center mb-4 p-2"
            style={{
              background: "linear-gradient(135deg, #6c63ff, #4e54c8)",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              color: "#fff",
              borderRadius: "0.5rem",
            }}
          >
            {/* Left: Avatar + Details */}
            <div className="d-flex align-items-center gap-3">
              <img
                src={
                  profile?.profile_pic?.trim()
                    ? profile.profile_pic
                    : "https://i.pravatar.cc/100"
                }
                className="rounded-circle border border-3"
                width={70}
                height={70}
                alt="avatar"
              />
              <div>
                <h5 className="mb-1 text-white">
                  {profile?.full_name
                    ? capitalizeWords(profile.full_name)
                    : "Unnamed"}
                </h5>
                <p className="mb-0 small text-light">
                  {profile?.designation || "-"}
                </p>
                <p className="mb-0 small text-black fw-bold">
                  {profile?.department || "-"}
                </p>
              </div>
            </div>

            {/* Right: Edit Button */}
            <div>
              <button
                type="button"
                className="btn btn-lg hover-shadow text-white  border-1 p-1 border-white rounded"
                data-bs-toggle="modal"
                data-bs-target="#update_basic_info_modal"
                title="Edit Profile"
              >
                ✏️
              </button>
            </div>
          </div>

          {/* Details */}
          <div style={{ lineHeight: "1.8", margin: "0 1rem" }}>
            <p className="mb-2 fs-5 text-dark">
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
          </div>

          {/* Edit Button */}
        </div>
      </div>

      {/* Modal outside of button */}
      <UpdateBasicInfo employeeDetail={profile} />
    </div>
  );
};

export default EmployeeDashboard;
