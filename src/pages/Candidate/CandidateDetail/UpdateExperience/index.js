import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateEmployeeExperience } from "../../../../redux/Employee";
import DatePicker from "react-datepicker";
import moment from "moment";

const UpdateExperience = ({ employeeDetail }) => {
  const { loading } = useSelector((state) => state.employee);
  const [experiences, setExperiences] = React.useState([
    {
      company_name: "",
      position: "",
      start_from: "",
      end_to: "",
      is_current: false,
    },
  ]);
  const [errors, setErrors] = React.useState({});
  const dispatch = useDispatch();

  const handleChangeExperience = (index, field, value) => {
    const newExperiences = experiences.map((exp, i) => {
      if (i === index) {
        if (field === "is_current") {
          return {
            ...exp,
            [field]: value,
            end_to: value ? "" : exp.end_to,
          };
        }
        return {
          ...exp,
          [field]: value,
        };
      }
      if (field === "is_current" && value === true) {
        return {
          ...exp,
          is_current: false,
        };
      }
      return exp;
    });
    setExperiences(newExperiences);

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${index}-${field}`];
      return newErrors;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    experiences.forEach((exp, index) => {
      if (!exp.company_name) {
        newErrors[`${index}-company_name`] = "Company name is required";
      }
      if (!exp.position) {
        newErrors[`${index}-position`] = "Position is required";
      }
      if (!exp.start_from) {
        newErrors[`${index}-start_from`] = "Start date is required";
      }
      if (!exp.is_current && !exp.end_to) {
        newErrors[`${index}-end_to`] = "End date is required";
      }

      // Add date validation
      if (exp.start_from && exp.end_to) {
        const startDate = new Date(exp.start_from);
        const endDate = new Date(exp.end_to);

        if (startDate > endDate) {
          newErrors[`${index}-end_to`] = "End date must be after start date";
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(
      updateEmployeeExperience({
        id: employeeDetail?.id,
        experiences: experiences,
      })
    );
    const closeButton = document.getElementById(
      "close_btn_update_experience_modal"
    );
    closeButton.click();
  };

  React.useEffect(() => {
    if (
      employeeDetail?.experiance_of_employee &&
      employeeDetail?.experiance_of_employee?.length > 0
    ) {
      setExperiences(
        employeeDetail.experiance_of_employee.map((exp) => ({
          ...exp,
          is_current: exp?.end_to ? false : true,
        }))
      );
    } else {
      setExperiences([
        {
          company_name: "",
          position: "",
          start_from: "",
          end_to: "",
          is_current: false,
        },
      ]);
    }
  }, [employeeDetail]);

  console.log(errors?.["0-end_to"]);

  return (
    <div className="modal fade" id="update_experience_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Experience</h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_update_experience_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div
              style={{ height: "calc(100vh - 210px)" }}
              className="overflow-y-auto modal-body"
            >
              {experiences?.map((experience, index) => (
                <div key={index}>
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-2">Experience {index + 1}</h5>
                    {index !== 0 && (
                      <Button
                        type="button"
                        size="small"
                        variant="filled"
                        shape="circle"
                        color="danger"
                        onClick={() =>
                          setExperiences(
                            experiences.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <CloseOutlined />
                      </Button>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-2">
                        <label className="col-form-label">
                          Company <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors[`${index}-company_name`] ? "is-invalid" : ""}`}
                          placeholder="Enter Company"
                          value={experience?.company_name}
                          onChange={(e) =>
                            handleChangeExperience(
                              index,
                              "company_name",
                              e.target.value
                            )
                          }
                        />
                        {errors[`${index}-company_name`] && (
                          <small className="text-danger">
                            {errors[`${index}-company_name`]}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-2">
                        <label className="col-form-label">
                          Position <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors[`${index}-position`] ? "is-invalid" : ""}`}
                          placeholder="Enter Position"
                          value={experience?.position}
                          onChange={(e) =>
                            handleChangeExperience(
                              index,
                              "position",
                              e.target.value
                            )
                          }
                        />
                        {errors[`${index}-position`] && (
                          <small className="text-danger">
                            {errors[`${index}-position`]}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-2">
                        <label className="col-form-label">
                          From <span className="text-danger"> *</span>
                        </label>
                        <DatePicker
                          selected={
                            experience?.start_from
                              ? new Date(experience.start_from)
                              : null
                          }
                          onChange={(date) =>
                            handleChangeExperience(
                              index,
                              "start_from",
                              date?.toISOString()
                            )
                          }
                          value={
                            experience?.start_from
                              ? moment(experience.start_from).format(
                                  "DD-MM-YYYY"
                                )
                              : null
                          }
                          className={`form-control ${errors[`${index}-start_from`] ? "is-invalid" : ""}`}
                          placeholderText="Select Start Date"
                          dateFormat="DD-MM-YYYY"
                          maxDate={new Date()}
                        />

                        {errors[`${index}-start_from`] && (
                          <small className="text-danger">
                            {errors[`${index}-start_from`]}
                          </small>
                        )}
                      </div>
                    </div>
                    {!experience.is_current && (
                      <div className="col-md-6">
                        <div className="mb-2">
                          <label className="col-form-label">
                            To{" "}
                            {!experience.is_current && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                          <DatePicker
                            selected={
                              experience?.end_to
                                ? new Date(experience.end_to)
                                : null
                            }
                            value={
                              experience?.end_to
                                ? moment(experience.end_to).format("DD-MM-YYYY")
                                : null
                            }
                            onChange={(date) =>
                              handleChangeExperience(
                                index,
                                "end_to",
                                date?.toISOString()
                              )
                            }
                            className={`form-control ${errors[`${index}-end_to`] ? "is-invalid" : ""}`}
                            placeholderText="Select End Date"
                            dateFormat="DD-MM-YYYY"
                            disabled={experience.is_current}
                            minDate={
                              experience?.start_from
                                ? new Date(experience.start_from)
                                : null
                            }
                            maxDate={new Date()}
                          />
                          {errors[`${index}-end_to`] && (
                            <small className="text-danger">
                              {errors[`${index}-end_to`]}
                            </small>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-2 mt-2">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`currently_working_${index}`}
                            checked={experience.is_current}
                            onChange={(e) =>
                              handleChangeExperience(
                                index,
                                "is_current",
                                e.target.checked
                              )
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`currently_working_${index}`}
                          >
                            Currently Working Here
                          </label>
                        </div>
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
                      setExperiences([
                        ...experiences,
                        {
                          company_name: "",
                          position: "",
                          start_from: "",
                          end_to: "",
                          is_current: false,
                        },
                      ])
                    }
                  >
                    Add Experience
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

export default UpdateExperience;
