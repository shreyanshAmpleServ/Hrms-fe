import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "../../../../components/common/dataTableNew/index";
import {
  deleteresume_upload,
  fetchresume_upload,
} from "../../../../redux/resumeUpload";
import DeleteAlert from "../../../resumeUpload/alert/DeleteAlert";
import AddEditModal from "../../../resumeUpload/modal/AddEditModal";
import AddButton from "../../../../components/datatable/AddButton";

const CandidateResume = ({ candidateDetail }) => {
  const [selected, setSelected] = React.useState(null);
  const [mode, setMode] = React.useState("add");
  const permissions = JSON?.parse(localStorage.getItem("permissions"));
  const allPermissions = permissions?.filter(
    (i) => i?.module_name === "Resume Upload"
  )?.[0]?.permissions;
  const isAdmin = localStorage.getItem("role")?.includes("admin");
  const isView = isAdmin || allPermissions?.view;
  const isCreate = isAdmin || allPermissions?.create;
  const isUpdate = isAdmin || allPermissions?.update;
  const isDelete = isAdmin || allPermissions?.delete;

  const dispatch = useDispatch();

  const columns = [
    {
      title: "Candidate",
      dataIndex: "resume_candidate",
      render: (value) => <div>{value?.full_name}</div>,
      sorter: (a, b) =>
        (a.resume_candidate?.full_name || "").localeCompare(
          b.resume_candidate?.full_name || ""
        ),
    },

    {
      title: "Resume",
      dataIndex: "resume_path",
      render: (_text, record) => (
        <a
          href={record.resume_path}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="d-inline-flex align-items-center gap-2 text-decoration-none"
          title="View or Download PDF"
        >
          <i className="ti ti-file-type-pdf fs-5"></i>
          <span>View </span>
        </a>
      ),
    },

    {
      title: "Uploaded On",
      dataIndex: "uploaded_on",
      render: (text) => moment(text).format("DD-MM-YYYY"),
      sorter: (a, b) => new Date(a.uploaded_on) - new Date(b.uploaded_on),
    },

    ...(isUpdate || isDelete
      ? [
          {
            title: "Actions",
            dataIndex: "actions",
            render: (_text, record) => (
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
                  {record.resume_path && (
                    <a
                      className="dropdown-item"
                      href={record.resume_path}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="ti ti-download text-success"></i> Download
                    </a>
                  )}

                  {isUpdate && (
                    <Link
                      className="dropdown-item edit-popup"
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#add_edit_resume_upload_modal"
                      onClick={() => {
                        setSelected(record);
                        setMode("edit");
                      }}
                    >
                      <i className="ti ti-edit text-blue"></i> Edit
                    </Link>
                  )}
                  {isDelete && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => setSelected(record)}
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

  const { resume_upload, loading } = useSelector(
    (state) => state.resume_upload
  );

  React.useEffect(() => {
    if (candidateDetail?.id) {
      dispatch(fetchresume_upload({ candidate_id: candidateDetail?.id }));
    }
  }, [candidateDetail?.id]);

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const deleteData = () => {
    if (selected) {
      dispatch(deleteresume_upload(selected.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header p-4 d-flex justify-content-between align-items-center">
          <h4 className="card-title">Resume</h4>
          {isCreate && (
            <AddButton
              label="Add Resume"
              id="add_edit_resume_upload_modal"
              setMode={() => setMode("add")}
            />
          )}
        </div>
        <div className="card-body">
          <div className="table-responsive custom-table">
            <Table
              dataSource={resume_upload?.data || []}
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
        initialData={selected}
        candidate_id={candidateDetail?.id}
      />
      <DeleteAlert
        label="Resume"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onDelete={deleteData}
      />
    </>
  );
};

export default CandidateResume;
