import React, { useEffect, useMemo } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { updateCompany } from "../../../../../redux/company";
import { fetchCountries } from "../../../../../redux/country";
import { fetchCurrencies } from "../../../../../redux/currency";
const EditCompanyModal = ({ company }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.company);

  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_name: company?.company_name || "",
      company_code: company?.company_code || "",
      contact_email: company?.contact_email || "",
      contact_phone: company?.contact_phone || "",
      currency_code: Number(company?.currency_code) || "",
      contact_person: company?.contact_person || "",
      country_id: company?.country_id || null,
      financial_year_start: company?.financial_year_start || "",
      timezone: company?.timezone || "",
      address: company?.address || "",
    },
  });

  useEffect(() => {
    reset({ ...company });
  }, [company, reset]);

  React.useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);
  const { countries } = useSelector((state) => state.countries);

  const CountriesList = countries.map((emnt) => ({
    value: emnt.id,
    label: "(" + emnt.code + ") " + emnt.name,
  }));

  React.useEffect(() => {
    dispatch(fetchCurrencies());
  }, [dispatch]);
  const { currencies } = useSelector((state) => state.currencies);

  const CurrenciesList = useMemo(() => {
    return (
      currencies?.data?.map((item) => ({
        value: item.id,
        label: `${item.currency_code} ( ${item.currency_name} )`,
      })) || []
    );
  }, [currencies]);

  const onSubmit = async (data) => {
    const closeButton = document.getElementById("close_company_edit_btn");
    try {
      await dispatch(
        updateCompany({ id: company.id, companyData: data }),
      ).unwrap();
      closeButton.click();
      reset();
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
          <div className="accordion" id="company_accordion">
            <div className="accordion-item rounded mb-3">
              <div className="accordion-header">
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12"></div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Company Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Company Name"
                          {...register("company_name", {
                            required: "Company Name is required",
                          })}
                        />
                        {errors.company_name && (
                          <small className="text-danger">
                            {errors.company_name.message}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Company Code </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Company Code"
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
                            required: "Contact Email is required",
                          })}
                        />
                        {errors.contact_email && (
                          <small className="text-danger">
                            {errors.contact_email.message}
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
                        {errors.contact_phone && (
                          <small className="text-danger">
                            {errors.contact_phone.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Country <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="country_id"
                          control={control}
                          rules={{ required: "Country is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={CountriesList}
                              placeholder="Choose Country"
                              isDisabled={!CountriesList.length}
                              classNamePrefix="react-select"
                              className="select2"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              }
                              value={
                                CountriesList?.find(
                                  (option) =>
                                    option.value === watch("country_id"),
                                ) || ""
                              }
                            />
                          )}
                        />
                        {errors.country_id && (
                          <small className="text-danger">
                            {errors.country_id.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Currency Code <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="currency_code"
                          control={control}
                          rules={{ required: "Currency is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={CurrenciesList}
                              placeholder="Choose Currency"
                              isDisabled={!CurrenciesList.length}
                              classNamePrefix="react-select"
                              className="select2"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              }
                              value={
                                CurrenciesList.find(
                                  (option) =>
                                    option.value === watch("currency_code"),
                                ) || ""
                              }
                            />
                          )}
                        />
                        {errors.currency_code && (
                          <small className="text-danger">
                            {errors.currency_code.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Contact Person</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Contact Person"
                          {...register("contact_person")}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="col-form-label">
                        Financial Year Start{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="financial_year_start"
                        control={control}
                        rules={{
                          required: "Financial Year Start is required.",
                        }}
                        render={({ field }) => (
                          <DatePicker
                            placeholderText="Select Financial Year Start Date"
                            className={`form-control ${errors.financial_year_start ? "is-invalid" : ""}`}
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat="dd-MM-yyyy"
                          />
                        )}
                      />
                      {errors.financial_year_start && (
                        <small className="text-danger">
                          {errors.financial_year_start.message}
                        </small>
                      )}
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Timezone</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("timezone")}
                        />
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="col-form-label">Address</label>
                        <textarea
                          placeholder="Enter Address"
                          className="form-control"
                          rows="3"
                          {...register("address", {
                            required: "Address is required",
                          })}
                        ></textarea>
                        {errors.address && (
                          <small className="text-danger">
                            {errors.address.message}
                          </small>
                        )}
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
