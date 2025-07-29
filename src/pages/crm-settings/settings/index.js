import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FaBuilding,
  FaEdit,
  FaEnvelope,
  FaFileInvoiceDollar,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaSave,
  FaTimes,
  FaUpload,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect from "react-select";
import { fetchSettings, updateSettings } from "../../../redux/Settings";
import { fetchCountries } from "../../../redux/country";
import { fetchStates } from "../../../redux/state";
import logger from "../../../utils/logger";

const Settings = () => {
  const dispatch = useDispatch();
  const { settings: settingsData } = useSelector((state) => state.settings);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm();

  const settings = settingsData?.data;

  useEffect(() => {
    if (settings) {
      reset({
        companyName: settings.company_name || "",
        email: settings.email || "",
        phone: settings.phone_number || "",
        website: settings.website || "",
        address: settings.street_address || "",
        city: settings.city || "",
        state: settings.state || "",
        zipCode: settings.zip_code || "",
        country: settings.country || "",
        gstNumber: settings.gst_number || "",
        panNumber: settings.pan_number || "",
        taxId: settings.tax_id || "",
        description: settings.description || "",
      });

      if (settings.company_logo) {
        setLogoPreview(settings.company_logo);
      }
      if (settings.company_signature) {
        setSignaturePreview(settings.company_signature);
      }
    }
  }, [settings, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("company_name", data.companyName);
    formData.append("id", settings?.id);
    formData.append("email", data.email);
    formData.append("phone_number", data.phone);
    formData.append("company_logo", logoFile);
    formData.append("company_signature", signatureFile);
    formData.append("website", data.website);
    formData.append("street_address", data.address);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("zip_code", data.zipCode);
    formData.append("country", data.country);
    formData.append("gst_number", data.gstNumber);
    formData.append("pan_number", data.panNumber);
    formData.append("tax_id", data.taxId);
    formData.append("description", data.description);
    await dispatch(updateSettings(formData)).unwrap();
    dispatch(fetchSettings());
  };

  const { countries } = useSelector((state) => state.countries);
  const { states, loading } = useSelector((state) => state.states);
  const CountriesList = countries.map((emnt) => ({
    value: emnt.id,
    label: "(" + emnt.code + ") " + emnt.name,
  }));

  const stateList = states?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));

  useEffect(() => {
    dispatch(fetchSettings());
    dispatch(fetchCountries());
  }, [dispatch]);

  logger.success("Database connection established successfully");
  logger.info("Starting user registration process");
  logger.debug("Processing user registration request");
  logger.warn("User registration request contains invalid email format");
  logger.error(
    "API rate limit exceeded - 100 requests/minute threshold reached"
  );

  useEffect(() => {
    if (watch("country")) {
      dispatch(fetchStates({ country_id: watch("country") }));
    }
  }, [watch("country")]);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        message.error("Please select an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        message.error("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        setLogoFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    document.getElementById("logoInput").value = "";
  };

  const handleSignatureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        message.error("Please select an image file");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        message.error("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSignaturePreview(e.target.result);
        setSignatureFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSignature = () => {
    setSignaturePreview(null);
    setSignatureFile(null);
    document.getElementById("signatureInput").value = "";
  };

  return (
    <div className="page-wrapper">
      <form onSubmit={handleSubmit(onSubmit)} className="container p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="mb-4">
            <h2 className="fw-bold text-dark mb-2">
              <FaBuilding className="me-2 text-primary" />
              Company Settings
            </h2>
            <p className="text-muted mb-0">
              Configure your company information and preferences
            </p>
          </div>
          <button type="submit" className="btn btn-primary">
            <FaSave className="me-2" />
            Save Settings
          </button>
        </div>

        {/* Company Logo Card */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-3">
              <FaBuilding className="me-2 text-primary" />
              Company Logo & Signature
            </h5>

            {/* Logo Section */}
            <div className="mb-4">
              <h6 className="fw-medium mb-3">Company Logo</h6>
              <div className="row align-items-center">
                <div className="col-md-3 col-sm-4 mb-3 mb-md-0">
                  <div
                    className="border rounded p-3 text-center bg-light position-relative"
                    style={{ minHeight: "120px" }}
                  >
                    {logoPreview ? (
                      <div className="position-relative">
                        <img
                          src={logoPreview}
                          alt="Company Logo"
                          className="img-fluid"
                          style={{ maxHeight: "100px", maxWidth: "100%" }}
                        />
                        {logoFile && (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            style={{ transform: "translate(50%, -50%)" }}
                            onClick={removeLogo}
                          >
                            <FaTimes size={12} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="d-flex flex-column align-items-center justify-content-center h-100">
                        <FaUpload className="mb-2 text-muted" size={24} />
                        <small className="text-muted">Upload Logo</small>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-9 col-sm-8">
                  <div className="mb-3">
                    <input
                      id="logoInput"
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </div>
                  <small className="text-muted">
                    Recommended: PNG or JPG format, max 2MB
                  </small>
                </div>
              </div>
            </div>

            <hr />

            {/* Signature Section */}
            <div>
              <h6 className="fw-medium mb-3">Digital Signature</h6>
              <div className="row align-items-center">
                <div className="col-md-3 col-sm-4 mb-3 mb-md-0">
                  <div
                    className="border rounded h-100 flex-column d-flex align-items-center justify-content-center text-center position-relative"
                    style={{ minHeight: "120px", backgroundColor: "#ffffff" }}
                  >
                    {signaturePreview ? (
                      <div className="position-relative p-3">
                        <img
                          src={signaturePreview}
                          alt="Digital Signature"
                          className="img-fluid"
                          style={{
                            maxHeight: "100px",
                            maxWidth: "100%",
                            backgroundColor: "#ffffff",
                          }}
                        />
                        {signatureFile && (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute"
                            style={{
                              transform: "translate(50%, -50%)",
                              right: "15px",
                              top: "3px",
                            }}
                            onClick={removeSignature}
                          >
                            <FaTimes size={12} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="d-flex flex-column align-items-center justify-content-center">
                        <FaEdit className="mb-2 text-muted" size={24} />
                        <small className="text-muted">Upload Signature</small>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-9 col-sm-8">
                  <div className="mb-3">
                    <input
                      id="signatureInput"
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleSignatureChange}
                    />
                  </div>
                  <small className="text-muted">
                    Recommended: PNG format with transparent background, max 1MB
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information Card */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-3">
              <FaBuilding className="me-2 text-primary" />
              Basic Information
            </h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">
                  Company Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaBuilding className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className={`form-control ${errors.companyName ? "is-invalid" : ""}`}
                    placeholder="Enter company name"
                    {...register("companyName", {
                      required: "Company name is required",
                    })}
                  />
                  {errors.companyName && (
                    <div className="invalid-feedback">
                      {errors.companyName.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">
                  Email Address <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaEnvelope className="text-muted" />
                  </span>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="company@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaPhone className="text-muted" />
                  </span>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="+1 (555) 123-4567"
                    {...register("phone")}
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">Website</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaGlobe className="text-muted" />
                  </span>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="www.company.com"
                    {...register("website")}
                  />
                </div>
              </div>
              <div className="col-12 mb-3">
                <label className="form-label fw-medium">
                  Company Description
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Brief description about your company"
                  {...register("description")}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information Card */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-3">
              <FaMapMarkerAlt className="me-2 text-primary" />
              Address Information
            </h5>
            <div className="row">
              <div className="col-12 mb-3">
                <label className="form-label fw-medium">
                  Street Address <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaMapMarkerAlt className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    placeholder="Enter street address"
                    {...register("address", {
                      required: "Address is required",
                    })}
                  />
                  {errors.address && (
                    <div className="invalid-feedback">
                      {errors.address.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-medium">
                  City <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.city ? "is-invalid" : ""}`}
                  placeholder="Enter city"
                  {...register("city", { required: "City is required" })}
                />
                {errors.city && (
                  <div className="invalid-feedback">{errors.city.message}</div>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-medium">
                  State/Province <span className="text-danger">*</span>
                </label>
                <Controller
                  name="state"
                  className="form-control w-100"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={[
                        { value: "", label: "-- Select --" },
                        ...(stateList || []),
                      ]}
                      placeholder={`-- Select --`}
                      classNamePrefix="react-select"
                      isLoading={loading}
                      value={
                        stateList?.find((i) => i.value === watch("state")) || ""
                      }
                      onChange={(i) => field.onChange(i?.value)}
                    />
                  )}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-medium">
                  ZIP/Postal Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.zipCode ? "is-invalid" : ""}`}
                  placeholder="Enter ZIP code"
                  {...register("zipCode", {
                    required: "ZIP code is required",
                  })}
                />
                {errors.zipCode && (
                  <div className="invalid-feedback">
                    {errors.zipCode.message}
                  </div>
                )}
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-medium">
                  Country <span className="text-danger">*</span>
                </label>
                <Controller
                  name="country_code"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={[
                        { value: "", label: "-- Select --" },
                        ...(Array.isArray(CountriesList) ? CountriesList : []),
                      ]}
                      classNamePrefix="react-select"
                      placeholder="-- Select --"
                      isDisabled={!CountriesList.length}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value || null)
                      }
                      value={
                        CountriesList?.find(
                          (option) => option.value === watch("country")
                        ) || ""
                      }
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tax & Legal Information Card */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-3">
              <FaFileInvoiceDollar className="me-2 text-primary" />
              Tax & Legal Information
            </h5>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-medium">
                  Registration Number
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaFileInvoiceDollar className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter GST number"
                    {...register("gstNumber")}
                  />
                </div>
              </div>
              {/* <div className="col-md-4 mb-3">
                <label className="form-label fw-medium">PAN Number</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaIdCard className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter PAN number"
                    {...register("panNumber")}
                  />
                </div>
              </div> */}
              <div className="col-md-4 mb-3">
                <label className="form-label fw-medium">Tax ID</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FaFileInvoiceDollar className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Tax ID"
                    {...register("taxId")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-end gap-2"></div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
