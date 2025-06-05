import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UpdateExperience = ({ employeeDetail }) => {
  const { loading } = useSelector((state) => state.employee);
  const [experiences, setExperiences] = React.useState([
    {
      company: "",
      position: "",
      from: "",
      to: "",
    },
  ]);
  const dispatch = useDispatch();

  const handleChangeExperience = (index, field, value) => {
    const newExperiences = [...experiences];
    newExperiences[index][field] = value;
    setExperiences(newExperiences);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const closeButton = document.getElementById(
      "close_btn_update_experience_modal",
    );
    console.log(experiences);
    closeButton.click();
  };

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
                    <Button
                      type="button"
                      size="small"
                      variant="filled"
                      shape="circle"
                      color="danger"
                      onClick={() =>
                        index === 0
                          ? toast.error(
                              "You cannot remove the first experience",
                            )
                          : setExperiences(
                              experiences.filter((_, i) => i !== index),
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
                          Company <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Company"
                          value={experience.company}
                          onChange={(e) =>
                            handleChangeExperience(
                              index,
                              "company",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      {/* Position */}
                      <div className="mb-2">
                        <label className="col-form-label">
                          Position <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Position"
                          value={experience.position}
                          onChange={(e) =>
                            handleChangeExperience(
                              index,
                              "position",
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
                          value={experience.from}
                          onChange={(e) =>
                            handleChangeExperience(
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
                          value={experience.to}
                          onChange={(e) =>
                            handleChangeExperience(index, "to", e.target.value)
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
                      setExperiences([
                        ...experiences,
                        { company: "", position: "", from: "", to: "" },
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
