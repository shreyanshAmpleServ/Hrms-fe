import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "../../../../components/common/dataTableNew/index";
import usePermissions from "../../../../components/common/Permissions.js";
import { fetchBasicSalary } from "../../../../redux/BasicSalary/index.js";
import DeleteAlert from "../../../BasicSalary/alert/DeleteAlert.js";
import AddEditModal from "../../../BasicSalary/modal/AddEditModal.js";

const EmployeeComponent = ({ employeeDetail }) => {
  const [selected, setSelected] = React.useState(null);
  const [mode, setMode] = React.useState("add");
  const { isView, isCreate, isUpdate, isDelete } =
    usePermissions("Employee Component");

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Pay Grade",
      dataIndex: "pay_grade_id",
      render: (text, record) => (
        <Link
          to="#"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvas_add_edit_basic_salary"
          onClick={() => {
            setMode("edit");
            setSelected(record);
          }}
        >
          {text === 1
            ? "Grade A - ₹15,000 to ₹25,000"
            : text === 2
              ? "Grade B - ₹25,001 to ₹40,000"
              : text === 3
                ? "Grade C - ₹40,001 to ₹60,000"
                : text === 4
                  ? "Grade D - ₹60,001 to ₹90,000"
                  : text === 5
                    ? "Grade E - ₹90,001 and above"
                    : "-"}
        </Link>
      ),
    },
    {
      title: "Pay Grade Level",
      dataIndex: "pay_grade_level",
      render: (text) =>
        text === 1
          ? "Level 1 - Entry"
          : text === 2
            ? "Level 2 - Junior"
            : text === 3
              ? "Level 3 - Mid"
              : text === 4
                ? "Level 4 - Senior"
                : text === 5
                  ? "Level 5 - Executive"
                  : "-",
    },
    {
      title: "Allowance Group",
      dataIndex: "allowance_group",
      render: (text) =>
        text === "1"
          ? "Standard Allowance"
          : text === "2"
            ? "Executive Allowance"
            : text === "3"
              ? "Managerial Allowance"
              : text === "4"
                ? "Field Staff Allowance"
                : text === "5"
                  ? "Technical Staff Allowance"
                  : "-",
    },
    {
      title: "From",
      dataIndex: "effective_from",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "To",
      dataIndex: "effective_to",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "-"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) =>
        text === "Active" ? (
          <span className="badge bg-success">Active</span>
        ) : (
          <span className="badge bg-danger">Inactive</span>
        ),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      render: (text) => text || "-",
    },

    ...(isUpdate || isDelete
      ? [
          {
            title: "Actions",
            dataIndex: "actions",
            render: (_, record) => (
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
                  {isUpdate && (
                    <Link
                      className="dropdown-item edit-popup"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add_edit_basic_salary"
                      onClick={() => {
                        setMode("edit");
                        setSelected(record);
                      }}
                    >
                      <i className="ti ti-edit text-blue"></i> Edit
                    </Link>
                  )}
                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => handleDeleteEmployee(record)}
                    >
                      <i className="ti ti-trash text-danger"></i> Delete
                    </Link>
                  )}
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];
  const { basicSalary, loading } = useSelector((state) => state.basicSalary);

  React.useEffect(() => {
    if (employeeDetail?.id) {
      dispatch(fetchBasicSalary({ employee_id: employeeDetail?.id }));
    }
  }, [dispatch, employeeDetail?.id]);

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const handleDeleteEmployee = (employee) => {
    if (employee) {
      // dispatch(deleteEmployee(employee?.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header p-4 d-flex justify-content-between align-items-center">
          <h4 className="card-title">Component</h4>
          {isCreate && (
            <Link
              to="#"
              className="btn btn-primary"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_add_edit_basic_salary"
              onClick={() => {
                setMode("add with employee");
              }}
            >
              <i className="ti ti-square-rounded-plus me-2" />
              Create
            </Link>
          )}
        </div>
        <div className="card-body">
          <div className="table-responsive custom-table">
            <Table
              dataSource={basicSalary?.data || []}
              columns={columns}
              loading={loading}
              isView={isView}
              paginationData={false}
            />
          </div>
        </div>
      </div>

      <AddEditModal
        mode={mode}
        setMode={setMode}
        initialData={selected}
        setSelected={setSelected}
        employee_id={employeeDetail?.id}
        department_id={employeeDetail?.department_id}
        position_id={employeeDetail?.department_id}
      />
      <DeleteAlert
        label="Employee Component"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={handleDeleteEmployee}
      />
    </>
  );
};

export default EmployeeComponent;
