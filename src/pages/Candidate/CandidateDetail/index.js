import { CameraFilled } from "@ant-design/icons";
import { Avatar, Skeleton, Upload } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CollapseHeader from "../../../components/common/collapse-header";
import { fetchCandidateById, updateCandidate } from "../../../redux/Candidate";
import { all_routes } from "../../../routes/all_routes";
import InterviewStages from "./InterviewStages";
import UpdateBasicInfo from "./UpdateBasicInfo";
import UpdateProfilePicture from "./UploadProfile";
import CandidateOfferLetters from "./OfferLetters";
import CandidateContracts from "./CandidateContracts";
import CandidateResume from "./CandidateResume";
import CandidateAppointment from "./CandidateAppointment";

const CandidateDetail = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCandidateById(id));
  }, [id, dispatch]);

  const { candidateDetail, loading: candidateLoading } = useSelector(
    (state) => state.candidate
  );

  const route = all_routes;

  const handleImageUploadOpen = async (file) => {
    const createElement = document.createElement("button");
    createElement.id = "update_profile_picture_modal";
    createElement.type = "button";
    createElement.style.display = "none";
    createElement.setAttribute("data-bs-toggle", "modal");
    createElement.setAttribute(
      "data-bs-target",
      "#update_profile_picture_modal"
    );
    document.body.appendChild(createElement);
    setImage(file);
    createElement.click();
  };

  const handleProfilePictureUpload = async () => {
    const formData = new FormData();
    formData.append("profile_pic", image);
    Object.keys(candidateDetail).forEach((key) => {
      if (key !== "profile_pic" && candidateDetail[key]) {
        formData.append(key, candidateDetail[key]);
      }
    });

    dispatch(updateCandidate({ id, candidateData: formData }));
    const closeModal = document.getElementById(
      "close_btn_update_profile_picture_modal"
    );
    closeModal.click();
    setImage(null);
  };

  const uploadButton = (
    <div className="avatar-uploader-trigger">
      <Avatar
        src={candidateDetail?.profile_pic}
        alt={candidateDetail?.full_name}
        size={120}
        className="fs-1"
      >
        {candidateDetail?.full_name?.charAt(0)}
      </Avatar>
      <div className="avatar-uploader-overlay">
        <CameraFilled style={{ fontSize: "24px", color: "#fff" }} />
      </div>
    </div>
  );

  if (candidateLoading) {
    return (
      <div className="page-wrapper position-relative">
        <div className="content">
          <div className="row mb-3">
            <div className="col-md-12">
              <Skeleton active paragraph={{ rows: 1 }} />
            </div>
          </div>

          <div className="card">
            <div className="card-body pb-2">
              <Skeleton.Avatar active size={120} shape="circle" />
              <div className="mt-4">
                <Skeleton active paragraph={{ rows: 4 }} />
              </div>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <Skeleton active paragraph={{ rows: 4 }} />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <Skeleton active paragraph={{ rows: 4 }} />
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <Skeleton active paragraph={{ rows: 3 }} />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <Skeleton active paragraph={{ rows: 3 }} />
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
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-sm-4">
                    <h4 className="page-title">Candidate Details</h4>
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
                        <Link to={route.candidates}>
                          <i className="ti ti-arrow-narrow-left" />
                          Candidates
                        </Link>
                      </li>
                      <li>{`${candidateDetail?.full_name}`}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body pb-2">
                  <div className="d-flex pb-3 align-items-center justify-content-between flex-wrap">
                    <h4>Personal Information</h4>
                    {/* <Tooltip title="Update Basic Info">
                      <Button
                        variant="filled"
                        shape="circle"
                        data-bs-toggle="modal"
                        data-bs-target={`#update_basic_info_modal`}
                        icon={<EditFilled />}
                      />
                    </Tooltip> */}
                  </div>
                  <div className="d-flex justify-content-between px-3 flex-wrap">
                    <div className="d-flex w-50 gap-5">
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        customRequest={(info) =>
                          handleImageUploadOpen(info.file)
                        }
                        accept="image/*"
                      >
                        {uploadButton}
                      </Upload>
                      <div className="d-flex flex-column gap-2">
                        <h3>{candidateDetail?.full_name}</h3>
                        <p className="m-0">
                          {
                            candidateDetail?.hrms_candidate_designation
                              ?.designation_name
                          }
                        </p>
                        <p className="m-0">
                          Candidate ID :{" "}
                          <span className="text-black fw-semibold">
                            {candidateDetail?.candidate_code}
                          </span>
                        </p>
                        <p className="m-0">
                          Date of Application :{" "}
                          <span className="text-black fw-semibold">
                            {candidateDetail?.date_of_application
                              ? moment(
                                  candidateDetail?.date_of_application
                                ).format("DD-MM-YYYY")
                              : "N/A"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div
                      style={{ width: "40%" }}
                      className="d-flex flex-column gap-2"
                    >
                      <div className="d-flex flex-column gap-1">
                        <p className="m-0">
                          <strong>Phone:</strong>
                        </p>
                        <p className="m-0">{candidateDetail?.phone || "N/A"}</p>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <p className="m-0">
                          <strong>Email:</strong>
                        </p>
                        <p className="m-0">{candidateDetail?.email || "N/A"}</p>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <p className="m-0">
                          <strong>Birthday:</strong>
                        </p>
                        <p className="m-0">
                          {candidateDetail?.date_of_birth
                            ? moment(candidateDetail?.date_of_birth).format(
                                "DD-MM-YYYY"
                              )
                            : "N/A"}
                        </p>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <p className="m-0">
                          <strong>Nationality:</strong>
                        </p>
                        <p className="m-0">
                          {candidateDetail?.nationality || "N/A"}
                        </p>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <p className="m-0">
                          <strong>Gender:</strong>
                        </p>
                        <p className="m-0">
                          {candidateDetail?.gender === "M"
                            ? "Male"
                            : candidateDetail?.gender === "F"
                              ? "Female"
                              : candidateDetail?.gender === "O"
                                ? "Other"
                                : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <InterviewStages candidateDetail={candidateDetail} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <CandidateOfferLetters candidateDetail={candidateDetail} />
            </div>
            <div className="col-md-12">
              <CandidateContracts candidateDetail={candidateDetail} />
            </div>
            <div className="col-md-12">
              <CandidateResume candidateDetail={candidateDetail} />
            </div>
            <div className="col-md-12">
              <CandidateAppointment candidateDetail={candidateDetail} />
            </div>
          </div>
        </div>
        <UpdateBasicInfo candidateDetail={candidateDetail} />
        <UpdateProfilePicture
          candidateDetail={candidateDetail}
          onSubmit={handleProfilePictureUpload}
          handleImageUploadOpen={handleImageUploadOpen}
          image={image}
          setImage={setImage}
        />
      </div>
    </>
  );
};

export default CandidateDetail;
