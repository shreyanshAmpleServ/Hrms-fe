// Required imports
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../../redux/Employee";
import { addUser } from "../../../../redux/manage-user";
import { fetchRoles } from "../../../../redux/roles";

const AddUserModal = () => {
  const dispatch = useDispatch();

  const { roles, loading: rolesLoading } = useSelector((state) => state.roles);
  const { loading } = useSelector((state) => state.users);
  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {}
  );

  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      full_name: "",
      phone: "",
      address: "",
      role_id: null,
      is_active: "Y",
    },
  });

  useEffect(() => {
    dispatch(fetchRoles({ is_active: true }));
    dispatch(fetchEmployee({ status: "Active" }));
  }, [dispatch]);

  useEffect(() => {
    if (showEmployeeDetails && selectedEmployee) {
      setValue("full_name", `${selectedEmployee.full_name || ""}`);
      setValue("email", selectedEmployee.email || "");
      setValue("phone", selectedEmployee.phone_number || "");
      setValue("address", selectedEmployee.address || "");
    }
    if (!showEmployeeDetails) {
      setSelectedEmployee(null);
      setValue("full_name", "");
      setValue("email", "");
      setValue("phone", "");
      setValue("address", "");
      setValue("employee_id", null);
    }
  }, [showEmployeeDetails, selectedEmployee, setValue]);

  const roleOptions = roles?.map((role) => ({
    value: role.id,
    label: role.role_name,
  }));

  const employees = employee?.data?.map((i) => ({
    label: `${i?.full_name || ""} (${i?.employee_code || ""})`, // name + code
    value: i?.id,
    data: i, // full employee object for later use
  }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedAvatar(file);
  };

  const onSubmit = async (data) => {
    const closeButton = document.getElementById("close_add_user");
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null) formData.append(key, data[key]);
    });
    if (selectedAvatar) formData.append("profile_img", selectedAvatar);
    try {
      await dispatch(addUser(formData)).unwrap();
      closeButton.click();
      reset();
      setSelectedEmployee(null);
      setSelectedAvatar(null);
    } catch (error) {
      setSelectedEmployee(null);
      closeButton.click();
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add_user"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">Add User</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          id="close_add_user"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("entityType", { value: "user" })} />
          <input
            type="hidden"
            {...register("username", { value: watch("email") })}
          />
          <div className="row">
            <div className="col-md-4">
              <div className="profile-pic-upload">
                <div className="profile-pic">
                  {selectedAvatar ? (
                    <img
                      src={URL.createObjectURL(selectedAvatar)}
                      alt="Avatar Preview"
                      className="img-fluid"
                    />
                  ) : (
                    <span>
                      <i className="ti ti-photo" />
                    </span>
                  )}
                </div>
                <div className="upload-content">
                  <div className="upload-btn">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <span>
                      <i className="ti ti-file-broken" /> Upload File
                    </span>
                  </div>
                  <p>JPG, GIF, or PNG. Max size of 800K</p>
                </div>
              </div>
            </div>

            <div className="col-md-4 offset-md-4">
              <div className="form-check m-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="use_employee_data"
                  checked={showEmployeeDetails}
                  onChange={(e) => setShowEmployeeDetails(e.target.checked)}
                />
                <label
                  className="form-check-label fw-semibold"
                  htmlFor="use_employee_data"
                >
                  By Employee
                </label>
              </div>
            </div>

            {showEmployeeDetails ? (
              <div className="col-md-6 mb-3">
                <label className="col-form-label">
                  Employee <span className="text-danger">*</span>
                </label>
                <Controller
                  name="employee_id"
                  control={control}
                  rules={
                    showEmployeeDetails && { required: "Employee is required" }
                  }
                  render={() => {
                    return (
                      <Select
                        options={employees}
                        isLoading={employeeLoading}
                        onChange={(empOption) => {
                          setValue("employee_id", empOption?.value);
                          setSelectedEmployee(empOption.data);
                        }}
                        placeholder="Choose Employee"
                        className="employee_id"
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    );
                  }}
                />
                {errors.employee_id && (
                  <small className="text-danger">
                    {errors.employee_id.message}
                  </small>
                )}
              </div>
            ) : (
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    {...register(
                      "full_name",
                      !showEmployeeDetails && {
                        required: "Full Name is required",
                      }
                    )}
                    readOnly={showEmployeeDetails}
                  />
                  {errors.full_name && (
                    <small className="text-danger">
                      {errors.full_name.message}
                    </small>
                  )}
                </div>
              </div>
            )}

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Username/Email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email"
                  disabled={showEmployeeDetails}
                  {...register("email", { required: "Email is required" })}
                  readOnly={showEmployeeDetails}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Role <span className="text-danger">*</span>
                </label>
                <Select
                  className="react-select"
                  options={roleOptions}
                  isLoading={rolesLoading}
                  onChange={(selectedOption) =>
                    setValue("role_id", selectedOption?.value)
                  }
                  placeholder="Select Role"
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
                {errors.role_id && (
                  <small className="text-danger">
                    {errors.role_id.message}
                  </small>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Phone <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Phone Number"
                  disabled={showEmployeeDetails}
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  readOnly={showEmployeeDetails}
                />
                {errors.phone && (
                  <small className="text-danger">{errors.phone.message}</small>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <small className="text-danger">
                    {errors.password.message}
                  </small>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="  Confirm Password"
                  {...register("repeatPassword", {
                    required: "Repeat password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                {errors.repeatPassword && (
                  <small className="text-danger">
                    {errors.repeatPassword.message}
                  </small>
                )}
              </div>
            </div>

            <div className="col-md-12">
              <div className="mb-3">
                <label className="col-form-label">Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  className="form-control"
                  {...register("address")}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="radio-wrap">
                <label className="col-form-label">Status</label>
                <div className="d-flex align-items-center gap-4">
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      id="active"
                      name="status"
                      value="Y"
                      defaultChecked
                      {...register("is_active")}
                    />
                    <label htmlFor="active">Active</label>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      id="inactive"
                      name="status"
                      value="N"
                      {...register("is_active")}
                    />
                    <label htmlFor="inactive">Inactive</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-end">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
              {loading && (
                <div
                  style={{ height: "15px", width: "15px" }}
                  className="spinner-border ml-2 text-light"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
