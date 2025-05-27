import { EditFilled } from "@ant-design/icons";
import { Avatar, Button, Skeleton, Tooltip } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CollapseHeader from "../../../components/common/collapse-header";
import { fetchEmployeeById } from "../../../redux/Employee";
import { all_routes } from "../../../routes/all_routes";
import UpdateBankInfo from "./UpdateBankInfo";
import UpdateBasicInfo from "./UpdateBasicInfo";
import UpdateContactInfo from "./UpdateContactInfo";
import UpdateEducations from "./UpdateEducations";
import UpdateExperience from "./UpdateExperience";
import UpdatePassportInfo from "./UpdatePassportInfo";
import UpdateSocialInfo from "./UpdateSocialInfo";

const EmployeeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEmployeeById(id));
  }, [id, dispatch]);

  const { employeeDetail, loading } = useSelector((state) => state.employee);

  const route = all_routes;

  if (loading) {
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
                    <h4 className="page-title">Employee Details</h4>
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
                        <Link to={route.employee}>
                          <i className="ti ti-arrow-narrow-left" />
                          Employees
                        </Link>
                      </li>
                      <li>{`${employeeDetail?.full_name}`}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body pb-2">
                  <div className="d-flex pb-3 align-items-center justify-content-between flex-wrap">
                    <h4>Personal Information</h4>
                    <Tooltip title="Update Basic Info">
                      <Button
                        variant="filled"
                        shape="circle"
                        data-bs-toggle="modal"
                        data-bs-target={`#update_basic_info_modal`}
                        icon={<EditFilled />}
                      />
                    </Tooltip>
                  </div>
                  <div className="d-flex justify-content-between px-3 flex-wrap">
                    <div className="d-flex w-50 gap-5">
                      <Avatar
                        src={employeeDetail?.profile_pic}
                        alt={employeeDetail?.full_name}
                        size={120}
                        className="fs-1"
                      >
                        {employeeDetail?.full_name?.charAt(0)}
                      </Avatar>
                      <div className="d-flex flex-column gap-2">
                        <h3>{employeeDetail?.full_name}</h3>
                        <h5>
                          {
                            employeeDetail?.hrms_employee_department
                              ?.department_name
                          }
                        </h5>
                        <p className="m-0">
                          {
                            employeeDetail?.hrms_employee_designation
                              ?.designation_name
                          }
                        </p>
                        <p className="m-0">
                          Employee ID :{" "}
                          <span className="text-black fw-semibold">
                            {employeeDetail?.employee_code}
                          </span>
                        </p>
                        <p className="m-0">
                          Date of Join :{" "}
                          <span className="text-black fw-semibold">
                            {employeeDetail?.join_date
                              ? moment(employeeDetail?.join_date).format(
                                  "DD-MM-YYYY"
                                )
                              : " - - "}
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
                        <p className="m-0">{employeeDetail?.phone_number}</p>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <p className="m-0">
                          <strong>Email:</strong>
                        </p>
                        <p className="m-0">{employeeDetail?.email}</p>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <p className="m-0">
                          <strong>Birthday:</strong>
                        </p>
                        <p className="m-0">
                          {employeeDetail?.date_of_birth
                            ? moment(employeeDetail?.date_of_birth).format(
                                "DD-MM-YYYY"
                              )
                            : " - - "}
                        </p>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <p className="m-0">
                          <strong> Address:</strong>
                        </p>
                        <p className="m-0">
                          {employeeDetail?.address || " - - "}
                        </p>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <p className="m-0">
                          <strong>Gender:</strong>
                        </p>
                        <p className="m-0">
                          {employeeDetail?.gender || " - - "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-body pb-2">
                  <div className="d-flex pb-3 align-items-center justify-content-between flex-wrap">
                    <h4>Contact Information</h4>
                    <Tooltip title="Update Contact Info">
                      <Button
                        variant="filled"
                        shape="circle"
                        data-bs-toggle="modal"
                        data-bs-target={`#update_contact_info_modal`}
                        icon={<EditFilled />}
                      />
                    </Tooltip>
                  </div>
                  <div className="d-flex justify-content-between px-3 flex-wrap">
                    <div className="d-flex flex-column w-50 gap-2">
                      <h5>Primary Contact</h5>
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">
                            <strong>Name:</strong>
                          </p>
                          <p className="m-0">
                            {employeeDetail?.primary_contact_name || " - - "}
                          </p>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">
                            <strong>Relationship:</strong>
                          </p>
                          <p className="m-0">
                            {employeeDetail?.primary_contact_relation ||
                              " - - "}
                          </p>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">
                            <strong>Phone:</strong>
                          </p>
                          <p className="m-0">
                            {employeeDetail?.primary_contact_number || " - - "}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-column w-50 gap-2">
                      <h5>Secondary Contact</h5>
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">
                            <strong>Name:</strong>
                          </p>
                          <p className="m-0">
                            {employeeDetail?.secondary_contact_name || " - - "}
                          </p>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">
                            <strong>Relationship:</strong>
                          </p>
                          <p className="m-0">
                            {employeeDetail?.secondary_contact_relation ||
                              " - - "}
                          </p>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">
                            <strong>Phone:</strong>
                          </p>
                          <p className="m-0">
                            {employeeDetail?.secondary_contact_mumber ||
                              " - - "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body pb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h4>Education Qualification</h4>
                        <Tooltip title="Update Qualifications">
                          <Button
                            variant="filled"
                            shape="circle"
                            data-bs-toggle="modal"
                            data-bs-target={`#update_education_modal`}
                            icon={<EditFilled />}
                          />
                        </Tooltip>
                      </div>
                      <div className="d-flex align-items-start mt-3 gap-2">
                        <i className="ti ti-point-filled text-primary fs-4"></i>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0 fw-bold text-black">
                            International College of Arts and Science (UG)
                          </p>
                          <p className="m-0">MSc In Computer Science</p>
                          <p className="m-0">2020 - 2022</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-start mt-3 gap-2">
                        <i className="ti ti-point-filled text-primary fs-4"></i>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0 fw-bold text-black">
                            International College of Arts and Science (UG)
                          </p>
                          <p className="m-0">BSc In Computer Science</p>
                          <p className="m-0">2020 - 2022</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-start mt-3 gap-2">
                        <i className="ti ti-point-filled text-primary fs-4"></i>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0 fw-bold text-black">
                            International College of Arts and Science (UG)
                          </p>
                          <p className="m-0">MSc In Computer Science</p>
                          <p className="m-0">2020 - 2022</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body pb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h4>Experience Details</h4>
                        <Tooltip title="Update Experience">
                          <Button
                            variant="filled"
                            shape="circle"
                            data-bs-toggle="modal"
                            data-bs-target={`#update_experience_modal`}
                            icon={<EditFilled />}
                          />
                        </Tooltip>
                      </div>
                      <div className="d-flex align-items-start mt-3 gap-2">
                        <i className="ti ti-point-filled text-primary fs-4"></i>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0 fw-bold text-black">
                            Envato Inc, Melbourne
                          </p>
                          <p className="m-0">Head Of Review Team</p>
                          <p className="m-0">2020 - Present</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-start mt-3 gap-2">
                        <i className="ti ti-point-filled text-primary fs-4"></i>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0 fw-bold text-black">
                            CodeCanyon Sydney
                          </p>
                          <p className="m-0">Software Developer</p>
                          <p className="m-0">2020 - 2022</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-start mt-3 gap-2">
                        <i className="ti ti-point-filled text-primary fs-4"></i>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0 fw-bold text-black">
                            Facebook Inc, California
                          </p>
                          <p className="m-0">Junior Software Developer</p>
                          <p className="m-0">2020 - 2022</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body pb-2 flex-column gap-3 d-flex">
                      <div className="d-flex justify-content-between align-items-center">
                        <h4>Bank Account</h4>
                        <Tooltip title="Update Bank Info">
                          <Button
                            variant="filled"
                            shape="circle"
                            data-bs-toggle="modal"
                            data-bs-target={`#update_bank_info_modal`}
                            icon={<EditFilled />}
                          />
                        </Tooltip>
                      </div>
                      <div className="d-flex mt-2 justify-content-between">
                        <p className="m-0">
                          <strong>Account Holder Name:</strong>
                        </p>
                        <p className="m-0">
                          {employeeDetail?.account_holder_name || " - - "}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="m-0">
                          <strong>Account Number:</strong>
                        </p>
                        <p className="m-0">
                          {employeeDetail?.account_number || " - - "}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="m-0">
                          <strong>Bank Name:</strong>
                        </p>
                        <p className="m-0">
                          {employeeDetail?.hrms_employee_bank?.bank_name ||
                            " - - "}
                        </p>
                      </div>
                      <div className="d-flex mb-2 justify-content-between">
                        <p className="m-0">
                          <strong>IFSC Code:</strong>
                        </p>
                        <p className="m-0">{employeeDetail?.ifsc || " - - "}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body pb-2 flex-column gap-3 d-flex">
                      <div className="d-flex justify-content-between align-items-center">
                        <h4>Passport Information</h4>
                        <Tooltip title="Update Passport Info">
                          <Button
                            variant="filled"
                            shape="circle"
                            data-bs-toggle="modal"
                            data-bs-target={`#update_passport_info_modal`}
                            icon={<EditFilled />}
                          />
                        </Tooltip>
                      </div>
                      <div className="d-flex mt-2 justify-content-between">
                        <p className="m-0">
                          <strong>Passport Number:</strong>
                        </p>
                        <p className="m-0">
                          {employeeDetail?.passport_number || " - - "}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="m-0">
                          <strong>Nationality:</strong>
                        </p>
                        <p className="m-0">
                          {employeeDetail?.nationality || " - - "}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="m-0">
                          <strong>Issue Date:</strong>
                        </p>
                        <p className="m-0">
                          {employeeDetail?.passport_issue_date
                            ? moment(
                                employeeDetail?.passport_issue_date
                              ).format("DD-MM-YYYY")
                            : " - - "}
                        </p>
                      </div>
                      <div className="d-flex mb-2 justify-content-between">
                        <p className="m-0">
                          <strong>Expiry Date:</strong>
                        </p>
                        <p className="m-0">
                          {employeeDetail?.passport_expiry_date
                            ? moment(
                                employeeDetail?.passport_expiry_date
                              ).format("DD-MM-YYYY")
                            : " - - "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body pb-2 flex-column gap-3 d-flex">
                      <div className="d-flex justify-content-between align-items-center">
                        <h4>Social Profile</h4>
                        <Tooltip title="Update Social Info">
                          <Button
                            variant="filled"
                            shape="circle"
                            data-bs-toggle="modal"
                            data-bs-target={`#update_social_info_modal`}
                            icon={<EditFilled />}
                          />
                        </Tooltip>
                      </div>
                      <div className="d-flex mt-2 justify-content-between">
                        <p className="m-0">
                          <strong>LinkedIn:</strong>{" "}
                        </p>
                        <a
                          href={employeeDetail?.social_medias?.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <small className="m-0">
                            {employeeDetail?.social_medias?.linkedin || " - - "}
                          </small>
                        </a>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="m-0">
                          <strong>Twitter:</strong>
                        </p>
                        <a
                          href={employeeDetail?.social_medias?.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <small className="m-0">
                            {employeeDetail?.social_medias?.twitter || " - - "}
                          </small>
                        </a>
                      </div>
                      <div className="d-flex justify-content-between">
                        <p className="m-0">
                          <strong>Facebook:</strong>
                        </p>
                        <a
                          href={employeeDetail?.social_medias?.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <small className="m-0">
                            {employeeDetail?.social_medias?.facebook || " - - "}
                          </small>
                        </a>
                      </div>
                      <div className="d-flex mb-2 justify-content-between">
                        <p className="m-0">
                          <strong>Instagram:</strong>
                        </p>
                        <a
                          href={employeeDetail?.social_medias?.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <small className="m-0">
                            {employeeDetail?.social_medias?.instagram ||
                              " - - "}
                          </small>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <UpdateBasicInfo employeeDetail={employeeDetail} />
        <UpdateContactInfo employeeDetail={employeeDetail} />
        <UpdateBankInfo employeeDetail={employeeDetail} />
        <UpdatePassportInfo employeeDetail={employeeDetail} />
        <UpdateSocialInfo employeeDetail={employeeDetail} />
        <UpdateEducations employeeDetail={employeeDetail} />
        <UpdateExperience employeeDetail={employeeDetail} />
      </div>
    </>
  );
};

export default EmployeeDetail;
