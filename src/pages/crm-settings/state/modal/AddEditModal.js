import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import { fetchCountries } from "../../../../redux/country";
import { addState, updateState } from "../../../../redux/state";

const AddEditModal = ({
  mode = "add",
  initialData = null,
  setSelectedState,
}) => {
  const { loading } = useSelector((state) => state.states);
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

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
        name: initialData.name || "",
        country_code: initialData.country_code || null,
        is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        name: "",
        country_code: null,
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_add_edit_state_modal"
    );
    if (mode === "add") {
      dispatch(
        addState({
          name: data.name,
          country_code: data.country_code,
          is_active: data.is_active || "Y",
        })
      );
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateState({
          id: initialData.id,
          stateData: {
            name: data.name,
            country_code: data.country_code,
            is_active: data.is_active || "Y",
          },
        })
      );
    }
    reset();
    setSelectedState(null);
    closeButton.click();
  };

  return (
    <div className="modal fade" id="add_edit_state_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add States" : "Edit States"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_add_edit_state_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
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
                      options={[
                        { value: "", label: "-- Select --" },
                        ...(Array.isArray(CountriesList) ? CountriesList : []),
                      ]}
                      classNamePrefix="react-select"
                      placeholder="-- Select --"
                      isDisabled={!CountriesList.length}
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

              {/* Lost Reason Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  State Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Enter State Name"
                  {...register("name", {
                    required: "State name is required.",
                    minLength: {
                      value: 3,
                      message: "State name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>
              {/* Status */}
              <div className="mb-3">
                <label className="col-form-label">Status</label>
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <input
                      type="radio"
                      className="status-radio"
                      id="active"
                      value="Y"
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
