import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import CollapseHeader from "../../../components/common/collapse-header";
import ImageWithBasePath from "../../../components/common/imageWithBasePath";
import { deleteUser, fetchUserById } from "../../../redux/manage-user";
import DateFormat from "../../../utils/DateFormat";
import DeleteAlert from "./alert/DeleteAlert";
import EditUserModal from "./modal/EditUserModal";

const UserDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserById(id));
  }, [id, dispatch]);

  const { userDetail, loading } = useSelector((state) => state.users);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteUser = () => setShowDeleteModal(true);

  const deleteData = () => {
    if (userDetail) {
      dispatch(deleteUser(userDetail.id));
      navigate(`/users`);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper position-relative">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <Skeleton.Input
                active
                block
                style={{ height: 20, marginBottom: 10, width: "15%" }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <Skeleton.Input
                active
                block
                style={{ height: 20, marginBottom: 10, width: "30%" }}
              />
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <Skeleton.Avatar
                      active
                      size={100}
                      style={{ marginRight: 20 }}
                    />
                    <div style={{ flex: 1 }}>
                      <Skeleton.Input
                        active
                        block
                        style={{
                          width: 200,
                          marginBottom: 10,
                          height: 20,
                        }}
                      />
                      <Skeleton.Input
                        active
                        block
                        style={{ width: 150, height: 20 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body">
                  <Skeleton.Input
                    active
                    block
                    style={{ width: 200, marginBottom: 20, height: 20 }}
                  />
                  <div>
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="d-flex align-items-center mb-3"
                      >
                        <Skeleton.Avatar
                          active
                          size={24}
                          style={{ marginRight: 10 }}
                        />
                        <Skeleton.Input
                          active
                          block
                          style={{ width: "60%", height: 20 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-wrapper position-relative">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="page-header mb-0">
                <div className="row align-items-center">
                  <div className="col-sm-4">
                    <h4 className="page-title">User</h4>
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
                      <li className="m-0">
                        <Link to={-1}>
                          <i className="ti ti-arrow-narrow-left" />
                          User
                        </Link>
                      </li>
                      <li>{userDetail?.full_name}</li>
                    </ul>
                  </div>
                  {/* <div className="col-sm-6 text-sm-end">
                    <div className="contact-pagination">
                      <ul>
                        <li>
                          <Link to={route.userDetails}>
                            <i className="ti ti-chevron-left" />
                          </Link>
                        </li>
                        <li>
                          <Link to={route.userDetails}>
                            <i className="ti ti-chevron-right" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="card">
                <div className="card-body pb-2">
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center mb-2">
                      <div className="avatar avatar-xxl online online-sm me-3 flex-shrink-0">
                        {userDetail?.profile_img ? (
                          <img
                            src={userDetail?.profile_img}
                            alt="User Avatar"
                            className="preview"
                          />
                        ) : (
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-14.jpg"
                            alt="User Avatar"
                          />
                        )}
                        <span className="status online" />
                      </div>
                      <div>
                        <h5 className="mb-1">{userDetail?.full_name}</h5>
                        <p className="mb-2 text-muted text-capitalize">
                          {userDetail?.role}
                        </p>
                      </div>
                    </div>
                    <div className="contacts-action">
                      <Link
                        to="#"
                        className="btn-icon"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvas_edit_user"
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
                            onClick={() => handleDeleteUser(true)}
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
            <div className="col-xl-12">
              <div className="card">
                <div className="card-body p-3">
                  <h6 className="mb-3 fw-semibold">Basic Information</h6>
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-mail" />
                      </span>
                      <p>{userDetail?.email}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-phone" />
                      </span>
                      <p>{userDetail?.phone}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-map-pin" />
                      </span>
                      <p>{userDetail?.address}</p>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <span className="avatar avatar-xs bg-light-300 p-0 flex-shrink-0 rounded-circle text-dark me-2">
                        <i className="ti ti-calendar-exclamation" />
                      </span>
                      <p>Created at {DateFormat(userDetail?.createdate)}</p>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
            {/* <UserActivities user={userDetail?.full_name} /> */}
          </div>
        </div>
      </div>
      <DeleteAlert
        label="User"
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedUser={userDetail}
        onDelete={deleteData}
      />

      <EditUserModal user={userDetail} />
    </>
  );
};

export default UserDetail;
