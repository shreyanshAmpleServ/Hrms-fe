import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import { createHRLetter, updateHRLetter } from "../../../../../redux/HRLetters";
import { fetchCompany } from "../../../../../redux/company";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const [searchValue, setSearchValue] = useState("");
  const { loading } = useSelector((state) => state.hrLetters);
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
    dispatch(fetchCompany({ search: searchValue }));
  }, [searchValue, dispatch]);

  const company = useSelector((state) => state.company.company);

  const CompanyList =
    company?.data?.map((item) => ({
      value: item.id,
      label: item.company_name,
    })) || [];

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        hr_letter_name: initialData.hr_letter_name || "",
        location: initialData.location || "",
        company_id: initialData.company_id || "",
        is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        hr_letter_name: "",
        location: "",
        company_id: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_hr_letter_modal");
    if (mode === "add") {
      dispatch(createHRLetter(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateHRLetter({
          id: initialData.id,
          hrLetterData: data,
        })
      );
    }
    reset();
    closeButton?.click();
  };
  return (
    <div className="modal fade" id="add_edit_hr_letter_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add  HR Letter" : "Edit HR Letter "}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_hr_letter_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="mb-3 col-md-12">
                <label className="col-form-label">
                  HR Letter Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter HR Letter Name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("hr_letter_name", {
                    required: "HR Letter name is required.",
                    minLength: {
                      value: 3,
                      message: "HR Letter name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.hr_letter_name && (
                  <small className="text-danger">
                    {errors.hr_letter_name.message}
                  </small>
                )}
              </div>

              <div className="col-md-12">
                <div className="mb-3">
                  <label className="col-form-label">
                    Company Name
                    <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="company_id"
                    control={control}
                    rules={{ required: "Company Name is required" }}
                    render={({ field }) => {
                      const selectedCompany = CompanyList?.find(
                        (option) => option.value === field.value
                      );
                      return (
                        <Select
                          {...field}
                          className="select"
                          options={CompanyList}
                          classNamePrefix="react-select"
                          placeholder="Choose Company Name"
                          onInputChange={(inputValue) =>
                            setSearchValue(inputValue)
                          }
                          value={selectedCompany || null}
                          onChange={(selectedOption) =>
                            field.onChange(selectedOption.value)
                          }
                          styles={{
                            menu: (provided) => ({
                              ...provided,
                              zIndex: 9999,
                            }),
                          }}
                        />
                      );
                    }}
                  />
                  {errors.company_id && (
                    <small className="text-danger">
                      {errors.company_id.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <label className="col-form-label">
                  Location <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Location"
                  className={`form-control ${errors.location ? "is-invalid" : ""}`}
                  {...register("location", {
                    required: "Location is required.",
                  })}
                />
                {errors.location && (
                  <small className="text-danger">
                    {errors.location.message}
                  </small>
                )}
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
