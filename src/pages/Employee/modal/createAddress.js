import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { fetchStates } from "../../../redux/state";
import Select from "react-select";
import { fetchCountries } from "../../../redux/country";
import { Controller, useForm } from "react-hook-form";

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
  }, [dispatch, manageAddress]);

  const stateApiCall = ()=>{
    country_id && dispatch(fetchStates({ country_id, search: searchState }));

  }
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
  }, [states]);
  console.log("stateOptions", stateOptions);
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
        <div
          key={index}
          className="border rounded position-relative bg-body-secondary p-3 mb-3"
        >
          {manageAddress?.length > 1 && (
            // <button
            //   onClick={() => deleteRow(index)}
            //   type="button"
            //   className="btn btn-danger btn-sm mb-3"
            // >
            //   <i className="ti ti-trash" style={{ fontSize: "15px" }} /> <Close />
            // </button>
            <div
              onClick={() => deleteRow(index)}
              className="position-absolute end-0 top-0 m-2 "
            >
              <IoMdCloseCircleOutline
                style={{ fontSize: "25px" }}
                className=" text-danger"
              />
            </div>
          )}

          <div className="row">
            {[
              "street",
              "street_no",
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
                          placeholder="Choose"
                          classNamePrefix="react-select"
                          isLoading={loadingState}
                           onFocus={() =>stateApiCall()}
                          onInputChange={(value) => {
                            setSearchState(value);
                          }}
                          value={
                            (Array.isArray(stateOptions?.[index])
                              ? stateOptions[index].find(
                                  (option) => option.value == item[fieldKey]
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
                          placeholder="Choose"
                          classNamePrefix="react-select"
                          isLoading={loadingCountry}
                          onInputChange={(value) => {
                            setSearchCountry(value);
                          }}
                          value={
                            countryList?.find(
                              (option) => option.value == item[fieldKey]
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
                ) : (
                  <input
                    className="form-control"
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
