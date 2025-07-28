import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { message } from "antd";
import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaMapMarkerAlt,
  FaFileInvoiceDollar,
  FaIdCard,
  FaSave,
  FaUpload,
  FaTimes,
  FaEdit,
} from "react-icons/fa";

const Settings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyName: "Ampleserv Technologies",
      email: "info@ampleserv.com",
      phone: "+1 (555) 123-4567",
      website: "https://www.ampleserv.comm",
      address: "G-37, Sector 3, Noida",
      city: "Noida",
      state: "Uttar Pradesh",
      zipCode: "201301",
      country: "India",
      gstNumber: "GST123456789",
      panNumber: "ABCDE1234F",
      taxId: "TAX987654321",
      description: "Leading technology solutions provider",
    },
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);

  const onSubmit = (data) => {
    console.log("Form submitted:", { ...data, logo: logoFile });
    message.success("Company settings saved successfully!");
  };

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
      <div className="container p-4">
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

        <form onSubmit={handleSubmit(onSubmit)}>
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
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            style={{ transform: "translate(50%, -50%)" }}
                            onClick={removeLogo}
                          >
                            <FaTimes size={12} />
                          </button>
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
                      Recommended: PNG format with transparent background, max
                      1MB
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
                    <div className="invalid-feedback">
                      {errors.city.message}
                    </div>
                  )}
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-medium">
                    State/Province <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.state ? "is-invalid" : ""}`}
                    placeholder="Enter state"
                    {...register("state", { required: "State is required" })}
                  />
                  {errors.state && (
                    <div className="invalid-feedback">
                      {errors.state.message}
                    </div>
                  )}
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
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-medium">
                    Country <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.country ? "is-invalid" : ""}`}
                    placeholder="Enter country"
                    {...register("country", {
                      required: "Country is required",
                    })}
                  />
                  {errors.country && (
                    <div className="invalid-feedback">
                      {errors.country.message}
                    </div>
                  )}
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
                  <label className="form-label fw-medium">GST Number</label>
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
                <div className="col-md-4 mb-3">
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
                </div>
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
    </div>
  );
};

export default Settings;
