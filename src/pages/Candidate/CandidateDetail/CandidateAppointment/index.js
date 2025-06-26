import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "../../../../components/common/dataTableNew/index";
import usePermissions from "../../../../components/common/Permissions.js";
import {
  deleteAppointment,
  fetchAppointments,
} from "../../../../redux/AppointmentLetters";
import DeleteAlert from "../../../AppointmentLetters/DeleteConfirmation";
import AddEditModal from "../../../AppointmentLetters/ManageAppointments";

const CandidateAppointment = ({ candidateDetail }) => {
  const [appointments, setAppointments] = React.useState(null);
  const [mode, setMode] = React.useState("add");
  const { isView, isCreate, isUpdate, isDelete } = usePermissions(
    "Appointment Letters"
  );

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Candidate",
      dataIndex: "appointment_candidate",
      render: (text) => text.full_name || "-",
    },
    {
      title: "Designation",
      dataIndex: "appointment_designation",
      render: (text) => text.designation_name || "-",
    },
    {
      title: "Appointment Date",
      dataIndex: "issue_date",
      render: (text) => (text ? moment(text).format("DD-MM-YYYY") : "---"),
    },
    {
      title: "Terms Summary",
      dataIndex: "terms_summary",
      render: (text) => text || "---",
    },
    ...(isDelete || isUpdate
      ? [
          {
            title: "Action",
            render: (text, a) => (
              <div className="dropdown table-action">
                <Link
                  to="#"
                  className="action-icon "
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa fa-ellipsis-v"></i>
                </Link>
                <div className="dropdown-menu dropdown-menu-right">
                  {isUpdate && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvas_add_appointment"
                      onClick={() => setAppointments(a)}
                    >
                      <i className="ti ti-edit text-blue" /> Edit
                    </Link>
                  )}

                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => setAppointments(a)}
                    >
                      <i className="ti ti-trash text-danger" /> Delete
                    </Link>
                  )}
                </div>
              </div>
            ),
          },
        ]
      : []),
  ];

  const { appointment, loading } = useSelector((state) => state.appointment);

  React.useEffect(() => {
    if (candidateDetail?.id) {
      dispatch(fetchAppointments({ candidate_id: candidateDetail?.id }));
    }
  }, [candidateDetail?.id]);

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const deleteData = () => {
    if (appointment) {
      dispatch(deleteAppointment(appointment.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header p-4 d-flex justify-content-between align-items-center">
          <h4 className="card-title">Appointment</h4>
          {isCreate && (
            <Link
              to="#"
              className="btn btn-primary"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvas_add_appointment  "
              onClick={() => {
                setMode("add with candidate");
              }}
            >
              <i className="ti ti-square-rounded-plus me-2" />
              Add Appointment
            </Link>
          )}
        </div>
        <div className="card-body">
          <div className="table-responsive custom-table">
            <Table
              dataSource={appointment?.data || []}
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
        appointment={appointments}
        setAppointment={setAppointments}
        candidate_id={candidateDetail?.id}
      />
      <DeleteAlert
        label="Appointment"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </>
  );
};

export default CandidateAppointment;
