import moment from "moment";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import {
  empStatusOptions,
  genderOptions,
  maritalStatusOptions,
} from "../../../components/common/selectoption/selectoption";
import { fetchbank } from "../../../redux/bank";
import { fetchCountries } from "../../../redux/country";
import { fetchCurrencies } from "../../../redux/currency";
import { fetchdepartment } from "../../../redux/department";
import { fetchdesignation } from "../../../redux/designation";
import { createEmployee, updateEmployee } from "../../../redux/Employee";
import { fetchemploymentType } from "../../../redux/employee-type";
import { fetchShift } from "../../../redux/Shift";
import ManageAddress from "./createAddress";

const initialAddress = [
  {
    street: "",
    street_no: "",
    building: "",
    floor: "",
    city: "",
    district: "",
    state: "",
    country: "",
    zip_code: "",
  },
];
const initialEmpData = {
  employee_code: "",
  first_name: "",
  last_name: "",
  full_name: "",
  profile_pic: "",
  gender: null,
  date_of_birth: new Date().toISOString(),
  national_id_number: "",
  passport_number: "",
  employment_type: "",
  employee_category: null,
  designation_id: null,
  department_id: null,
  join_date: new Date().toISOString(),
  confirm_date: new Date().toISOString(),
  resign_date: null,
  bank_id: "",
  account_number: null,
  work_location: "",
  email: "",
  phone_number: "",
  status: "",
};
const ManageEmpModal = ({ employeeData, setEmployeeData }) => {
  const [selectedLogo, setSelectedLogo] = useState();
  const [manageAddress, setManageAddress] = useState(initialAddress);
  const [stateOptions, setStateOptions] = useState([]);
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialEmpData,
  });

  React.useEffect(() => {
    if (employeeData) {
      reset({
        employee_code: employeeData?.employee_code || "",
        first_name: employeeData?.first_name || "",
        last_name: employeeData?.last_name || "",
        full_name: employeeData?.full_name || null,
        profile_pic: employeeData?.profile_pic || "",
        gender: employeeData?.gender || "",
        date_of_birth: employeeData?.date_of_birth || new Date().toISOString(),
        national_id_number: employeeData?.national_id_number || "",
        passport_number: employeeData?.passport_number || null,
        employment_type: employeeData?.employment_type || null,
        employee_category: employeeData?.employee_category || null,
        designation_id: employeeData?.designation_id || null,
        department_id: employeeData?.department_id || null,
        join_date: employeeData?.join_date || new Date().toISOString(),
        confirm_date: employeeData?.confirm_date || new Date().toISOString(),
        resign_date: employeeData?.resign_date || null,
        bank_id: employeeData?.bank_id || "",
        account_number: employeeData?.account_number || null,
        work_location: employeeData?.work_location || "",
        email: employeeData?.email || "",
        phone_number: employeeData?.phone_number || "",
        status: employeeData?.status || "",
        spouse_name: employeeData?.spouse_name || "",
        no_of_child: employeeData?.no_of_child || null,
        marital_status: employeeData?.marital_status || "",
        manager_id: employeeData?.manager_id || null,
        father_name: employeeData?.father_name || "",
        mother_name: employeeData?.mother_name || "",
        emergency_contact: employeeData?.emergency_contact || "",
        emergency_contact_person: employeeData?.emergency_contact_person || "",
        contact_relation: employeeData?.contact_relation || "",
      });
      setManageAddress(
        employeeData?.hrms_employee_address?.map((addr) => ({ ...addr })) || []
      );
      setStateOptions(
        employeeData?.hrms_employee_address?.map((addr) => [
          {
            value: addr?.state,
            label: addr?.employee_state?.name,
          },
        ]) || []
      );
    } else {
      reset(initialEmpData);
    }
  }, [employeeData, reset]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedLogo(file);
    }
  };
  const { loading } = useSelector((state) => state.contacts);

  React.useEffect(() => {
    dispatch(fetchemploymentType({ is_active: true }));
    dispatch(fetchdesignation({ is_active: true }));
    dispatch(fetchdepartment({ is_active: true }));
    dispatch(fetchbank({ is_active: true }));
    dispatch(fetchCountries({ is_active: true }));
    dispatch(fetchCurrencies({ is_active: true }));
    dispatch(fetchShift({ is_active: true }));
  }, [dispatch]);

  const { bank } = useSelector((state) => state.bank);

  const { employmentType } = useSelector((state) => state.employmentType);
  const { shift } = useSelector((state) => state.shift);

  const { designation } = useSelector((state) => state.designation);
  const { department } = useSelector((state) => state.department);

  const employmentOptions = employmentType?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.type_name,
  }));
  const designationOptions = designation?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.designation_name,
  }));
  const departmentOptions = department?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.department_name,
  }));
  const bankOptions = bank?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.bank_name,
  }));
  const shiftOptions = shift?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.shift_name,
  }));

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object?.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        if (
          key === "date_of_birth" ||
          key === "join_date" ||
          key === "confirm_date"
        ) {
          formData.append(key, new Date(data[key]).toISOString());
        } else {
          formData.append(
            key,
            typeof data[key] === "object"
              ? JSON.stringify(data[key])
              : data[key]
          );
        }
      }
    });

    if (data)
      if (selectedLogo) {
        formData.append("profile_pic", selectedLogo);
      }
    formData.append("empAddressData", JSON.stringify(manageAddress));
    if (employeeData) {
      formData.append("id", employeeData.id);
    }

    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      employeeData
        ? await dispatch(updateEmployee(formData)).unwrap()
        : await dispatch(createEmployee(formData)).unwrap();
      setSelectedLogo(null);
      reset(initialEmpData);
      setManageAddress(initialAddress);
      setStateOptions([]);
      closeButton.click();
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleClose = () => {
    setSelectedLogo(null);
    reset(initialEmpData);
    setManageAddress(initialAddress);
    setStateOptions([]);
    setEmployeeData(null);
  };
  React.useEffect(() => {
    const offcanvasElement = document.getElementById(
      "offcanvas_add_edit_employee"
    );
    if (offcanvasElement) {
      offcanvasElement.addEventListener("hidden.bs.offcanvas", handleClose);
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleClose
        );
      };
    }
  }, [reset]);
  const addNewColumn = () => {
    setManageAddress((prev) => [
      ...prev,
      {
        street: "",
        street_no: "",
        building: "",
        floor: "",
        city: "",
        district: "",
        state: "",
        country: "",
        zip_code: "",
      },
    ]);
    const modalBody = document.querySelector(".offcanvas-body");
    modalBody.scrollTo({
      top: modalBody.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-larger"
      tabIndex={-1}
      id="offcanvas_add_edit_employee"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {employeeData ? "Update" : "Add New"} Employee
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={handleClose}
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="accordion" id="main_accordion">
            {/* Basic Info */}
            <div className="accordion-item rounded mb-3">
              <div className="accordion-header">
                <Link
                  to="#"
                  className="accordion-button accordion-custom-button bg-white rounded fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#basic"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-user-plus fs-20" />
                  </span>
                  Employee Info
                </Link>
              </div>
              <div
                className="accordion-collapse collapse show"
                id="basic"
                data-bs-parent="#main_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">
                        <div className="profile-upload">
                          <div className="profile-upload-img">
                            {selectedLogo ? (
                              <img
                                src={URL.createObjectURL(selectedLogo)}
                                alt="Company Logo"
                                className="preview w-100 h-100 object-fit-cover"
                              />
                            ) : employeeData ? (
                              <img
                                src={employeeData.profile_pic}
                                alt="Profile Logo"
                                className="preview w-100 h-100 object-fit-cover"
                              />
                            ) : (
                              <span>
                                <i className="ti ti-photo" />
                              </span>
                            )}
                            <button
                              type="button"
                              className="profile-remove"
                              onClick={() => setSelectedLogo(null)}
                            >
                              <i className="ti ti-x" />
                            </button>
                          </div>
                          <div className="profile-upload-content">
                            <label className="profile-upload-btn">
                              <i className="ti ti-file-broken" /> Upload File
                              <input
                                type="file"
                                accept="image/*"
                                className="input-img"
                                onChange={handleLogoChange}
                              />
                            </label>
                            <p>JPG, GIF or PNG. Max size of 800 Kb</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          First Name <span className="text-danger">*</span>
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter First Name"
                          {...register("first_name", {
                            required: "First name is required",
                          })}
                        />
                        {errors.first_name && (
                          <small className="text-danger">
                            {errors.first_name.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Last Name"
                          {...register("last_name")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Employee Code
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Employee Code"
                          {...register("employee_code", {
                            required: "Employee code is required",
                          })}
                        />
                        {errors.employee_code && (
                          <small className="text-danger">
                            {errors.employee_code.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Email
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Email"
                          {...register("email", {
                            required: "Email is required",
                          })}
                        />
                        {errors.email && (
                          <small className="text-danger">
                            {errors.email.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Date of Birth</label>
                        <div className="icon-form-end">
                          <span className="form-icon">
                            <i className="ti ti-calendar-event" />
                          </span>
                          <Controller
                            name="date_of_birth"
                            control={control}
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
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Mobile
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter Mobile Number"
                          {...register("phone_number")}
                        />
                        {errors.phone_number && (
                          <small className="text-danger">
                            {errors.phone_number.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Gender <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="gender"
                          rules={{ required: "Gender is required" }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={genderOptions}
                              placeholder="Select Gender"
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

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          National Number
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter National Number"
                          {...register("national_id_number")}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Passport Number
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Enter Passport Number"
                          {...register("passport_number")}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Employment Type<span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="employment_type"
                          rules={{ required: "Employment type is required" }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={employmentOptions}
                              placeholder="Choose Employment Type"
                              classNamePrefix="react-select"
                              value={
                                employmentOptions?.find(
                                  (option) =>
                                    option.value === watch("employment_type")
                                ) || ""
                              }
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value || null);
                              }}
                            />
                          )}
                        />
                        {errors.employment_type && (
                          <small className="text-danger">
                            {errors.employment_type.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Employee Category
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Employee Category"
                          {...register("employee_category")}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Designation<span className="text-danger">*</span>
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

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Shift
                          <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="shift_id"
                          rules={{ required: "Shift is required" }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={shiftOptions}
                              placeholder="Choose Shift"
                              classNamePrefix="react-select"
                              value={
                                shiftOptions?.find(
                                  (option) => option.value === watch("shift_id")
                                ) || ""
                              }
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value || null);
                              }}
                            />
                          )}
                        />
                        {errors.shift_id && (
                          <small className="text-danger">
                            {errors.shift_id.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Department
                          <span className="text-danger">*</span>
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

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Join Date</label>
                        <div className="icon-form-end">
                          <span className="form-icon">
                            <i className="ti ti-calendar-event" />
                          </span>
                          <Controller
                            name="join_date"
                            control={control}
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
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Confirm Date</label>
                        <Controller
                          name="confirm_date"
                          control={control}
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
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Bank</label>
                        <Controller
                          name="bank_id"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={bankOptions}
                              placeholder="Choose Bank"
                              classNamePrefix="react-select"
                              value={
                                bankOptions?.find(
                                  (option) => option.value === watch("bank_id")
                                ) || ""
                              }
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value || null);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Status</label>
                        <Controller
                          name="status"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={empStatusOptions}
                              placeholder="Choose Status"
                              classNamePrefix="react-select"
                              value={
                                empStatusOptions?.find(
                                  (option) => option.value === watch("status")
                                ) || ""
                              }
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value || null);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Account Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Account Number"
                          {...register("account_number")}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Work Location</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Work Location"
                          {...register("work_location")}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Assign Manager</label>
                        <Controller
                          name="manager_id"
                          control={control}
                          render={({ field }) => (
                            <EmployeeSelect
                              value={field.value}
                              onChange={(i) => field.onChange(i?.value)}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Basic Info */}
            <div className="accordion-item border-top rounded mb-3">
              <div className="accordion-header">
                <Link
                  to="#"
                  className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#address"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-map fs-20" />
                  </span>
                  Manage Address
                </Link>
              </div>
              <div
                className="accordion-collapse collapse"
                id="address"
                data-bs-parent="#main_accordion"
              >
                <div className="accordion-body border-top">
                  <ManageAddress
                    addNewColumn={addNewColumn}
                    manageAddress={manageAddress}
                    setManageAddress={setManageAddress}
                    initialAddress={initialAddress}
                    stateOptions={stateOptions}
                    setStateOptions={setStateOptions}
                  />
                </div>
              </div>
            </div>

            <div className="accordion-item border-top rounded mb-3">
              <div className="accordion-header">
                <Link
                  to="#"
                  className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#access-info"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-accessible fs-20" />
                  </span>
                  Family Details
                </Link>
              </div>
              <div
                className="accordion-collapse collapse"
                id="access-info"
                data-bs-parent="#main_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Marital Status</label>
                        <Controller
                          name="marital_status"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={maritalStatusOptions}
                              placeholder="Choose Marital Status"
                              classNamePrefix="react-select"
                              value={
                                maritalStatusOptions?.find(
                                  (option) =>
                                    option.value === watch("marital_status")
                                ) || ""
                              }
                              onChange={(selectedOption) => {
                                field.onChange(selectedOption?.value || null);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Spouse Name</label>
                        <input
                          type="text"
                          disabled={watch("marital_status") === "Un-married"}
                          className="form-control"
                          placeholder="Enter Spouse Name"
                          {...register("spouse_name")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">No Of Child</label>
                        <input
                          type="text"
                          disabled={watch("marital_status") === "Un-married"}
                          className="form-control"
                          placeholder="Enter No Of Child"
                          {...register("no_of_child")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Father Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Father Name"
                          {...register("father_name")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Mother Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Mother Name"
                          {...register("mother_name")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Emergency Contact
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Emergency Contact"
                          {...register("primary_contact_number")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Contact Person</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Contact Person"
                          {...register("primary_contact_name")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Contact Relation
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Contact Relation"
                          {...register("primary_contact_relation")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-end">
            <button
              type="button"
              className="btn btn-light me-2"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {employeeData
                ? loading
                  ? "Updating..."
                  : "Update"
                : loading
                  ? "Creating..."
                  : "Create"}
              {loading && (
                <div
                  style={{
                    height: "15px",
                    width: "15px",
                  }}
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
export default ManageEmpModal;
