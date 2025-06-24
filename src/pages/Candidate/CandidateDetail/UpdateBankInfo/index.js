import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateEmployee } from "../../../../redux/Employee";
import { fetchbank } from "../../../../redux/bank";
import Select from "react-select";
const UpdateBankInfo = ({ employeeDetail }) => {
  const { loading } = useSelector((state) => state.employee);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchbank());
  }, [dispatch]);

  const { bank } = useSelector((state) => state.bank);

  const bankOptions = bank?.data?.map((bank) => ({
    label: bank.bank_name,
    value: bank.id,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      account_holder_name: "",
      account_number: "",
      bank_id: "",
      ifsc: "",
    },
  });

  useEffect(() => {
    if (employeeDetail) {
      reset({
        account_holder_name: employeeDetail.account_holder_name || "",
        account_number: employeeDetail.account_number || "",
        bank_id: employeeDetail.bank_id || "",
        ifsc: employeeDetail.ifsc || "",
      });
    } else {
      reset({
        account_holder_name: "",
        account_number: "",
        bank_id: "",
        ifsc: "",
      });
    }
  }, [employeeDetail, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_update_bank_info_modal",
    );
    const formData = new FormData();
    if (employeeDetail) {
      formData.append("id", employeeDetail.id);
      formData.append("account_holder_name", data.account_holder_name);
      formData.append("account_number", data.account_number);
      formData.append("ifsc", data.ifsc);
      dispatch(updateEmployee(formData));
    }
    reset();
    closeButton.click();
  };

  return (
    <div className="modal fade" id="update_bank_info_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Bank Info</h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_update_bank_info_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row mb-2">
                <div className="col-md-6">
                  {/* Employee Name */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      Account Holder Name{" "}
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.account_holder_name ? "is-invalid" : ""}`}
                      placeholder="Enter Account Holder Name"
                      {...register("account_holder_name", {
                        required: "Account holder name is required.",
                        minLength: {
                          value: 3,
                          message:
                            "Account holder name must be at least 3 characters.",
                        },
                      })}
                    />
                    {errors.account_holder_name && (
                      <small className="text-danger">
                        {errors.account_holder_name.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  {/* Email */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      Account Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.account_number ? "is-invalid" : ""}`}
                      placeholder="Enter Account Number"
                      {...register("account_number", {
                        required: "Account number is required.",
                      })}
                    />
                    {errors.account_number && (
                      <small className="text-danger">
                        {errors.account_number.message}
                      </small>
                    )}
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Bank Name
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="bank_id"
                      control={control}
                      rules={{ required: "Bank name is required" }}
                      render={({ field }) => {
                        const selectedDeal = bankOptions?.find(
                          (bank) => bank.value === field.value,
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={bankOptions}
                            classNamePrefix="react-select"
                            value={selectedDeal || null}
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
                    {errors.bank_id && (
                      <small className="text-danger">
                        {errors.bank_id.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  {/* Email */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      IFSC <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.ifsc ? "is-invalid" : ""}`}
                      placeholder="Enter IFSC"
                      {...register("ifsc", {
                        required: "IFSC is required.",
                      })}
                    />
                    {errors.ifsc && (
                      <small className="text-danger">
                        {errors.ifsc.message}
                      </small>
                    )}
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
                  //onClick={onClose}
                >
                  Cancel
                </Link>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary"
                >
                  {loading
                    ? employeeDetail
                      ? "Updating..."
                      : "Creating..."
                    : employeeDetail
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBankInfo;
