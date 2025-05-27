import React, { useMemo } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { addCompany } from "../../../../../redux/company";
import { fetchCountries } from "../../../../../redux/country";
import { fetchCurrencies } from "../../../../../redux/currency";

const AddCompanyModal = () => {
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

  const currencies = useSelector((state) => state.currencies.currencies);

  const CurrenciesList = useMemo(() => {
    return (
      currencies?.data?.map((item) => ({
        value: item.id,
        label: `${item.currency_code} ( ${item.currency_name} )`,
      })) || []
    );
  }, [currencies]);

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      await dispatch(
        addCompany({ ...data, currency_code: String(data?.currency_code) })
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
            <div className="accordion-item rounded mb-3">
              <div className="accordion-header"></div>
              <div
                className="accordion-collapse collapse show"
                id="company_basic"
                data-bs-parent="#company_accordion"
              >
                <div className="accordion-body border-top">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="mb-3"></div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Company Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Company Name"
                          className="form-control"
                          {...register("company_name", {
                            required: "Company name is required",
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
                        <label className="col-form-label">Company Code</label>
                        <input
                          type="text"
                          placeholder="Enter Company Code"
                          className="form-control"
                          {...register("company_code")}
                        />
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
                              placeholder="Choose Country "
                              isDisabled={!CountriesList.length}
                              classNamePrefix="react-select"
                              className="select2"
                              onChange={(selectedOption) =>
                                field.onChange(selectedOption?.value || null)
                              }
                              value={
                                CountriesList?.find(
                                  (option) =>
                                    option.value === watch("country_id")
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
                          rules={{ required: "Currency Code is required" }}
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
                                    option.value === watch("currency_code")
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
                          placeholder="Enter Contact Person"
                          className="form-control"
                          {...register("contact_person")}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Contact Phone</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Enter Contact Phone"
                          className="form-control"
                          {...register("contact_phone")}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="col-form-label">Contact Email</label>
                        <input
                          type="email"
                          placeholder="Enter Contact Email"
                          className="form-control"
                          {...register("contact_email")}
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
                          required: "Financial Year Start Date is required.",
                        }}
                        render={({ field }) => (
                          <DatePicker
                            placeholderText="Select Financial Year Start Date"
                            className={`form-control ${errors.financial_year_start ? "is-invalid" : ""}`}
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat="dd-mm-yyyy"
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
                          placeholder="Enter Timezone"
                          className="form-control"
                          {...register("timezone")}
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Address <span className="text-danger">*</span>
                        </label>
                        <textarea
                          placeholder="Enter Address"
                          className="form-control"
                          {...register("address", {
                            required: "Address is required",
                          })}
                        />
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
