import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateEmployee } from "../../../../redux/Employee";
const UpdateBankInfo = ({ employeeDetail }) => {
  const { loading } = useSelector((state) => state.employee);

  const address = employeeDetail?.hrms_employee_address?.[1];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm({
    defaultValues: {
      address:
        [
          address?.street_no,
          address?.street,
          address?.city,
          address?.employee_state?.name,
          address?.employee_country?.name,
          address?.zip_code,
        ]
          .filter(Boolean)
          .join(", ") ||
        " - - " ||
        "",
      department_id: employeeDetail?.department_id || "",
      designation_id: employeeDetail?.designation_id || "",
      gender: employeeDetail?.gender || "",
      date_of_birth: employeeDetail?.date_of_birth || "",
      full_name: employeeDetail?.full_name || "",
      email: employeeDetail?.email || "",
      phone_number: employeeDetail?.phone_number || "",
    },
  });

  useEffect(() => {
    if (employeeDetail) {
      reset({
        full_name: employeeDetail.full_name || "",
        is_active: employeeDetail.is_active,
        department_id: employeeDetail.department_id || "",
        designation_id: employeeDetail.designation_id || "",
        gender: employeeDetail.gender || "",
        date_of_birth:
          employeeDetail.date_of_birth || new Date().toISOString() || "",
        email: employeeDetail.email || "",
        phone_number: employeeDetail.phone_number || "",
        address: employeeDetail.address || "",
        join_date: employeeDetail.join_date || new Date().toISOString() || "",
      });
    } else {
      reset({
        full_name: "",
        department_id: "",
        designation_id: "",
        gender: "",
        date_of_birth: "",
        email: "",
        phone_number: "",
        address: "",
        join_date: "",
      });
    }
  }, [employeeDetail, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_update_contact_info_modal"
    );
    const formData = new FormData();
    if (employeeDetail) {
      formData.append("id", employeeDetail.id);
      formData.append("full_name", data.full_name);
      formData.append("first_name", data.full_name?.split(" ")[0] || "");
      formData.append("last_name", data.full_name?.split(" ")[1] || "");
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("department_id", data.department_id);
      formData.append("designation_id", data.designation_id);
      formData.append("gender", data.gender);
      formData.append("date_of_birth", data.date_of_birth);
      formData.append("join_date", data.join_date);
      formData.append("address", data.address);
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
                      placeholder="Enter Employee Name"
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
                      className={`form-control ${errors.primary_contact_relationship ? "is-invalid" : ""}`}
                      placeholder="Enter Relationship"
                      {...register("primary_contact_relationship", {
                        required: "Relationship is required.",
                      })}
                    />
                    {errors.primary_contact_relationship && (
                      <small className="text-danger">
                        {errors.primary_contact_relationship.message}
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
                      className={`form-control ${errors.primary_contact_phone_number ? "is-invalid" : ""}`}
                      placeholder="Enter Phone Number"
                      {...register("primary_contact_phone_number", {
                        required: "Phone number is required.",
                        minLength: {
                          value: 10,
                          message:
                            "Phone number must be at least 10 characters.",
                        },
                      })}
                    />
                    {errors.primary_contact_phone_number && (
                      <small className="text-danger">
                        {errors.primary_contact_phone_number.message}
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
                      placeholder="Enter Employee Name"
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
                      className={`form-control ${errors.secondary_contact_relationship ? "is-invalid" : ""}`}
                      placeholder="Enter Relationship"
                      {...register("secondary_contact_relationship", {
                        required: "Relationship is required.",
                      })}
                    />
                    {errors.secondary_contact_relationship && (
                      <small className="text-danger">
                        {errors.secondary_contact_relationship.message}
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
                      className={`form-control ${errors.secondary_contact_phone_number ? "is-invalid" : ""}`}
                      placeholder="Enter Phone Number"
                      {...register("secondary_contact_phone_number", {
                        required: "Phone number is required.",
                        minLength: {
                          value: 10,
                          message:
                            "Phone number must be at least 10 characters.",
                        },
                      })}
                    />
                    {errors.primary_contact_phone_number && (
                      <small className="text-danger">
                        {errors.primary_contact_phone_number.message}
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

export default UpdateBankInfo;
