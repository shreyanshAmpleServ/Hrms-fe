import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../../../redux/contacts/contactSlice";
import { addTaxSetup, updateTaxSetup } from "../../../../redux/taxSetUp";
import { addCostCenter, updateCostCenter } from "../../../../redux/costCenter";

const ManageTaxModal = ({ tax, setTax }) => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const { loading } = useSelector((state) => state.taxs);

  // React Hook Form setup
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      dimension_id: null,
      is_active: "Y",
      valid_from: new Date(),
      valid_to: new Date(),
      external_code: "",
    },
  });
  React.useEffect(() => {
    if (tax) {
      reset({
        name: tax?.name || "",
        dimension_id: tax?.dimension_id || null,
        is_active: tax?.is_active || "Y",
        valid_from: new Date(tax?.valid_from) || new Date(),
        valid_to: new Date(tax?.valid_to) || new Date(),
        external_code: tax?.external_code || "",
      });
    } else {
      reset({
        name: "",
        dimension_id: "",
        is_active: "Y",
        valid_from: new Date(),
        valid_to: new Date(),
        external_code: "",
      });
    }
  }, [tax]);

  const onSubmit = async (data) => {
    const closeButton = document.getElementById("close_tax_setup");

    const formData = {
      ...data,
      valid_from: new Date(data.valid_from).toISOString(),
      valid_to: data.valid_to ? new Date(data.valid_to).toISOString() : null,
    };

    try {
      tax
        ? await dispatch(updateCostCenter({ id: tax?.id, data: formData }))
        : await dispatch(addCostCenter(formData)).unwrap();
      closeButton.click();
      reset();
    } catch (error) {
      closeButton.click();
    }
  };
  React.useEffect(() => {
    const offcanvasElement = document.getElementById(
      "offcanvas_add_edit_tax_setup"
    );
    if (offcanvasElement) {
      const handleModalClose = () => {
        setTax();
      };
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose
      );
      return () => {
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleModalClose
        );
      };
    }
  }, []);
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add_edit_tax_setup"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {tax ? "Update " : "Add New"} Cost Center
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          id="close_tax_setup"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <input type="hidden" {...register("entityType", { value: "user" })} />
          <input type="hidden" {...register("username", { value: watch('email') })} /> */}
          <div className="row">
            {/* Full Name */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  className="form-control"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>
            </div>
            {/* Email */}
            <div className="col-md-6">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="col-form-label">
                    external_code <span className="text-danger">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Enter External Code"
                  className="form-control"
                  {...register("external_code", {
                    required: "External code is required",
                  })}
                />
                {errors.external_code && (
                  <small className="text-danger">
                    {errors.external_code.message}
                  </small>
                )}
              </div>
            </div>
            {/* rate */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">Dimension</label>
                <input
                  type="text"
                  placeholder="Enter Dimension"
                  className="form-control"
                  {...register("dimension_id")}
                />
                {errors.dimension_id && (
                  <small className="text-danger">
                    {errors.dimension_id.message}
                  </small>
                )}
              </div>
            </div>
            {/* external_code */}
            {/* <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">External Code</label>
                <input
                  type="text"
                  className="form-control"
                  {...register("external_code")}
                />
              </div>
            </div> */}
            {/*Valid From */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Valid From<span className="text-danger">*</span>
                </label>
                <DatePicker
                  className="form-control"
                  selected={watch("valid_from")}
                  onChange={(date) => setValue("valid_from", date)}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>{" "}
            {/* Valid To */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Valid To <span className="text-danger">*</span>
                </label>
                <DatePicker
                  className="form-control"
                  selected={watch("valid_to")}
                  onChange={(date) => setValue("valid_to", date)}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
            {/* Status */}
            <div className="col-md-6">
              <div className="mb-3 mt-1">
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
                  <small className="text-danger">
                    {errors.is_active.message}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex mt-3 align-items-center justify-content-end">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {tax
                ? loading
                  ? "Updating ...."
                  : "Update"
                : loading
                  ? "Creating..."
                  : "Create"}
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

export default ManageTaxModal;
