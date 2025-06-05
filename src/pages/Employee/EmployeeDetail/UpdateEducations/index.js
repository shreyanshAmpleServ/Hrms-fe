import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UpdateEducations = ({ employeeDetail }) => {
  const { loading } = useSelector((state) => state.employee);
  const [educations, setEducations] = React.useState([
    {
      institute: "",
      specialization: "",
      degree: "",
      from: "",
      to: "",
    },
  ]);
  const dispatch = useDispatch();

  const handleChangeQualification = (index, field, value) => {
    const newQualifications = [...educations];
    newQualifications[index][field] = value;
    setEducations(newQualifications);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const closeButton = document.getElementById(
      "close_btn_update_education_modal",
    );
    console.log(educations);
    closeButton.click();
  };

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
                    <Button
                      type="button"
                      size="small"
                      variant="filled"
                      shape="circle"
                      color="danger"
                      onClick={() =>
                        index === 0
                          ? toast.error(
                              "You cannot remove the first qualification",
                            )
                          : setEducations(
                              educations.filter((_, i) => i !== index),
                            )
                      }
                    >
                      <CloseOutlined />
                    </Button>
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
                          className="form-control"
                          placeholder="Enter Institute"
                          value={education.institute}
                          onChange={(e) =>
                            handleChangeQualification(
                              index,
                              "institute",
                              e.target.value,
                            )
                          }
                        />
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
                          className="form-control"
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
                          className="form-control"
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
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter From"
                          value={education.from}
                          onChange={(e) =>
                            handleChangeQualification(
                              index,
                              "from",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      {/* To */}
                      <div className="mb-2">
                        <label className="col-form-label">
                          To <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter To"
                          value={education.to}
                          onChange={(e) =>
                            handleChangeQualification(
                              index,
                              "to",
                              e.target.value,
                            )
                          }
                        />
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
                        { institute: "", degree: "", from: "", to: "" },
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
