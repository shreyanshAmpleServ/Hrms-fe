import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CollapseHeader from "../../components/common/collapse-header";
import { deleteProject, fetchProjectById } from "../../redux/projects";
import { all_routes } from "../../routes/all_routes";
import DeleteAlert from "./alert/DeleteAlert";
import EditProjectModal from "./modal/EditProjectModal";
import ProjectActvities from "./modal/ProjectActvities";
const ProjectDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProjectById(id));
  }, [id, dispatch]);
  const { projectDetail, loading } = useSelector((state) => state.projects);

  const route = all_routes;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDeleteProject = () => {
    setShowDeleteModal(true);
  };
  const deleteData = () => {
    if (projectDetail) {
      dispatch(deleteProject(projectDetail.id));
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="page-wrapper position-relative">
        {loading ? (
          <div
            style={{
              zIndex: 9999,
              paddingTop: "20%",
              paddingLeft: "35%",
              width: "100%",
              marginLeft: "0%",
              minHeight: "100vh",
              marginTop: "59px",
              backgroundColor: "rgba(255, 255, 255,.5)",
            }}
            className=" position-fixed  w-screen  top-0   bg-gray  "
          >
            <div
              className="spinner-border position-absolute d-flex justify-content-center  text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="page-header">
                  <div className="row align-items-center">
                    <div className="col-sm-4">
                      <h4 className="page-title">Project</h4>
                    </div>
                    <div className="col-sm-8 text-sm-end">
                      <div className="head-icons">
                        <CollapseHeader />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="contact-head">
                  <div className="row align-items-center">
                    <div className="col-sm-6">
                      <ul className="contact-breadcrumb">
                        <li>
                          <Link to={route.contactGrid}>
                            <i className="ti ti-arrow-narrow-left" />
                            Project
                          </Link>
                        </li>
                        <li>{projectDetail?.name}</li>
                      </ul>
                    </div>
                    <div className="col-sm-6 text-sm-end">
                      <div className="contact-pagination">
                        <ul>
                          <li>
                            <Link to={route.projectDetails}>
                              <i className="ti ti-chevron-left" />
                            </Link>
                          </li>
                          <li>
                            <Link to={route.projectDetails}>
                              <i className="ti ti-chevron-right" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body pb-2">
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div className="d-flex align-items-center mb-2">
                        <div>
                          <h5 className="mb-1">{projectDetail?.name}</h5>
                          <p className="mb-2">{projectDetail?.projectTiming}</p>
                        </div>
                      </div>
                      <div className="contacts-action">
                        <Link
                          to="#"
                          className="btn-icon"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_edit_project"
                        >
                          <i className="ti ti-edit-circle" />
                        </Link>
                        <div className="act-dropdown">
                          <Link
                            to="#"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="ti ti-dots-vertical" />
                          </Link>
                          <div className="dropdown-menu dropdown-menu-right">
                            <Link
                              className="dropdown-item"
                              to="#"
                              onClick={() => handleDeleteProject()}
                            >
                              <i className="ti ti-trash text-danger" />
                              Delete
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 theiaStickySidebar">
                <div className="card">
                  <div className="card-body p-3">
                    <h6 className="mb-3 fw-semibold">Basic Information</h6>
                    <div className="mb-3">
                      <div className="row mb-3">
                        <span className="col-6">Timing</span>
                        <span className="col-6" style={{ fontSize: "13px" }}>
                          {projectDetail?.projectTiming}
                        </span>
                      </div>
                      <div className="row mb-3">
                        <span className="col-6">Budget</span>
                        <span className="col-6" style={{ fontSize: "13px" }}>
                          {projectDetail?.amount}
                        </span>
                      </div>

                      <div className="row mb-3">
                        <span className="col-6">Start Date</span>
                        <span className="col-6 " style={{ fontSize: "13px" }}>
                          {moment(projectDetail?.startDate).format("ll")}
                        </span>
                      </div>
                      <div className="row mb-3">
                        <span className="col-6">Due Date</span>
                        <span className="col-6" style={{ fontSize: "13px" }}>
                          {moment(projectDetail?.dueDate).format("ll")}
                        </span>
                      </div>
                      <div className="row mb-3">
                        <span className="col-6">Created at</span>
                        <span className="col-6" style={{ fontSize: "13px" }}>
                          {moment(projectDetail?.createdDate).format("ll")}
                        </span>
                      </div>
                    </div>
                    <hr />
                  </div>
                </div>
              </div>
              <ProjectActvities project={projectDetail?.name} />
            </div>
          </div>
        )}
      </div>
      <DeleteAlert
        label="Project"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedCompany={projectDetail}
        onDelete={deleteData}
      />
      <EditProjectModal project={projectDetail} />
    </>
  );
};

export default ProjectDetail;
