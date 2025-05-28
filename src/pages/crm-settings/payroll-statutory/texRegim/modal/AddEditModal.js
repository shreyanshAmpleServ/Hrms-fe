import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import {
  addtax_Regime,
  updatetax_Regime,
} from "../../../../../redux/taxRegime";
import { Controller } from "react-hook-form";
import { fetchCountries } from "../../../../../redux/country";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.taxRegime);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm();

  React.useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);
  const { countries } = useSelector((state) => state.countries);

  const CountriesList = countries.map((emnt) => ({
    value: emnt.id,
    label: "(" + emnt.code + ") " + emnt.name,
  }));

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        regime_name: initialData.regime_name || "",
        country_code: initialData.country_code || "",
      });
    } else {
      reset({
        regime_name: "",
        country_code: "",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_tax_Regime_modal");
    const finalData = {
      ...data,
      country_code: String(data?.country_code),
    };
    if (mode === "add") {
      dispatch(addtax_Regime(finalData));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updatetax_Regime({
          id: initialData.id,
          tax_RegimeData: finalData,
        })
      );
    }
    reset();
    setSelected(null);
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_tax_Regime_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Tax Regime" : "Edit Tax Regime"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_tax_Regime_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                <div className="mb-3">
                  <label className="col-form-label">
                    Regime Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Enter Regime Name"
                    {...register("regime_name", {
                      required: "Regime name is required.",
                      minLength: {
                        value: 3,
                        message: "Regime name must be at least 3 characters.",
                      },
                    })}
                  />
                  {errors.regime_name && (
                    <small className="text-danger">
                      {errors.regime_name.message}
                    </small>
                  )}
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Country <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="country_code"
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
                            (option) => option.value === watch("country_code")
                          ) || ""
                        }
                      />
                    )}
                  />
                  {errors.country_code && (
                    <small className="text-danger">
                      {errors.country_code.message}
                    </small>
                  )}
                </div>
              </div>
              {/* Status */}
              {/* <div className="mb-0">
                <label className="col-form-label">Status</label>
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <input
                      type="radio"
                      className="status-radio"
                      id="active"
                      value="Y"
                      {...register("is_active", {
                        required: "Status is required.",
                      })}
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
                {errors.is_active && (
                  <small className="text-danger">{errors.is_active.message}</small>
                )}
              </div> */}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <div className="d-flex align-items-center justify-content-end m-0">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary"
                >
                  {loading
                    ? mode === "add"
                      ? "Creating..."
                      : "Updating..."
                    : mode === "add"
                      ? "Create"
                      : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditModal;
