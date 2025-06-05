import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateEmployeeEducation } from "../../../../redux/Employee";
import ReactDatePicker from "react-datepicker";
import moment from "moment";

const UpdateEducations = ({ employeeDetail }) => {
  const { loading } = useSelector((state) => state.employee);
  const [educations, setEducations] = React.useState([
    {
      institute_name: "",
      specialization: "",
      degree: "",
      start_from: "",
      end_to: "",
    },
  ]);
  const [errors, setErrors] = React.useState({});
  const dispatch = useDispatch();

  const handleChangeQualification = (index, field, value) => {
    const newQualifications = educations.map((education, i) => {
      if (i === index) {
        return { ...education, [field]: value };
      }
      return education;
    });
    setEducations(newQualifications);

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${index}-${field}`];
      return newErrors;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    educations.forEach((education, index) => {
      if (!education.institute_name?.trim()) {
        newErrors[`${index}-institute_name`] = "Institute name is required";
      }
      if (!education.degree?.trim()) {
        newErrors[`${index}-degree`] = "Degree is required";
      }
      if (!education.specialization?.trim()) {
        newErrors[`${index}-specialization`] = "Specialization is required";
      }
      if (!education.start_from) {
        newErrors[`${index}-start_from`] = "Start date is required";
      }
      if (!education.end_to) {
        newErrors[`${index}-end_to`] = "End date is required";
      }

      // Validate dates
      if (education.start_from && education.end_to) {
        const startDate = new Date(education.start_from);
        const endDate = new Date(education.end_to);

        if (startDate > endDate) {
          newErrors[`${index}-end_to`] = "End date must be after start date";
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(updateEmployeeEducation({ id: employeeDetail.id, educations }));
    const closeButton = document.getElementById("close_btn_update_edu_modal");
    closeButton.click();
  };

  React.useEffect(() => {
    if (
      employeeDetail?.eduction_of_employee &&
      employeeDetail?.eduction_of_employee?.length > 0
    ) {
      setEducations(
        employeeDetail?.eduction_of_employee.map((edu) => ({ ...edu })),
      );
    } else {
      setEducations([
        {
          institute_name: "",
          degree: "",
          specialization: "",
          start_from: "",
          end_to: "",
        },
      ]);
    }
  }, [employeeDetail]);

  return (
    <div className="modal fade" id="update_education_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Education</h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_update_edu_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div
              style={{ height: "calc(100vh - 210px)" }}
              className="overflow-y-auto modal-body"
            >
              {educations?.map((education, index) => (
                <div key={index}>
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-2">Education {index + 1}</h5>
                    {index !== 0 && (
                      <Button
                        type="button"
                        size="small"
                        variant="filled"
                        shape="circle"
                        color="danger"
                        onClick={() =>
                          setEducations(
                            educations.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <CloseOutlined />
                      </Button>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      {/* Institute */}
                      <div className="mb-2">
                        <label className="col-form-label">
                          Institute <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors[`${index}-institute_name`] ? "is-invalid" : ""}`}
                          placeholder="Enter Institute"
                          value={education.institute_name}
                          onChange={(e) =>
                            handleChangeQualification(
                              index,
                              "institute_name",
                              e.target.value,
                            )
                          }
                        />
                        {errors[`${index}-institute_name`] && (
                          <small className="text-danger">
                            {errors[`${index}-institute_name`]}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      {/* Degree */}
                      <div className="mb-2">
                        <label className="col-form-label">
                          Degree <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors[`${index}-degree`] ? "is-invalid" : ""}`}
                          placeholder="Enter Degree"
                          value={education.degree}
                          onChange={(e) =>
                            handleChangeQualification(
                              index,
                              "degree",
                              e.target.value,
                            )
                          }
                        />
                        {errors[`${index}-degree`] && (
                          <small className="text-danger">
                            {errors[`${index}-degree`]}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      {/* Specialization */}
                      <div className="mb-2">
                        <label className="col-form-label">
                          Specialization <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors[`${index}-specialization`] ? "is-invalid" : ""}`}
                          placeholder="Enter Specialization"
                          value={education.specialization}
                          onChange={(e) =>
                            handleChangeQualification(
                              index,
                              "specialization",
                              e.target.value,
                            )
                          }
                        />
                        {errors[`${index}-specialization`] && (
                          <small className="text-danger">
                            {errors[`${index}-specialization`]}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      {/* From */}
                      <div className="mb-2">
                        <label className="col-form-label">
                          From <span className="text-danger"> *</span>
                        </label>
                        <ReactDatePicker
                          selected={
                            education.start_from
                              ? new Date(education.start_from)
                              : null
                          }
                          value={
                            education.start_from
                              ? moment(education.start_from).format(
                                  "DD/MM/YYYY",
                                )
                              : null
                          }
                          onChange={(date) => {
                            handleChangeQualification(
                              index,
                              "start_from",
                              date,
                            );

                            if (
                              education.end_to &&
                              date > new Date(education.end_to)
                            ) {
                              handleChangeQualification(index, "end_to", null);
                            }
                          }}
                          className={`form-control ${errors[`${index}-start_from`] ? "is-invalid" : ""}`}
                          placeholderText="Select Start Date"
                          dateFormat="DD/MM/YYYY"
                          maxDate={
                            education.end_to ? new Date(education.end_to) : null
                          }
                        />
                        {errors[`${index}-start_from`] && (
                          <small className="text-danger">
                            {errors[`${index}-start_from`]}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      {/* To */}
                      <div className="mb-2">
                        <label className="col-form-label">
                          To <span className="text-danger">*</span>
                        </label>
                        <ReactDatePicker
                          selected={
                            education.end_to ? new Date(education.end_to) : null
                          }
                          value={
                            education.end_to
                              ? moment(education.end_to).format("DD/MM/YYYY")
                              : null
                          }
                          onChange={(date) =>
                            handleChangeQualification(index, "end_to", date)
                          }
                          className={`form-control ${errors[`${index}-end_to`] ? "is-invalid" : ""}`}
                          placeholderText="Select End Date"
                          dateFormat="DD/MM/YYYY"
                          minDate={
                            education.start_from
                              ? new Date(education.start_from)
                              : null
                          }
                        />
                        {errors[`${index}-end_to`] && (
                          <small className="text-danger">
                            {errors[`${index}-end_to`]}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="row mb-3">
                <div className="col-md-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      setEducations([
                        ...educations,
                        {
                          institute_name: "",
                          degree: "",
                          specialization: "",
                          start_from: "",
                          end_to: "",
                        },
                      ])
                    }
                  >
                    Add Education
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <div className="d-flex align-items-center justify-content-end m-0">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary"
                >
                  {loading
                    ? employeeDetail
                      ? "Updating..."
                      : "Creating..."
                    : employeeDetail
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateEducations;
