import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { updateCompany } from "../../../../../redux/company";

const EditCompanyModal = ({ company }) => {
  const [selectedLogo, setSelectedLogo] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.company);

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_name: company?.company_name || "",
      company_code: company?.company_code || "",
      contact_email: company?.contact_email || "",
      contact_phone: company?.contact_phone || "",
      currency_code: company?.currency_code || "",
      address: company?.address || "",
      contact_person: company?.contact_person || "",
      country_id: company?.country_id || null,
      financial_year_start: company?.financial_year_start || "",
      timezone: company?.timezone || "",

    },
  });

  useEffect(() => {
    reset({ ...company });
    setSelectedLogo(company?.logo);
  }, [company, reset]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLogo(file);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append all form fields
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(
          key,
          typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key],
        );
      }
    });

    if (selectedLogo) {
      formData.append("logo", selectedLogo);
    }
    // Log the FormData contents for debugging
    // console.log("FormData contents:");
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    const closeButton = document.getElementById("close_company_edit_btn");
    try {
      await dispatch(
        updateCompany({ id: company.id, companyData: data }),
      ).unwrap();
      closeButton.click();
      reset();
      setSelectedLogo(null);
    } catch (error) {
      closeButton.click();
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_edit_company"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">Edit Company</h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          id="close_company_edit_btn"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="hidden"
            {...register("company_name", { value: "company" })}
          />
          <div className="accordion" id="company_accordion">
            {/* Basic Info */}
            <div className="accordion-item rounded mb-3">
              <div className="accordion-header">



                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12">

                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Company Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("company_name", {
                            required: "Company name is required",
                          })}
                        />
                        {errors.name && (
                          <small className="text-danger">
                            {errors.name.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Company Code                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("company_code")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Contact Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          {...register("contact_email", {
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
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Contact Phone <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("contact_phone", {
                            required: "Phone number is required",
                          })}
                        />
                        {errors.phone && (
                          <small className="text-danger">
                            {errors.phone.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Currency Code</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("currency_code")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Contact Person <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("contact_person", {
                            required: "Industry type is required",
                          })}
                        />
                        {errors.industryType && (
                          <small className="text-danger">
                            {errors.industryType.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Country Id</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          {...register("country_id")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">FinancialYear Start</label>
                        <input
                          type="number"
                          className="form-control"
                          {...register("financial_year_start")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Timezone <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("timezone", {
                            required: "Business type is required",
                          })}
                        />
                        {errors.businessType && (
                          <small className="text-danger">
                            {errors.businessType.message}
                          </small>
                        )}
                      </div>
                    </div>
                    {/* Contact Fields */}

                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="col-form-label">Address</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          {...register("address")}
                        ></textarea>
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
              {loading ? "Updating..." : "Update"}
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

export default EditCompanyModal;
