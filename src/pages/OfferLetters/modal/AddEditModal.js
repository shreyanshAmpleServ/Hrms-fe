import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchCandidate } from "../../../redux/Candidate";
import {
  addoffer_letter,
  updateoffer_letter,
} from "../../../redux/offerLetters";

const AddEditModal = ({
  contact,
  mode = "add",
  initialData = null,
  candidate_id,
}) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (!candidate_id) {
      dispatch(fetchCandidate({ search: "" }));
    }
  }, [candidate_id]);

  const { candidate, loading: candidateLoading } = useSelector(
    (state) => state.candidate || {}
  );

  const offerDate = useWatch({ control, name: "offer_date" });

  const CandidateList =
    candidate?.data?.data?.map((item) => ({
      value: item.id,
      label: item.full_name,
    })) || [];

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        status: initialData.status || "P",
        offer_date: initialData.offer_date
          ? new Date(initialData.offer_date).toISOString().split("T")[0]
          : "",
        valid_until: initialData.valid_until
          ? new Date(initialData.valid_until).toISOString().split("T")[0]
          : "",
        offered_salary: initialData.offered_salary || "",
        position: initialData.position || "",
        candidate_id: initialData.candidate_id || candidate_id || "",
      });
    } else {
      reset({
        status: "P",
        offer_date: new Date(),
        valid_until: new Date(),
        offered_salary: "",
        position: "",
        candidate_id: candidate_id || "",
      });

      const modalBody = document.querySelector(".offcanvas-body");
      modalBody?.scrollTo({
        top: modalBody.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');

    const formattedData = {
      ...data,
      posting_date: data.posting_date ? new Date(data.posting_date) : null,
      closing_date: data.closing_date ? new Date(data.closing_date) : null,
      offer_date: data.offer_date ? new Date(data.offer_date) : null,
      valid_until: data.valid_until ? new Date(data.valid_until) : null,
      required_experience:
        data.required_experience !== "" && !isNaN(data.required_experience)
          ? data.required_experience
          : null,
      is_internal: data.is_internal,
    };

    if (mode === "add") {
      dispatch(addoffer_letter(formattedData));
    } else if (mode === "add with candidate") {
      dispatch(addoffer_letter({ ...formattedData, candidate_id }));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateoffer_letter({
          id: initialData.id,
          offer_letterData: formattedData,
        })
      );
    }

    reset();
    closeButton?.click();
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById(
      "add_edit_offer_letter_modal"
    );
    if (offcanvasElement) {
      const handleModalClose = () => {
        // Clean up state if needed
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
  }, []);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="add_edit_offer_letter_modal"
      // aria-labelledby="offcanvasLabel"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">
          {contact ? "Update" : "Add"} Offer Letter
        </h5>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          <i className="ti ti-x" />
        </button>
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)} className="row">
          {!candidate_id && (
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Candidate <span className="text-danger">*</span>
              </label>
              <Controller
                name="candidate_id"
                control={control}
                rules={{ required: "Candidate is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={CandidateList}
                    placeholder="Choose Candidate"
                    classNamePrefix="react-select"
                    className="select2"
                    onChange={(option) => field.onChange(option?.value || "")}
                    value={CandidateList?.find(
                      (option) => option.value === watch("candidate_id")
                    )}
                  />
                )}
              />
              {errors.candidate_id && (
                <small className="text-danger">
                  {errors.candidate_id.message}
                </small>
              )}
            </div>
          )}
          {/* Offer Date */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Offer Date <span className="text-danger">*</span>
            </label>
            <Controller
              name="offer_date"
              control={control}
              rules={{ required: "Offer Date is required" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) =>
                    field.onChange(moment(date).startOf("day").toDate())
                  }
                  maxDate={new Date()}
                  className="form-control"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Offer Date"
                />
              )}
            />
            {errors.offer_date && (
              <small className="text-danger">{errors.offer_date.message}</small>
            )}
          </div>
          {/* Position */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Position <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              placeholder="Position"
              className="form-control"
              {...register("position", { required: "Position is required" })}
            />
            {errors.position && (
              <small className="text-danger">{errors.position.message}</small>
            )}
          </div>
          {/* Offered Salary */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Offered Salary <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              placeholder="Offered Salary"
              className="form-control"
              {...register("offered_salary", {
                required: "Offered Salary is required",
                min: {
                  value: 1,
                  message: "Salary must be greater than zero",
                },
              })}
            />
            {errors.offered_salary && (
              <small className="text-danger">
                {errors.offered_salary.message}
              </small>
            )}
          </div>
          {/* Valid Until */}
          <div className="col-md-6 mb-3">
            <label className="form-label">
              Valid Until <span className="text-danger">*</span>
            </label>
            <Controller
              name="valid_until"
              control={control}
              rules={{
                required: "Valid Until Date is required",
                validate: (value) =>
                  !offerDate ||
                  moment(value).isSameOrAfter(moment(offerDate), "day") ||
                  "Valid Until date must be after or equal to Offer Date",
              }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) =>
                    field.onChange(moment(date).startOf("day").toDate())
                  }
                  minDate={offerDate || null}
                  className="form-control"
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select Valid Until Date"
                />
              )}
            />
            {errors.valid_until && (
              <small className="text-danger">
                {errors.valid_until.message}
              </small>
            )}
          </div>
          {/* Status */}
          {/* <div className="col-md-6 mb-3">
            <label className="form-label">
              Status <span className="text-danger">*</span>
            </label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => {
                const selectedOption = Status.find(
                  (option) => option.value === field.value
                );
                return (
                  <Select
                    {...field}
                    options={Status}
                    value={selectedOption || null}
                    placeholder="Select Status"
                    classNamePrefix="react-select"
                    onChange={(selected) => field.onChange(selected.value)}
                    styles={{
                      menu: (provided) => ({ ...provided, zIndex: 9999 }),
                    }}
                  />
                );
              }}
            />
            {errors.status && (
              <small className="text-danger">{errors.status.message}</small>
            )}
          </div> */}
          <div className="col-md-12 text-end">
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
              disabled={candidateLoading}
            >
              {candidateLoading
                ? mode === "add"
                  ? "Creating..."
                  : "Updating..."
                : mode === "add"
                  ? "Create"
                  : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditModal;
