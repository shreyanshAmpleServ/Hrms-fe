import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import {
  createAssetAssignment,
  updateAssetAssignment,
} from "../../../redux/AssetAssignment";
import { fetchassets_type } from "../../../redux/assetType";

const ManageAssetAssignment = ({ setAssetAssignment, assetAssignment }) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.assetAssignment || {});

  React.useEffect(() => {
    reset({
      employee_id: assetAssignment?.asset_assignment_employee?.id || "",
      asset_type_id: assetAssignment?.asset_assignment_type?.id || "",
      asset_name: assetAssignment?.asset_name || "",
      serial_number: assetAssignment?.serial_number || "",
      issued_on: assetAssignment?.issued_on || new Date(),
      returned_on: assetAssignment?.returned_on || "",
      status: assetAssignment?.status || "Pending",
    });
  }, [assetAssignment, reset]);

  React.useEffect(() => {
    dispatch(fetchassets_type({ is_active: true }));
  }, [dispatch]);

  const { assets_type, loading: assetTypeLoading } = useSelector(
    (state) => state.assetTypeMaster
  );

  const assetTypes =
    assets_type?.data?.map((i) => ({
      label: i?.asset_type_name,
      value: i?.id,
    })) || [];

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      assetAssignment
        ? await dispatch(
            updateAssetAssignment({
              id: assetAssignment.id,
              assetAssignmentData: { ...data },
            })
          ).unwrap()
        : await dispatch(createAssetAssignment({ ...data })).unwrap();
      closeButton.click();
      reset();
      setAssetAssignment(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setAssetAssignment(null);
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
  }, [setAssetAssignment]);
  return (
    <>
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{assetAssignment ? "Update " : "Add  "} Asset Assignment</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setAssetAssignment(null);
              reset();
            }}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="offcanvas-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Employee
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="employee_id"
                      control={control}
                      rules={{ required: "Employee is required" }}
                      render={({ field }) => {
                        return (
                          <EmployeeSelect
                            {...field}
                            value={field.value}
                            onChange={(i) => field.onChange(i?.value)}
                          />
                        );
                      }}
                    />
                    {errors.employee_id && (
                      <small className="text-danger">
                        {errors.employee_id.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Asset Type
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="asset_type_id"
                      control={control}
                      rules={{ required: "Asset type is required" }}
                      render={({ field }) => {
                        const selectedDeal = assetTypes?.find(
                          (assetType) => assetType.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={[
                              { value: "", label: "-- Select --" },
                              ...assetTypes,
                            ]}
                            placeholder="-- Select --"
                            classNamePrefix="react-select"
                            isLoading={assetTypeLoading}
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
                    {errors.asset_type_id && (
                      <small className="text-danger">
                        {errors.asset_type_id.message}
                      </small>
                    )}
                  </div>
                </div>
                {/* <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Status
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="status"
                      control={control}
                      rules={{ required: "Status is required" }}
                      render={({ field }) => {
                        const selectedDeal = assetStatusOptions?.find(
                          (assetStatus) => assetStatus.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={assetStatusOptions}
                            placeholder="Select Status"
                            classNamePrefix="react-select"
                            onInputChange={(inputValue) =>
                              setSearchValue(inputValue)
                            }
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
                    {errors.status && (
                      <small className="text-danger">
                        {errors.status.message}
                      </small>
                    )}
                  </div>
                </div> */}
                <div className="col-md-6">
                  <label className="col-form-label">
                    Asset Name<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="asset_name"
                      control={control}
                      rules={{ required: "Asset name is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`form-control ${errors.asset_name ? "is-invalid" : ""}`}
                          placeholder="Enter Asset Name"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.asset_name && (
                      <small className="text-danger">
                        {errors.asset_name.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Serial Number<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="serial_number"
                      control={control}
                      rules={{ required: "Serial number is required!" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={`form-control ${errors.serial_number ? "is-invalid" : ""}`}
                          placeholder="Enter Serial Number"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.serial_number && (
                      <small className="text-danger">
                        {errors.serial_number.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Issued Date<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="issued_on"
                      control={control}
                      rules={{ required: "Issued on is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          placeholderText="Select Issued Date"
                          selected={field.value}
                          value={
                            field.value
                              ? moment(field.value).format("DD-MM-YYYY")
                              : null
                          }
                          onChange={field.onChange}
                          dateFormat="DD-MM-YYYY"
                        />
                      )}
                    />
                  </div>
                  {errors.issued_on && (
                    <small className="text-danger">
                      {errors.issued_on.message}
                    </small>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {assetAssignment
                  ? loading
                    ? "Updating..."
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
    </>
  );
};

export default ManageAssetAssignment;
