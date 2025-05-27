import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateEmployee } from "../../../../redux/Employee";
import moment from "moment";
import DatePicker from "react-datepicker";
const UpdatePassportInfo = ({ employeeDetail }) => {
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
      passport_number: "",
      nationality: "",
      passport_issue_date: new Date().toISOString(),
      passport_expiry_date: new Date().toISOString(),
    },
  });

  useEffect(() => {
    if (employeeDetail) {
      reset({
        passport_number: employeeDetail.passport_number || "",
        nationality: employeeDetail.nationality || "",
        passport_issue_date:
          employeeDetail.passport_issue_date || new Date().toISOString(),
        passport_expiry_date:
          employeeDetail.passport_expiry_date || new Date().toISOString(),
      });
    } else {
      reset({
        passport_number: "",
        nationality: "",
        passport_issue_date: new Date().toISOString(),
        passport_expiry_date: new Date().toISOString(),
      });
    }
  }, [employeeDetail, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_update_passport_info_modal"
    );
    const formData = new FormData();
    if (employeeDetail) {
      formData.append("id", employeeDetail.id);
      formData.append("passport_number", data.passport_number);
      formData.append("nationality", data.nationality);
      formData.append(
        "passport_issue_date",
        new Date(data.passport_issue_date).toISOString()
      );
      formData.append(
        "passport_expiry_date",
        new Date(data.passport_expiry_date).toISOString()
      );
      dispatch(updateEmployee(formData));
    }
    reset();
    closeButton.click();
  };

  return (
    <div className="modal fade" id="update_passport_info_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Passport Info</h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_update_passport_info_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  {/* Passport Number */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      Passport Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.passport_number ? "is-invalid" : ""}`}
                      placeholder="Enter Passport Number"
                      {...register("passport_number", {
                        required: "Passport number is required.",
                        minLength: {
                          value: 3,
                          message:
                            "Passport number must be at least 3 characters.",
                        },
                      })}
                    />
                    {errors.passport_number && (
                      <small className="text-danger">
                        {errors.passport_number.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  {/* Email */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      Nationality <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.nationality ? "is-invalid" : ""}`}
                      placeholder="Enter Nationality"
                      {...register("nationality", {
                        required: "Nationality is required.",
                      })}
                    />
                    {errors.nationality && (
                      <small className="text-danger">
                        {errors.nationality.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  {/* Issue Date */}
                  <label className="col-form-label">
                    Issue Date<span className="text-danger"> *</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="passport_issue_date"
                      control={control}
                      placeholder="Select Issue Date"
                      rules={{ required: "Issue date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          selected={field.value}
                          value={
                            field.value
                              ? moment(field.value).format("DD-MM-YYYY")
                              : null
                          }
                          onChange={field.onChange}
                          dateFormat="DD-MM-YYYY"
                        />
                      )}
                    />
                  </div>
                  {errors.passport_issue_date && (
                    <small className="text-danger">
                      {errors.passport_issue_date.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6">
                  {/* Date of Birth */}
                  <label className="col-form-label">
                    Expiry Date<span className="text-danger"> *</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="passport_expiry_date"
                      control={control}
                      rules={{ required: "Expiry date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          selected={field.value}
                          value={
                            field.value
                              ? moment(field.value).format("DD-MM-YYYY")
                              : null
                          }
                          onChange={field.onChange}
                          dateFormat="DD-MM-YYYY"
                        />
                      )}
                    />
                  </div>
                  {errors.passport_expiry_date && (
                    <small className="text-danger">
                      {errors.passport_expiry_date.message}
                    </small>
                  )}
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

export default UpdatePassportInfo;
