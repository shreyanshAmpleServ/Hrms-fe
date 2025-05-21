import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addbranch, updatebranch } from "../../../../../redux/branch";
import { fetchCompany } from "../../../../../redux/company";
import { Controller, } from "react-hook-form";
import Select from "react-select";
import { useMemo } from "react";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.branch);
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
    dispatch(fetchCompany()); // Changed to fetchCountries
  }, []);
  const company = useSelector((state) => state.company.company);
  const CompanyList = useMemo(() => {
    return (
      company?.data?.map((item) => ({
        value: item.id,
        label: item.company_name,
      })) || []
    );
  }, [company]);






  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        // company_id: initialData.company_id || "",
        branch_name: initialData.branch_name || "",
        location: initialData.location || "",
        is_active: initialData.is_active || "Y",
      });
    } else {
      reset({
        // company_id: "",
        branch_name: "",
        location: "",
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_branch _modal");
    if (mode === "add") {
      dispatch(addbranch(data));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updatebranch({
          id: initialData.id,
          branchData: data,
        })
      );
    }
    reset();
    closeButton?.click();
  };
  return (
    <div className="modal fade" id="add_edit_branch_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Branch" : "Edit Branch "}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_branch _modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Industry Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Branch Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("branch_name", {
                    required: "Industry name is required.",
                    minLength: {
                      value: 3,
                      message: "Industry name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>
              <div className="row">
                {/* Company Dropdown */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Company ID    <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="company_id"
                      control={control}
                      rules={{ required: "company_id" }} // Validation rule
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={CompanyList}
                          placeholder="Choose"
                          isDisabled={!CompanyList.length} // Disable if no stages are available
                          classNamePrefix="react-select"
                          className="select2"
                          onChange={(selectedOption) =>
                            field.onChange(selectedOption?.value || null)
                          } // Send only value
                          value={CompanyList?.find(
                            (option) =>
                              option.value === watch("company_id"),
                          ) || ""}
                        />
                      )}
                    />
                    {errors.company_id && (
                      <small className="text-danger">
                        {errors.company_id.message}
                      </small>
                    )}
                  </div>
                </div>

                {/* Branch Name Input */}
                {/* <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Company ID <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.branch_name ? "is-invalid" : ""}`}
                    {...register("company_id", {
                      required: "Branch name is required.",
                      minLength: {
                        value: 3,
                        message: "Branch name must be at least 3 characters.",
                      },
                    })}
                  />
                  {errors.branch_name && (
                    <small className="text-danger">{errors.branch_name.message}</small>
                  )}
                </div> */}

                {/* Branch Location Input */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Location <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.location ? "is-invalid" : ""}`}
                    {...register("location", {
                      required: "Location is required.",
                    })}
                  />
                  {errors.location && (
                    <small className="text-danger">{errors.location.message}</small>
                  )}
                </div>
              </div>

              {/* Status */}

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
