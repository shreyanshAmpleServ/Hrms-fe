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
const UpdateBasicInfo = ({ employeeDetail }) => {
  const { loading } = useSelector((state) => state.employee);
  const { department } = useSelector((state) => state.department);
  const dispatch = useDispatch();
  const { designation } = useSelector((state) => state.designation);
  const departmentOptions = department?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.department_name,
  }));

  const designationOptions = designation?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.designation_name,
  }));

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  useEffect(() => {
    dispatch(fetchdepartment());
    dispatch(fetchdesignation());
  }, [dispatch]);

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
      "close_btn_update_basic_info_modal"
    );
    const formData = new FormData();
    if (employeeDetail) {
      formData.append("id", employeeDetail.id);
      formData.append("full_name", data.full_name);
      formData.append("first_name", data.full_name?.split(" ")[0] || "");
      formData.append(
        "last_name",
        data.full_name?.split(" ").slice(1).join(" ") || ""
      );
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
    <div className="modal fade" id="update_basic_info_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Edit Personal Info ({employeeDetail?.employee_code})
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_update_basic_info_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{ height: "calc(100vh - 200px)", overflowY: "auto" }}
              className="modal-body"
            >
              <div className="row">
                <div className="col-md-6">
                  {/* Employee Name */}
                  <div className="mb-3">
                    <label className="col-form-label">
                      Employee Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
                      placeholder="Enter Employee Name"
                      {...register("full_name", {
                        required: "Employee name is required.",
                        minLength: {
                          value: 3,
                          message:
                            "Employee name must be at least 3 characters.",
                        },
                      })}
                    />
                    {errors.full_name && (
                      <small className="text-danger">
                        {errors.full_name.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  {/* Email */}
                  <div className="mb-3">
                    <label className="col-form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="Enter Email"
                      {...register("email", {
                        required: "Email is required.",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address.",
                        },
                      })}
                    />
                    {errors.email && (
                      <small className="text-danger">
                        {errors.email.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  {/* Phone Number */}
                  <div className="mb-3">
                    <label className="col-form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.phone_number ? "is-invalid" : ""}`}
                      placeholder="Enter Phone Number"
                      {...register("phone_number", {
                        required: "Phone number is required.",
                        minLength: {
                          value: 10,
                          message:
                            "Phone number must be at least 10 characters.",
                        },
                      })}
                    />
                    {errors.phone_number && (
                      <small className="text-danger">
                        {errors.phone_number.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  {/* Date of Birth */}
                  <label className="col-form-label">
                    Date of Birth<span className="text-danger"> *</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="date_of_birth"
                      control={control}
                      rules={{ required: "Date of birth is required!" }}
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
                  {errors.date_of_birth && (
                    <small className="text-danger">
                      {errors.date_of_birth.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  {/* Department */}
                  <div className="mb-3">
                    <label className="col-form-label">
                      Department
                      <span className="text-danger"> *</span>
                    </label>
                    <Controller
                      name="department_id"
                      rules={{ required: "Department is required" }}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={departmentOptions}
                          placeholder="Choose Department"
                          classNamePrefix="react-select"
                          value={
                            departmentOptions?.find(
                              (option) =>
                                option.value === watch("department_id")
                            ) || ""
                          }
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption?.value || null);
                          }}
                        />
                      )}
                    />
                    {errors.department_id && (
                      <small className="text-danger">
                        {errors.department_id.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  {/* Designation */}
                  <div className="mb-3">
                    <label className="col-form-label">
                      Designation<span className="text-danger"> *</span>
                    </label>
                    <Controller
                      name="designation_id"
                      rules={{ required: "Designation is required" }}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={designationOptions}
                          placeholder="Choose Designation"
                          classNamePrefix="react-select"
                          value={
                            designationOptions?.find(
                              (option) =>
                                option.value === watch("designation_id")
                            ) || ""
                          }
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption?.value || null);
                          }}
                        />
                      )}
                    />
                    {errors.designation_id && (
                      <small className="text-danger">
                        {errors.designation_id.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  {/* Gender */}
                  <div className="mb-3">
                    <label className="col-form-label">
                      Gender
                      <span className="text-danger"> *</span>
                    </label>
                    <Controller
                      name="gender"
                      rules={{ required: "Gender is required" }}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={genderOptions}
                          placeholder="Choose Gender"
                          classNamePrefix="react-select"
                          value={
                            genderOptions?.find(
                              (option) => option.value === watch("gender")
                            ) || ""
                          }
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption?.value || null);
                          }}
                        />
                      )}
                    />
                    {errors.gender && (
                      <small className="text-danger">
                        {errors.gender.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  {/* Gender */}
                  <label className="col-form-label">
                    Date of Joining<span className="text-danger"> *</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="join_date"
                      control={control}
                      rules={{ required: "Date of joining is required!" }}
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
                  {errors.join_date && (
                    <small className="text-danger">
                      {errors.join_date.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  {/* Address */}
                  <div className="mb-3">
                    <label className="col-form-label">Address</label>
                    <textarea
                      className={`form-control ${errors.address ? "is-invalid" : ""}`}
                      placeholder="Enter Address"
                      {...register("address", {})}
                    />
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

export default UpdateBasicInfo;
