import React, { useEffect, useMemo } from "react";
import { useForm, Controller, set } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addLoanMaster, updateLoanMaster } from "../../../redux/LoanMaster";
import { fetchloan_type } from "../../../redux/loneType";
import { fetchCurrencies } from "../../../redux/currency";
import Select from "react-select";

/**
 * ManageLoanMaster
 *
 * @param {'add' | 'edit'} mode - Add or Edit mode
 * @param {object|null} selected - selected loan master object for edit
 * @param {function} setSelected - function to clear selection / close modal
 */
const ManageLoanMaster = ({ mode = "add", selected = null, setSelected }) => {
  const dispatch = useDispatch();

  const defaultValues = {
    loan_code: "",
    loan_name: "",
    loan_type_id: "",
    wage_type: "",
    minimum_tenure: "",
    maximum_tenure: "",
    tenure_divider: 1,
    maximum_amount: "",
    minimum_amount: "",
    amount_currency: "",
    in_active: true,
  };

  const {
    control,
    handleSubmit,
    watch,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  // Pre-fill form when editing
  useEffect(() => {
    if (mode === "edit" && selected) {
      reset({
        loan_code: selected.loan_code || "",
        loan_name: selected.loan_name || "",
        loan_type_id: selected.loan_type_id || "",
        wage_type: selected.wage_type || "",
        minimum_tenure: selected.minimum_tenure || "",
        maximum_tenure: selected.maximum_tenure || "",
        tenure_divider: selected.tenure_divider || 1,
        maximum_amount: selected.maximum_amount || "",
        minimum_amount: selected.minimum_amount || "",
        amount_currency: selected.amount_currency || "",
        in_active: selected.in_active === true ? true : false,
      });
    } else {
      reset(defaultValues);
    }
  }, [mode, selected, reset]);

  useEffect(() => {
    dispatch(fetchloan_type());
    dispatch(fetchCurrencies());
  }, [dispatch]);

  const loan_type = useSelector((state) => state.loan_type?.loan_type);
  const currencies = useSelector((state) => state.currencies?.currencies);
  const { loading } = useSelector((state) => state.loanMaster || {});

  const LoanTypeList = useMemo(
    () =>
      loan_type?.data?.map((item) => ({
        value: item.id,
        label: item.loan_name,
      })) || [],
    [loan_type]
  );

  const CurrencyList = useMemo(
    () =>
      currencies?.data?.map((item) => ({
        value: item.id,
        label: item.currency_name,
      })) || [],
    [currencies]
  );

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      if (mode === "edit" && selected) {
        await dispatch(
          updateLoanMaster({ id: selected.id, loanMasterData: data })
        ).unwrap();
      } else {
        await dispatch(addLoanMaster(data)).unwrap();
      }
      closeButton?.click();
      reset(defaultValues);
      setSelected(null);
    } catch (err) {
      console.error("Submission error", err);
      closeButton?.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById(
      "add_edit_loan_Master_modal"
    );
    if (offcanvasElement) {
      const handleModalClose = () => {
        setSelected(null);
      };
      offcanvasElement.addEventListener(
        "hidden.bs.offcanvas",
        handleModalClose
      );
      return () =>
        offcanvasElement.removeEventListener(
          "hidden.bs.offcanvas",
          handleModalClose
        );
    }
  }, [setSelected]);
  console.log("is_acrive", watch("in_active") === false, watch("in_active"));
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="add_edit_loan_Master_modal"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{mode === "edit" ? "Update" : "Add"} Loan Master</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1"
          data-bs-dismiss="offcanvas"
          onClick={() => {
            setSelected(null);
            reset(defaultValues);
          }}
        />
      </div>

      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className="row"
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {[
              { name: "loan_code", label: "Loan Code" },
              { name: "loan_name", label: "Loan Name" },
              { name: "wage_type", label: "Wage Type" },
              { name: "minimum_tenure", label: "Minimum Tenure" },
              { name: "maximum_tenure", label: "Maximum Tenure" },
              { name: "minimum_amount", label: "Minimum Amount" },
            ].map(({ name, label }) => (
              <div className="col-md-6 mb-3" key={name}>
                <label className="form-label">
                  {label} <span className="text-danger">*</span>
                </label>
                <Controller
                  name={name}
                  control={control}
                  rules={{ required: `${label} is required` }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="form-control"
                      placeholder={`Enter ${label}`}
                    />
                  )}
                />
                {errors[name] && (
                  <small className="text-danger">{errors[name].message}</small>
                )}
              </div>
            ))}

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Loan Type <span className="text-danger">*</span>
              </label>
              <Controller
                name="loan_type_id"
                control={control}
                rules={{ required: "Loan Type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={LoanTypeList}
                    placeholder="Select Loan Type"
                    isDisabled={!LoanTypeList.length}
                    classNamePrefix="react-select"
                    onChange={(option) => field.onChange(option?.value || "")}
                    value={
                      LoanTypeList.find(
                        (option) => option.value === watch("loan_type_id")
                      ) || null
                    }
                  />
                )}
              />
              {errors.loan_type_id && (
                <small className="text-danger">
                  {errors.loan_type_id.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Amount Currency <span className="text-danger">*</span>
              </label>
              <Controller
                name="amount_currency"
                control={control}
                rules={{ required: "Currency is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={CurrencyList}
                    placeholder="Select Currency"
                    isDisabled={!CurrencyList.length}
                    classNamePrefix="react-select"
                    onChange={(option) => field.onChange(option?.value || "")}
                    value={
                      CurrencyList.find(
                        (option) => option.value === watch("amount_currency")
                      ) || null
                    }
                  />
                )}
              />
              {errors.amount_currency && (
                <small className="text-danger">
                  {errors.amount_currency.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Tenure Divider <span className="text-danger">*</span>
              </label>
              <Controller
                name="tenure_divider"
                control={control}
                rules={{
                  required: "Tenure Divider is required",
                  min: { value: 1, message: "Must be at least 1" },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="form-control"
                    placeholder="Enter Tenure Divider"
                  />
                )}
              />
              {errors.tenure_divider && (
                <small className="text-danger">
                  {errors.tenure_divider.message}
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Maximum Amount <span className="text-danger">*</span>
              </label>
              <Controller
                name="maximum_amount"
                control={control}
                rules={{
                  required: "Maximum Amount is required",
                  min: { value: 0, message: "Cannot be negative" },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className="form-control"
                    placeholder="Enter Maximum Amount"
                  />
                )}
              />
              {errors.maximum_amount && (
                <small className="text-danger">
                  {errors.maximum_amount.message}
                </small>
              )}
            </div>

            <div className="mb-0">
              <label className="col-form-label">Status</label>
              <div className="d-flex align-items-center">
                <div className="me-2">
                  <input
                    type="radio"
                    id="active"
                    // value="true"
                    // {...register("in_active", {
                    //   required: "Status is required.",
                    // })}
                    onChange={(e) => setValue("in_active", true)}
                    checked={watch("in_active") === true}
                  />
                  <label htmlFor="active">Active</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="inactive"
                    // value={false}
                    // {...register("in_active")}
                    checked={watch("in_active") === false}
                    onChange={(e) => setValue("in_active", false)}
                  />
                  <label htmlFor="inactive">Inactive</label>
                </div>
              </div>
              {errors.in_active && (
                <small className="text-danger">
                  {errors.in_active.message}
                </small>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-light me-2"
              data-bs-dismiss="offcanvas"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {loading
                ? mode === "edit"
                  ? "Updating..."
                  : "Creating..."
                : mode === "edit"
                  ? "Update"
                  : "Create"}
              {loading && (
                <div className="spinner-border spinner-border-sm ms-2" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageLoanMaster;
