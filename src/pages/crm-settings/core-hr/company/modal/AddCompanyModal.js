
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller, } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { addCompany } from "../../../../../redux/company";
import { fetchCountries } from "../../../../../redux/country";
import { fetchCurrencies } from "../../../../../redux/currency";
import { useMemo } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";


const AddCompanyModal = () => {
  const [selectedLogo, setSelectedLogo] = useState(null);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.company);

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company_name: "",
      company_code: "",
      currency_code: null,
      address: "",
      country_id: null,
      contact_person: "",
      contact_phone: "",
      contact_email: "",
      financial_year_start: null,
      timezone: "",
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedLogo(file);
    }
  };
  React.useEffect(() => {
    dispatch(fetchCountries()); // Changed to fetchCountries
  }, [dispatch]);
  const { countries } = useSelector(
    (state) => state.countries // Changed to 'countries'
  );

  const CountriesList = countries.map((emnt) => ({
    value: emnt.id,
    label: "(" + emnt.code + ") " + emnt.name,
  }));

  ////////////////////CURRENCIES/////////////////////////////////////////

  React.useEffect(() => {
    dispatch(fetchCurrencies()); // Changed to fetchCountries
  }, [dispatch]);
  const currencies = useSelector((state) => state.currencies.currencies);


  const CurrenciesList = useMemo(() => {
    return currencies?.data?.map((item) => ({
      value: item.id,
      label: `${item.currency_code} ( ${item.currency_name} )`,
    })) || [];
  }, [currencies]);




  const onSubmit = async (data) => {
    // const formData = new FormData();

    // // Append all form fields
    // Object.keys(data).forEach((key) => {
    //   if (data[key] !== null && data[key] !== undefined) {
    //     // Convert complex data to strings if needed
    //     formData.append(
    //       key,
    //       typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key],
    //     );
    //   }
    // });

    // if (selectedLogo) {
    //   formData.append("logo", selectedLogo);
    // }

    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      await dispatch(addCompany({ ...data, currency_code: String(data?.currency_code) })).unwrap();
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
      id="offcanvas_add_company"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">Add New Company</h5>
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
          <input
            type="hidden"
            {...register("company_name", { value: "company_name" })}
          />
          <div className="accordion" id="company_name">
            {/* Basic Info */}
            <div className="accordion-item rounded mb-3">
              <div className="accordion-header">

              </div>
              <div
                className="accordion-collapse collapse show"
                id="company_basic"
                data-bs-parent="#company_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3">

                      </div>
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
                          Company Code
                        </label>
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
                          Country  <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="country_id"
                          control={control}
                          rules={{ required: "country_id" }} // Validation rule
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={CountriesList}
                              placeholder="Choose"
                              isDisabled={!CountriesList.length} // Disable if no stages are available
                              classNamePrefix="react-select"
                              className="select2"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              } // Send only value
                              value={CountriesList?.find(
                                (option) =>
                                  option.value === watch("country_id"),
                              ) || ""}
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
                    {/* Currency */}
                    {/* Currency */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Currency Code <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="currency_code"
                          control={control}
                          rules={{ required: "currency is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              options={CurrenciesList}
                              placeholder="Choose"
                              isDisabled={!CurrenciesList.length}
                              classNamePrefix="react-select"
                              className="select2"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              }
                              value={
                                CurrenciesList.find(
                                  (option) => option.value === watch("currency_code")
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
                        <label className="col-form-label">
                          Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("address", {
                            required: "address is required",
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
                        <label className="col-form-label"> Contact Person</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("contact_person")}
                        />
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Country <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("country", {
                            required: "country type is required",
                          })}
                        />
                        {errors.industryType && (
                          <small className="text-danger">
                            {errors.industryType.message}
                          </small>
                        )}
                      </div>
                    </div> */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Contact Phone</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          {...register("contact_phone")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Contact Email</label>
                        <input

                          className="form-control"
                          {...register("contact_email")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="col-form-label">
                        Financial Year Start <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="financial_year_start"
                        control={control}
                        rules={{ required: "financial_year_start date is required." }}
                        render={({ field }) => (
                          <DatePicker
                            placeholderText="Select date"
                            className={`form-control ${errors.financial_year_start ? "is-invalid" : ""}`}
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat="dd-mm-yyyy"
                          />
                        )}
                      />
                      {errors.launch_date && (
                        <small className="text-danger">{errors.financial_year_start.message}</small>
                      )}
                    </div>

                    {/* Contact Fields */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Timezone{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("timezone", {
                            required: "Primary contact name is required",
                          })}
                        />
                        {errors.primaryContactName && (
                          <small className="text-danger">
                            {errors.primaryContactName.message}
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
              {loading ? "Creating..." : "Create"}
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

export default AddCompanyModal;
