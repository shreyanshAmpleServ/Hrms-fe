import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import { fetchdepartment } from "../../../../redux/department";
import { fetchdesignation } from "../../../../redux/designation";
import { updateEmployee } from "../../../../redux/Employee";
const UpdateContactInfo = ({ employeeDetail }) => {
  const { loading } = useSelector((state) => state.employee);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm({
    defaultValues: {
      primary_contact_name: employeeDetail?.primary_contact_name || "",
      primary_contact_relation: employeeDetail?.primary_contact_relation || "",
      primary_contact_number: employeeDetail?.primary_contact_number || "",
      secondary_contact_name: employeeDetail?.secondary_contact_name || "",
      secondary_contact_relation:
        employeeDetail?.secondary_contact_relation || "",
      secondary_contact_mumber: employeeDetail?.secondary_contact_mumber || "",
    },
  });

  useEffect(() => {
    if (employeeDetail) {
      reset({
        primary_contact_name: employeeDetail.primary_contact_name || "",
        primary_contact_relation: employeeDetail.primary_contact_relation || "",
        primary_contact_number: employeeDetail.primary_contact_number || "",
        secondary_contact_name: employeeDetail.secondary_contact_name || "",
        secondary_contact_relation:
          employeeDetail.secondary_contact_relation || "",
        secondary_contact_mumber: employeeDetail.secondary_contact_mumber || "",
      });
    } else {
      reset({
        primary_contact_name: "",
        primary_contact_relation: "",
        primary_contact_number: "",
        secondary_contact_name: "",
        secondary_contact_relation: "",
        secondary_contact_mumber: "",
      });
    }
  }, [employeeDetail, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_update_contact_info_modal",
    );
    const formData = new FormData();
    if (employeeDetail) {
      formData.append("id", employeeDetail.id);
      formData.append("primary_contact_name", data.primary_contact_name);
      formData.append(
        "primary_contact_relation",
        data.primary_contact_relation,
      );
      formData.append("primary_contact_number", data.primary_contact_number);
      formData.append("secondary_contact_name", data.secondary_contact_name);
      formData.append(
        "secondary_contact_relation",
        data.secondary_contact_relation,
      );
      formData.append(
        "secondary_contact_mumber",
        data.secondary_contact_mumber,
      );
      dispatch(updateEmployee(formData));
    }
    reset();
    closeButton.click();
  };

  return (
    <div className="modal fade" id="update_contact_info_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Contact Info</h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_update_contact_info_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{ height: "400px", overflowY: "auto" }}
              className="modal-body"
            >
              <h5 className="fw-bold mb-2">Primary Contact</h5>

              <div className="row">
                <div className="col-md-6">
                  {/* Employee Name */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.primary_contact_name ? "is-invalid" : ""}`}
                      placeholder="Enter Primary Contact Name"
                      {...register("primary_contact_name", {
                        required: "Name is required.",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters.",
                        },
                      })}
                    />
                    {errors.primary_contact_name && (
                      <small className="text-danger">
                        {errors.primary_contact_name.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  {/* Email */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      Relationship <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.primary_contact_relation ? "is-invalid" : ""}`}
                      placeholder="Enter Relationship"
                      {...register("primary_contact_relation", {
                        required: "Relationship is required.",
                      })}
                    />
                    {errors.primary_contact_relation && (
                      <small className="text-danger">
                        {errors.primary_contact_relation.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  {/* Phone Number */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.primary_contact_number ? "is-invalid" : ""}`}
                      placeholder="Enter Phone Number"
                      {...register("primary_contact_number", {
                        required: "Phone number is required.",
                        minLength: {
                          value: 10,
                          message:
                            "Phone number must be at least 10 characters.",
                        },
                      })}
                    />
                    {errors.primary_contact_number && (
                      <small className="text-danger">
                        {errors.primary_contact_number.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <h5 className="fw-bold mb-2">Secondary Contact</h5>

              <div className="row">
                <div className="col-md-6">
                  {/* Employee Name */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.secondary_contact_name ? "is-invalid" : ""}`}
                      placeholder="Enter Secondary Contact Name"
                      {...register("secondary_contact_name", {
                        required: "Name is required.",
                        minLength: {
                          value: 3,
                          message: "Name must be at least 3 characters.",
                        },
                      })}
                    />
                    {errors.secondary_contact_name && (
                      <small className="text-danger">
                        {errors.secondary_contact_name.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  {/* Email */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      Relationship <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.secondary_contact_relation ? "is-invalid" : ""}`}
                      placeholder="Enter Relationship"
                      {...register("secondary_contact_relation", {
                        required: "Relationship is required.",
                      })}
                    />
                    {errors.secondary_contact_relation && (
                      <small className="text-danger">
                        {errors.secondary_contact_relation.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  {/* Phone Number */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.secondary_contact_mumber ? "is-invalid" : ""}`}
                      placeholder="Enter Phone Number"
                      {...register("secondary_contact_mumber", {
                        required: "Phone number is required.",
                        minLength: {
                          value: 10,
                          message:
                            "Phone number must be at least 10 characters.",
                        },
                      })}
                    />
                    {errors.primary_contact_number && (
                      <small className="text-danger">
                        {errors.primary_contact_number.message}
                      </small>
                    )}
                  </div>
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
                  //onClick={onClose}
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

export default UpdateContactInfo;
