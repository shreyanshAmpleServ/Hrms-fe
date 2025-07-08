import React from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchCountries } from "../../../redux/country";
import { fetchStates } from "../../../redux/state";

const ManageAddress = ({
  manageAddress,
  addNewColumn,
  setManageAddress,
  stateOptions,
  setStateOptions,
}) => {
  const dispatch = useDispatch();
  const [searchState, setSearchState] = React.useState("");
  const [searchCountry, setSearchCountry] = React.useState("");
  const [countryIndex, setCountryIndex] = React.useState(0);
  const [country_id, setCountryId] = React.useState(null);

  const { control } = useForm();

  React.useEffect(() => {
    country_id && dispatch(fetchStates({ country_id, search: searchState }));
  }, [dispatch, manageAddress, country_id, searchState]);

  const stateApiCall = () => {
    country_id && dispatch(fetchStates({ country_id, search: searchState }));
  };
  React.useEffect(() => {
    searchCountry && dispatch(fetchCountries({ search: searchCountry }));
  }, [dispatch, searchCountry]);

  const { countries, loading: loadingCountry } = useSelector(
    (state) => state.countries
  );
  const { states, loading: loadingState } = useSelector(
    (state) => state.states
  );
  const countryList = countries.map((emnt) => ({
    value: emnt.id,
    label: emnt.code + " " + emnt.name,
  }));
  const stateList = states?.data?.map((emnt) => ({
    value: emnt.id,
    label: emnt.name,
  }));
  const updateItem = (index, field, value) => {
    setManageAddress((prev) => {
      const updatedItems = prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return updatedItems;
    });
  };
  const addressTypeOptions = [
    { value: "Work", label: "Work" },
    { value: "Home", label: "Home" },
  ];

  const deleteRow = (index) => {
    setManageAddress((prev) => prev.filter((_, i) => i !== index));
    setStateOptions((prev) => prev.filter((_, i) => i !== index));
  };
  React.useEffect(() => {
    stateList &&
      setStateOptions((prev) => {
        const newOptions = [...prev];
        newOptions[countryIndex] = stateList;
        return newOptions;
      });
  }, [states, countryIndex, setStateOptions, stateList]);
  return (
    <div className="col-md-12 mt-3 address-section">
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <label className="col-form-label fw-bold">Address List</label>
        <div
          className="label-add text-danger"
          onClick={addNewColumn}
          style={{ cursor: "pointer" }}
        >
          <i className="ti ti-square-rounded-plus me-1" />
          Add New
        </div>
      </div>

      {manageAddress?.map((item, index) => (
        <div key={index} className="border rounded position-relative p-3 mb-3">
          {manageAddress?.length > 1 && (
            <div
              onClick={() => deleteRow(index)}
              className="position-absolute end-0 top-0 m-2"
            >
              <IoMdCloseCircleOutline
                style={{ fontSize: "25px" }}
                className=" text-danger"
              />
            </div>
          )}

          <div className="row">
            {[
              "Address Type",
              "street",
              "building",
              "floor",
              "city",
              "district",
              "country",
              "state",
              "zip_code",
            ].map((fieldKey) => (
              <div key={fieldKey} className="col-md-4 mb-2">
                <label className="form-label text-capitalize">
                  {fieldKey.replace("_", " ")}
                </label>
                {fieldKey === "state" ? (
                  <div className="icon-form-end">
                    <Controller
                      name="state"
                      className="form-control w-100"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={stateOptions[index]}
                          placeholder={`Choose State`}
                          classNamePrefix="react-select"
                          isLoading={loadingState}
                          onFocus={() => stateApiCall()}
                          onInputChange={(value) => {
                            setSearchState(value);
                          }}
                          value={
                            (Array.isArray(stateOptions?.[index])
                              ? stateOptions[index].find(
                                  (option) => option.value === item[fieldKey]
                                ) || ""
                              : "") || ""
                          }
                          onChange={(selectedOption) => {
                            updateItem(
                              index,
                              fieldKey,
                              selectedOption?.value || null
                            );
                          }}
                        />
                      )}
                    />
                  </div>
                ) : fieldKey === "country" ? (
                  <div className="icon-form-end">
                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={countryList}
                          placeholder={`Choose Country`}
                          classNamePrefix="react-select"
                          isLoading={loadingCountry}
                          onInputChange={(value) => {
                            setSearchCountry(value);
                          }}
                          value={
                            countryList?.find(
                              (option) => option.value === item[fieldKey]
                            ) || ""
                          }
                          onChange={(selectedOption) => {
                            setCountryId(selectedOption?.value);
                            updateItem(
                              index,
                              fieldKey,
                              selectedOption?.value || null
                            );
                            setCountryIndex(index);
                          }}
                        />
                      )}
                    />
                  </div>
                ) : fieldKey === "Address Type" ? (
                  <div className="icon-form-end">
                    <Controller
                      name={`address_type_${index}`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={addressTypeOptions}
                          placeholder={`Select Address Type`}
                          classNamePrefix="react-select"
                          value={
                            addressTypeOptions.find(
                              (option) => option.value === item["Address Type"]
                            ) || ""
                          }
                          onChange={(selectedOption) => {
                            updateItem(
                              index,
                              "Address Type",
                              selectedOption?.value || null
                            );
                          }}
                        />
                      )}
                    />
                  </div>
                ) : (
                  <input
                    className="form-control"
                    placeholder={`Enter ${fieldKey
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}`}
                    value={item[fieldKey]}
                    onChange={(e) =>
                      updateItem(index, fieldKey, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageAddress;
