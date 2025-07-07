import { Table } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchLeaveBalanceByEmployee } from "../../../../redux/leaveBalance";

const EmployeeLeaveInfo = () => {
  const { id: employeeId } = useParams();
  const dispatch = useDispatch();

  const { leaveBalanceByEmployee, loading } = useSelector(
    (state) => state.leaveBalance || {}
  );

  React.useEffect(() => {
    dispatch(fetchLeaveBalanceByEmployee({ employeeId }));
  }, [dispatch, employeeId]);

  const columns = [
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      render: (text) => text || "-",
    },
    {
      title: "Total Leave",
      dataIndex: "total_leave",
      render: (text) => text || "-",
    },
    {
      title: "Leave Taken",
      dataIndex: "leave_taken",
      render: (_, record) => record.total_leave - record.leave_balance,
    },
    {
      title: "Leave Balance",
      dataIndex: "leave_balance",
      render: (text) => text || "-",
    },
  ];

  return (
    <div className="card-body">
      <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2">
        <h4 className="mb-2">Leave Info</h4>
      </div>

      <div className="table-responsive custom-table">
        <Table
          columns={columns}
          dataSource={leaveBalanceByEmployee?.data || []}
          loading={loading}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default EmployeeLeaveInfo;
