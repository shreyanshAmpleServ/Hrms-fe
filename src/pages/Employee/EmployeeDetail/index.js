import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CollapseHeader from "../../../components/common/collapse-header";
import { ActivityDetailOfUser } from "../../../components/common/detailPages/UserDetails/activityDetails";
import { CallsDetailsOfUser } from "../../../components/common/detailPages/UserDetails/callsDetails";
import FilesDetails from "../../../components/common/detailPages/UserDetails/FilesDetails";
import ImageWithDatabase from "../../../components/common/ImageFromDatabase";
import ImageWithBasePath from "../../../components/common/imageWithBasePath";
import { fetchEmployeeById } from "../../../redux/Employee";
import { fetchLostReasons } from "../../../redux/lostReasons";
import { all_routes } from "../../../routes/all_routes";
import { Avatar } from "antd";

const EmployeeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEmployeeById(id));
    dispatch(fetchLostReasons());
  }, [id, dispatch]);

  const { employeeDetail, loading } = useSelector((state) => state.employee);
  const { lostReasons: contactStatus } = useSelector(
    (state) => state.lostReasons
  );

  const route = all_routes;

  const badgeClasses = [
    "badge-soft-success",
    "badge-soft-warning",
    "badge-soft-info",
    "badge-soft-danger",
    "badge-soft-primary",
    "badge-soft-secondary",
  ];
  const getRandomClass = () => {
    return badgeClasses[Math.floor(Math.random() * badgeClasses.length)];
  };
  const tagsArray = employeeDetail?.tags
    ? employeeDetail.tags.split(",").map((tag) => tag.trim())
    : [];

  const socialIcons = {
    facebook: "fa-brands fa-facebook-f",
    instagram: "fa-brands fa-instagram",
    linkedin: "fa-brands fa-linkedin",
    skype: "fa-brands fa-skype",
    twitter: "fa-brands fa-twitter",
    whatsapp: "fa-brands fa-whatsapp",
  };

  const address = employeeDetail?.hrms_employee_address?.[1];

  return (
    <>
      <div className="page-wrapper position-relative">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="page-header">
                <div className="row align-items-center">
                  <div className="col-sm-4">
                    <h4 className="page-title">Employees</h4>
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
                  <div className="col-sm-6 text-sm-end">
                    <div className="contact-pagination">
                      <p>1 of 40</p>
                      <ul>
                        <li>
                          <Link to={route.employeeDetails}>
                            <i className="ti ti-chevron-left" />
                          </Link>
                        </li>
                        <li>
                          <Link to={route.employeeDetails}>
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
                  <div className="d-flex pb-3 align-items-center justify-content-between flex-wrap">
                    <h4>Personal Information</h4>
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
                            {employeeDetail?.join_date || " - - "}
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
                          {employeeDetail?.date_of_birth || " - - "}
                        </p>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <p className="m-0">
                          <strong> Address:</strong>
                        </p>
                        <p className="m-0">
                          {[
                            address?.street_no,
                            address?.street,
                            address?.city,
                            address?.employee_state?.name,
                            address?.employee_country?.name,
                            address?.zip_code,
                          ]
                            .filter(Boolean)
                            .join(", ") || " - - "}
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
                  </div>
                  <div className="d-flex justify-content-between px-3 flex-wrap">
                    <div className="d-flex flex-column w-50 gap-2">
                      <h5 className="text-muted">Primary Contact</h5>
                      <div className="d-flex text-muted flex-column gap-3">
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">
                            <strong>Name:</strong>
                          </p>
                          <p className="m-0">
                            {employeeDetail?.emergency_contact_person ||
                              " - - "}
                          </p>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">
                            <strong>Relationship:</strong>
                          </p>
                          <p className="m-0">
                            {employeeDetail?.contact_relation || " - - "}
                          </p>
                        </div>
                        <div className="d-flex flex-column gap-1">
                          <p className="m-0">
                            <strong>Phone:</strong>
                          </p>
                          <p className="m-0">
                            {employeeDetail?.emergency_contact || " - - "}
                          </p>
                        </div>
                        {/* <div className="d-flex flex-column gap-1">
                        <p className="m-0">
                          <strong>Email:</strong>
                        </p>
                        <p className="m-0">
                          {employeeDetail?.email || " - - "}
                        </p>
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <p className="m-0">
                          <strong>Address:</strong>
                        </p>
                        <p className="m-0">
                          {employeeDetail?.streetAddress || " - - "}
                        </p>
                      </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body pb-2">
                      <h4>Education Qualification</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body pb-2">
                      <h4>Experience Details</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDetail;
