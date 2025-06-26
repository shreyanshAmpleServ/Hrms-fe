import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchCandidate } from "../../../redux/Candidate";
import {
  createContract,
  updateContract,
} from "../../../redux/EmployementContracts";
const ManageContracts = ({ setContract, contract, candidate_id }) => {
  const [searchValue, setSearchValue] = useState("");
  const [documentPath, setDocumentPath] = useState(null);
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      candidate_id: candidate_id || "",
      contract_start_date: new Date().toISOString(),
      contract_end_date: new Date().toISOString(),
      contract_type: "",
      document_path: "",
      description: "",
    },
  });

  const { loading } = useSelector((state) => state.contracts || {});

  React.useEffect(() => {
    if (contract) {
      reset({
        candidate_id: contract.candidate_id || candidate_id || "",
        contract_start_date:
          contract.contract_start_date || new Date().toISOString(),
        contract_end_date:
          contract.contract_end_date || new Date().toISOString(),
        contract_type: contract.contract_type || "",
        document_path: "",
        description: contract.description || "",
      });
    } else {
      reset({
        candidate_id: candidate_id || "",
        contract_start_date: new Date().toISOString(),
        contract_end_date: new Date().toISOString(),
        contract_type: "",
        document_path: "",
        description: "",
      });
    }
  }, [contract, reset]);

  React.useEffect(() => {
    if (!candidate_id) {
      dispatch(fetchCandidate({ searchValue }));
    }
  }, [searchValue, candidate_id]);

  const { candidate, loading: candidateLoading } = useSelector(
    (state) => state.candidate || {}
  );

  const candidates = candidate?.data?.data?.map((i) => ({
    label: i?.full_name,
    value: i?.id,
  }));

  const contractTypes = [
    { label: "Full Time", value: "full_time" },
    { label: "Part Time", value: "part_time" },
    { label: "Temporary", value: "temporary" },
    { label: "Seasonal", value: "seasonal" },
    { label: "Intern", value: "intern" },
    { label: "Volunteer", value: "volunteer" },
    { label: "Other", value: "other" },
  ];

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      contract
        ? await dispatch(
            updateContract({
              id: contract.id,
              contractData: { ...data, document_path: documentPath },
            })
          ).unwrap()
        : await dispatch(
            createContract({ ...data, document_path: documentPath })
          ).unwrap();
      closeButton.click();
      reset();
      setContract(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setContract(null);
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
  }, [setContract]);
  return (
    <>
      {/* Add New appointment */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{contract ? "Update " : "Add"} Employment Contracts</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setContract(null);
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
                {!candidate_id && (
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Candidate
                        <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="candidate_id"
                        control={control}
                        rules={{ required: "Candidate is required" }}
                        render={({ field }) => {
                          const selectedDeal = candidates?.find(
                            (candidate) => candidate.value === field.value
                          );
                          return (
                            <Select
                              {...field}
                              className="select"
                              options={candidates}
                              classNamePrefix="react-select"
                              placeholder="Select Candidate"
                              isLoading={candidateLoading}
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
                      {errors.candidate_id && (
                        <small className="text-danger">
                          {errors.candidate_id.message}
                        </small>
                      )}
                    </div>
                  </div>
                )}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Contract Type
                      <span className="text-danger">*</span>
                    </label>
                    <Controller
                      name="contract_type"
                      control={control}
                      rules={{ required: "Contract type is required" }}
                      render={({ field }) => {
                        const selectedDeal = contractTypes?.find(
                          (employee) => employee.value === field.value
                        );
                        return (
                          <Select
                            {...field}
                            className="select"
                            options={contractTypes}
                            classNamePrefix="react-select"
                            placeholder="Select Contract Type"
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
                    {errors.contract_type && (
                      <small className="text-danger">
                        {errors.contract_type.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Contract Start Date<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="contract_start_date"
                      control={control}
                      rules={{ required: "Contract start date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
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
                  {errors.contract_start_date && (
                    <small className="text-danger">
                      {errors.contract_start_date.message}
                    </small>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="col-form-label">
                    Contract End Date<span className="text-danger">*</span>
                  </label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="contract_end_date"
                      control={control}
                      rules={{ required: "Contract end date is required!" }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
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
                  {errors.contract_end_date && (
                    <small className="text-danger">
                      {errors.contract_end_date.message}
                    </small>
                  )}
                </div>

                <div className="col-md-12 mb-3">
                  <label className="col-form-label">
                    Attachment<span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="document_path"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setDocumentPath(file);
                      }
                    }}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <label className="col-form-label">
                    Description{" "}
                    <small className="text-muted">(Max 255 characters)</small>
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{
                      maxLength: {
                        value: 255,
                        message:
                          "Description must be less than or equal to 255 characters",
                      },
                    }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        maxLength={255}
                        className="form-control"
                        placeholder="Enter Description "
                      />
                    )}
                  />
                  {/* {errors.description && (
                    <small className="text-danger">
                      {errors.description.message}
                    </small>
                  )} */}
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
                {contract
                  ? loading
                    ? " Updating..."
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

export default ManageContracts;
