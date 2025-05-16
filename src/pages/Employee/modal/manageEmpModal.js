import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import Select from "react-select";

import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../../redux/companies";
import { addContact, updateContact } from "../../../redux/contacts/contactSlice";
import { fetchCountries } from "../../../redux/country";
import { fetchCurrencies } from "../../../redux/currency";
import { fetchDeals } from "../../../redux/deals";
import { fetchIndustries } from "../../../redux/industry";
import { fetchUsers } from "../../../redux/manage-user";
import { fetchMappedStates } from "../../../redux/mappedState";
import { fetchSources } from "../../../redux/source";
import { useFieldArray, } from "react-hook-form";
import ManageAddress from "./createAddress";

const initialAddress = [{
  street: "",
  street_no: "",
  building: "",
  floor: "",
  city: "",
  district: "",
  state: "",
  country: "",
  zip_code: "",
}]
const ManageEmpModal = ({ contact, setSelectedContact }) => {
  const [selectedLogo, setSelectedLogo] = useState();
  const [manageAddress, setManageAddress] = useState(initialAddress)
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
    defaultValues: {
      firstName: "",
      lastName: "",
      jobTitle: "",
      company_id: null,
      email: "",
      phone1: "",
      phone2: "",
      fax: "",
      deal_id: null,
      dateOfBirth: new Date(),
      reviews: null,
      owner: null,
      source: null,
      industry: null,
      currency: "",
      language: null,
      description: "",
      emailOptOut: false,
      streetAddress: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      socialProfiles: {
        facebook: "",
        linkedin: "",
        twitter: "",
      },
      visibility: "",
      is_active: "",
    },
  });



  React.useEffect(() => {
    if (contact) {
      reset({
        firstName: contact?.firstName || "",
        lastName: contact?.lastName || "",
        jobTitle: contact?.jobTitle || "",
        company_id: contact?.company_id || null,
        email: contact?.email || "",
        phone1: contact?.phone1 || "",
        phone2: contact?.phone2 || "",
        fax: contact?.fax || "",
        deal_id: contact?.deal_id || null,
        dateOfBirth: contact?.dateOfBirth || new Date(),
        reviews: contact?.reviews || null,
        owner: contact?.owner || null,
        source: contact?.source || null,
        industry: contact?.industry || null,
        currency: contact?.currency || "",
        language: contact?.language || null,
        description: contact?.description || "",
        emailOptOut: contact?.emailOptOut || false,
        streetAddress: contact?.streetAddress || "",
        city: contact?.city || "",
        state: contact?.state || "",
        country: contact?.country || "",
        zipcode: contact?.zipcode || "",
        visibility: contact?.visibility || "",
        is_active: contact?.is_active || "",

      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        jobTitle: "",
        company_id: null,
        email: "",
        phone1: "",
        phone2: "",
        fax: "",
        deal_id: null,
        dateOfBirth: new Date(),
        reviews: null,
        owner: null,
        source: null,
        industry: null,
        currency: "",
        language: null,
        description: "",
        emailOptOut: false,
        streetAddress: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
        socialProfiles: {
          facebook: "",
          linkedin: "",
          twitter: "",
        },
        visibility: "",
        is_active: "",
      });
    }
  }, [contact]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedLogo(file);
    }
  };

  const { loading } = useSelector((state) => state.contacts);

  React.useEffect(() => {
    dispatch(fetchIndustries());
    dispatch(fetchCompanies());
    dispatch(fetchDeals());
    dispatch(fetchUsers());
    dispatch(fetchSources());
    dispatch(fetchCountries());
    dispatch(fetchCurrencies())
  }, [dispatch]);

  const country_id = watch("country")
  React.useEffect(() => {
    country_id && dispatch(fetchMappedStates(country_id));
  }, [dispatch, country_id]);

  const { countries } = useSelector((state) => state.countries);
  const { mappedStates } = useSelector((state) => state.mappedStates);
  const { currencies } = useSelector((state) => state.currencies);

  const currencyLists = currencies?.data?.map(i => i?.is_active === "Y" ? ({ label: `${i?.code} - ${i?.name}`, value: i?.code }) : null).filter(Boolean) || [];


  const countryList = countries.map((emnt) => ({
    value: emnt.id,
    label: emnt.code + emnt.name,
  }));
  const stateList = mappedStates?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));

  const { industries } = useSelector((state) => state.industries);
  const { sources } = useSelector((state) => state.sources);
  const { deals } = useSelector((state) => state.deals);
  const { companies } = useSelector((state) => state.companies);
  const { users } = useSelector((state) => state.users);

  // Submit Handler
  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append all form fields
    Object?.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        // Convert complex data to strings if needed
        formData.append(
          key,
          typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key]
        );
      }
    });

    if (selectedLogo) {
      formData.append("image", selectedLogo);
    }
    if (contact) {
      formData.append("id", contact.id)
    }
    // formData.append("reviews",data.reviews ? Number(data.reviews) : null)

    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      contact ? await dispatch(updateContact(formData)).unwrap()
        : await dispatch(addContact(formData)).unwrap();
      closeButton.click();
    } catch (error) {
      closeButton.click();
    }
    finally {
      setSelectedLogo(null)
      setSelectedContact();
    }
  };
  React.useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add_edit_employee");
    if (offcanvasElement) {
      const handleModalClose = () => {
        // setSelectedContact();
        // setSelectedLogo(null);
      };
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose
      );
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleModalClose
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
        <h5 className="fw-semibold">{contact ? "Update" : "Add New"} Employee</h5>
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
                              // style={{image}}
                              />
                            ) : contact ?
                              <img
                                src={contact.image}
                                alt="Company Logo"
                                className="preview w-100 h-100 object-fit-cover"
                              />
                              : (
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
                            {/* <img
                              src="assets/img/profiles/avatar-20.jpg"
                              alt="img"
                              className="preview1"
                            />
                            <button type="button" className="profile-remove">
                              <i className="ti ti-x" />
                            </button> */}
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
                          {...register("firstName", {
                            required: "First name is required",
                          })}
                        />
                        {errors.firstName && (
                          <small className="text-danger">
                            {errors.firstName.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("lastName", {
                            required: "Last name is required",
                          })}
                        />
                        {errors.lastName && (
                          <small className="text-danger">
                            {errors.lastName.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("email", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
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
                            name="dateOfBirth"
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                {...field}
                                className="form-control"
                                selected={field.value}
                                onChange={field.onChange}
                                dateFormat="dd-MM-yyyy"
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Mobile<span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("mobile", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Gender <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("gender", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>



                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          National Number
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("national_id_number", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>


                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Passport Number<span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("passport_number", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>


                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Employment Type<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("employment_type", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>


                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Employee Category<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("employee_category", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Designation Id<span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("designation_id", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>


                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Department Id
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("designation_id", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>


                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Join Date<span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("join_date", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>


                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Confirm Date<span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("confirm_date", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>


                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Resign Date
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("resign_date", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Bank Id
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="TEXT"
                          className="form-control"
                          {...register("bank_id", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Account Number
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("account_number", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
                      </div>
                    </div>



                    <div className="col-md-4">
                      <div className="mb-3">
                        <label className="col-form-label">
                          WorkLocation
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("work_location", {
                            required: "Job title is required",
                          })}
                        />
                        {errors.jobTitle && (
                          <small className="text-danger">
                            {errors.jobTitle.message}
                          </small>
                        )}
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
                  <ManageAddress addNewColumn={addNewColumn} manageAddress={manageAddress} setManageAddress={setManageAddress} initialAddress={initialAddress} />
                  {/* /Address Info */}
                </div>
              </div>
            </div>
            {/* /Address Info */}
            {/* Social Profile */}
            <div className="accordion-item border-top rounded mb-3">
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
            </div>
            {/* /Social Profile */}` {/* Access */}
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
                  Access
                </Link>
              </div>
              <div
                className="accordion-collapse collapse"
                id="access-info"
                data-bs-parent="#main_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12">
                      {/* <div className="mb-3">
                        <label className="col-form-label">Visibility</label>
                        <div className="d-flex flex-wrap">
                          <div className="me-2">
                            <input
                              type="radio"
                              className="status-radio"
                              id="public"
                              value="public"
                              {...register("visibility")}
                            />
                            <label htmlFor="public">Public</label>
                          </div>
                          <div className="me-2">
                            <input
                              type="radio"
                              className="status-radio"
                              id="private"
                              value="private"
                              {...register("visibility")}
                            />
                            <label htmlFor="private">Private</label>
                          </div>
                          <div
                            data-bs-toggle="modal"
                            data-bs-target="#access_view"
                          >
                            <input
                              type="radio"
                              className="status-radio"
                              id="people"
                              value="people"
                              {...register("visibility")}
                            />
                            <label htmlFor="people">Select People</label>
                          </div>
                        </div>
                      </div> */}
                      <div className="mb-0">
                        <label className="col-form-label">Status</label>
                        <div className="d-flex flex-wrap">
                          <div className="me-2">
                            <input
                              type="radio"
                              className="status-radio"
                              id="active"
                              value="Y"
                              defaultChecked
                              {...register("is_active")}
                            />
                            <label htmlFor="active">Active</label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              className="status-radio"
                              id="inactive"
                              value="N"
                              {...register("is_active")}
                            />
                            <label htmlFor="inactive">Inactive</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Access */}`
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
              {contact ? loading ? "Updating..." : "Update" : loading ? "Creating..." : "Create"}
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
