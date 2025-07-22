import moment from "moment";
import React from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addTaxSlab, updateTaxSlab } from "../../../../redux/taxSlab";

const ManageTaxModal = ({ tax, setTax }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.taxs);

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
      pay_component_id: 1,
      rule_type: "",
      slab_min: 0,
      slab_max: 0,
      rate: 0,
      flat_amount: 0,
      formula_text: "",
      effective_from: new Date(),
      effective_to: new Date(),
      is_active: "Y",
    },
  });
  React.useEffect(() => {
    if (tax) {
      reset({
        pay_component_id: tax?.pay_component_id || 1,
        rule_type: tax?.rule_type || "",
        slab_min: tax?.slab_min || 0,
        slab_max: tax?.slab_max || 0,
        rate: tax?.rate || 0,
        flat_amount: tax?.flat_amount || 0,
        formula_text: tax?.formula_text || "",
        effective_from: tax?.effective_from || new Date().toISOString(),
        effective_to: tax?.effective_to || new Date().toISOString(),
        is_active: tax?.is_active || "Y",
      });
    } else {
      reset({
        pay_component_id: 1,
        rule_type: "",
        slab_min: 0,
        slab_max: 0,
        rate: 0,
        flat_amount: 0,
        formula_text: "",
        effective_from: new Date().toISOString(),
        effective_to: new Date().toISOString(),
        is_active: "Y",
      });
    }
  }, [tax]);
  const onSubmit = async (data) => {
    if (data.effective_from > data.effective_to) {
      toast.error("Effective From must be before or equal to Effective To");
      return;
    }
    const closeButton = document.getElementById("close_tax_setup");
    const formData = {
      ...data,
      effective_from: new Date(data.effective_from).toISOString(),
      effective_to: data.effective_to
        ? new Date(data.effective_to).toISOString()
        : null,
    };

    try {
      tax
        ? await dispatch(updateTaxSlab({ id: tax?.id, data: formData }))
        : await dispatch(addTaxSlab(formData)).unwrap();
      closeButton.click();
      reset();
    } catch (error) {
      closeButton.click();
    }
  };
  React.useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
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
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">{tax ? "Update " : "Add New"} Tax Slab</h5>
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
          <div className="row">
            {/* Full Name */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Rule Type <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Rule Type"
                  {...register("rule_type", {
                    required: "Name is required",
                  })}
                />
                {errors.rule_type && (
                  <small className="text-danger">
                    {errors.rule_type.message}
                  </small>
                )}
              </div>
            </div>
            {/* rate */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Rate <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Rate"
                  {...register("rate", {
                    required: "rate is required",
                  })}
                />
                {errors.rate && (
                  <small className="text-danger">{errors.rate.message}</small>
                )}
              </div>
            </div>
            {/* Slab min */}
            <div className="col-md-6">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="col-form-label">
                    Slab Min <span className="text-danger">*</span>
                  </label>
                </div>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Slab Min"
                  {...register("slab_min", {
                    required: "Slab min is required",
                  })}
                />
                {errors.slab_min && (
                  <small className="text-danger">
                    {errors.slab_min.message}
                  </small>
                )}
              </div>
            </div>
            {/* Slab max */}
            <div className="col-md-6">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="col-form-label">
                    Slab Max <span className="text-danger">*</span>
                  </label>
                </div>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Slab Max"
                  {...register("slab_max", {
                    required: "Slab max is required",
                  })}
                />
                {errors.slab_max && (
                  <small className="text-danger">
                    {errors.slab_max.message}
                  </small>
                )}
              </div>
            </div>
            {/* flat_amount */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Flat Amount <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Flat Amount"
                  {...register("flat_amount", {
                    required: "Flat amount is required",
                  })}
                />
                {errors.flat_amount && (
                  <small className="text-danger">
                    {errors.flat_amount.message}
                  </small>
                )}
              </div>
            </div>
            {/*Effective from */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Effective From <span className="text-danger">*</span>
                </label>
                <DatePicker
                  className="form-control"
                  placeholder="Enter Effective From"
                  selected={watch("effective_from")}
                  onChange={(date) =>
                    setValue("effective_from", date.toISOString())
                  }
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </div>
            {/*Effective To */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="col-form-label">
                  Effective To<span className="text-danger">*</span>
                </label>
                <Controller
                  control={control}
                  name="effective_to"
                  render={({ field }) => (
                    <DatePicker
                      className="form-control"
                      placeholder="Enter Effective To"
                      value={
                        field.value
                          ? moment(field.value).format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={(date) => field.onChange(date)}
                      minDate={watch("effective_to")}
                    />
                  )}
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
            {/* formula_text */}
            <div className="col-md-12">
              <div className="mb-0">
                <label className="col-form-label">
                  Formula Text <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Enter Formula Text"
                  {...register("formula_text", {
                    required: "Formula text is required",
                  })}
                />
                {errors.formula_text && (
                  <small className="text-danger">
                    {errors.formula_text.message}
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
