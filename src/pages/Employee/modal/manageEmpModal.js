import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import Select from "react-select";

import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
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
import {
  createEmployee,
  fetchEmployee,
  updateEmployee,
} from "../../../redux/Employee";
import { fetchemploymentType } from "../../../redux/employee-type";
import { fetchStates } from "../../../redux/state";
import ManageAddress from "./createAddress";
import moment from "moment";

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
  const [searchEmployee, setSearchEmployee] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
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
        employeeData?.hrms_employee_address?.map((addr) => ({ ...addr })) || [],
      );
      setStateOptions(
        employeeData?.hrms_employee_address?.map((addr) => [
          {
            value: addr?.state,
            label: addr?.employee_state.name,
          },
        ]) || [],
      );
    } else {
      reset(initialEmpData);
    }
  }, [employeeData]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedLogo(file);
    }
  };
  const { loading } = useSelector((state) => state.contacts);

  React.useEffect(() => {
    dispatch(fetchemploymentType());
    dispatch(fetchdesignation());
    dispatch(fetchdepartment());
    dispatch(fetchbank());
    dispatch(fetchCountries());
    dispatch(fetchCurrencies());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(fetchEmployee({ search: searchEmployee }));
  }, [searchEmployee]);

  const { employee, loading: loadingEmployee } = useSelector(
    (state) => state.employee,
  );

  const { bank, loading: loadingBank } = useSelector((state) => state.bank);

  const { employmentType, loading: loadingEmp } = useSelector(
    (state) => state.employmentType,
  );
  const { designation, loading: loadingDesignaion } = useSelector(
    (state) => state.designation,
  );
  const { department, loading: loadingDept } = useSelector(
    (state) => state.department,
  );

  // const currencyLists = currencies?.data?.map(i => i?.is_active === "Y" ? ({ label: `${i?.code} - ${i?.name}`, value: i?.code }) : null).filter(Boolean) || [];

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
  const employeeOptions = employee?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.full_name,
  }));

  // Submit Handler
  const onSubmit = async (data) => {
    const formData = new FormData();
    console.log("data", data);
    // Append all form fields

    Object?.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        // Convert complex data to strings if needed
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
              : data[key],
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
    // formData.append("reviews",data.reviews ? Number(data.reviews) : null)

    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      employeeData
        ? await dispatch(updateEmployee(formData)).unwrap()
        : await dispatch(createEmployee(formData)).unwrap();
    } catch (error) {
      closeButton.click();
    } finally {
      closeButton.click();
      setSelectedLogo(null);
      reset(initialEmpData);
      setManageAddress(initialAddress);
      setStateOptions([]);
    }
  };
  React.useEffect(() => {
    const offcanvasElement = document.getElementById(
      "offcanvas_add_edit_employee",
    );
    if (offcanvasElement) {
      const handleModalClose = () => {
        setSelectedLogo(null);
        reset(initialEmpData);
        setStateOptions([]);
        setManageAddress(initialAddress);
      };
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose,
      );
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleModalClose,
        );
      };
    }
  }, []);
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
                          {...register("last_name")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Code
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
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
                          rules={{ required: "DepartmBnaent is required" }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={genderOptions}
                              placeholder="Choose"
                              classNamePrefix="react-select"
                              value={
                                genderOptions?.find(
                                  (option) => option.value === watch("gender"),
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
                              placeholder="Choose"
                              classNamePrefix="react-select"
                              value={
                                employmentOptions?.find(
                                  (option) =>
                                    option.value === watch("employment_type"),
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
                              placeholder="Choose"
                              classNamePrefix="react-select"
                              value={
                                designationOptions?.find(
                                  (option) =>
                                    option.value === watch("designation_id"),
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
                              placeholder="Choose"
                              classNamePrefix="react-select"
                              value={
                                departmentOptions?.find(
                                  (option) =>
                                    option.value === watch("department_id"),
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
                              placeholder="Choose"
                              classNamePrefix="react-select"
                              value={
                                bankOptions?.find(
                                  (option) => option.value === watch("bank_id"),
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
                              placeholder="Choose"
                              classNamePrefix="react-select"
                              value={
                                empStatusOptions?.find(
                                  (option) => option.value === watch("status"),
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
                          {...register("account_number")}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">WorkLocation</label>
                        <input
                          type="text"
                          className="form-control"
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
                            <Select
                              {...field}
                              options={employeeOptions}
                              placeholder="Choose"
                              classNamePrefix="react-select"
                              isLoading={loadingEmployee}
                              onInputChange={(value) => {
                                setSearchEmployee(value);
                              }}
                              value={
                                employeeOptions?.find(
                                  (option) =>
                                    option.value === watch("manager_id"),
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
                  {/* /Address Info */}
                </div>
              </div>
            </div>
            {/* /Address Info */}
            {/* Social Profile */}
            {/* <div className="accordion-item border-top rounded mb-3">
              <div className="accordion-header">
                <Link
                  to="#"
                  className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                  data-bs-toggle="collapse"
                  data-bs-target="#social"
                >
                  <span className="avatar avatar-md rounded text-dark border me-2">
                    <i className="ti ti-social fs-20" />
                  </span>
                  Social Profile
                </Link>
              </div>
              <div
                className="accordion-collapse collapse"
                id="social"
                data-bs-parent="#main_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Facebook</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("socialProfiles.facebook")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Skype </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("socialProfiles.skype")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Linkedin </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("socialProfiles.linkedin")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Twitter</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("socialProfiles.twitter")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3 mb-md-0">
                        <label className="col-form-label">Whatsapp</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("socialProfiles.whatsapp")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-0">
                        <label className="col-form-label">Instagram</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("socialProfiles.instagram")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* /Social Profile */} {/* Access */}
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
                    {/* <div className="col-md-12"> */}

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
                              placeholder="Choose"
                              classNamePrefix="react-select"
                              value={
                                maritalStatusOptions?.find(
                                  (option) =>
                                    option.value === watch("marital_status"),
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
                          {...register("emergency_contact")}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">Contact Person</label>

                        <input
                          type="text"
                          className="form-control"
                          {...register("emergency_contact_person")}
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
                          {...register("contact_relation")}
                        />
                      </div>
                    </div>
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
            {/* /Access */}
          </div>
          <div className="d-flex align-items-center justify-content-end">
            <button
              type="button"
              data-bs-dismiss="offcanvas"
              className="btn btn-light me-2"
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
