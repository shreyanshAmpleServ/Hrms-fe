import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import {
  createAppraisalEntries,
  updateAppraisalEntries,
} from "../../../redux/AppraisalsEntries";
import { getAllRequests } from "../../../redux/Request";

const ManageAppraisalEntries = ({ setSelected, selected }) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: "",
      review_period: "",
      rating: "",
      status: "P",
      reviewer_comments: "",
    },
  });

  const { loading } = useSelector((state) => state.appraisalEntries || {});

  React.useEffect(() => {
    if (selected) {
      reset({
        employee_id: selected.employee_id || "",
        review_period: selected.review_period || "",
        rating: selected.rating || "",
        status: selected.status || "P",
        reviewer_comments: selected.reviewer_comments || "",
      });
    } else {
      reset({
        employee_id: "",
        review_period: "",
        rating: "",
        status: "P",
        reviewer_comments: "",
      });
    }
  }, [selected, reset]);

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      selected
        ? await dispatch(
            updateAppraisalEntries({
              id: selected.id,
              appraisalEntriesData: { ...data, rating: Number(data.rating) },
            })
          ).unwrap()
        : await dispatch(
            createAppraisalEntries({
              ...data,
              rating: Number(data.rating),
            })
          ).unwrap();
      dispatch(getAllRequests());
      closeButton.click();
      reset();
      setSelected(null);
    } catch (error) {
      closeButton.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setSelected(null);
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
  }, [setSelected]);
  return (
    <>
      {/* Add New appointment */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{selected ? "Update " : "Add  "} Appraisal Entries</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setSelected(null);
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
                      <span className="text-danger"> *</span>
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
                      Review Period
                      <span className="text-danger"> *</span>
                    </label>
                    <Controller
                      name="review_period"
                      control={control}
                      rules={{ required: "Review period is required" }}
                      render={({ field }) => {
                        return (
                          <input
                            {...field}
                            className="form-control"
                            placeholder="Enter Review Period"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        );
                      }}
                    />
                    {errors.review_period && (
                      <small className="text-danger">
                        {errors.review_period.message}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="col-form-label">
                    Rating<span className="text-danger"> *</span>
                  </label>
                  <div className="mb-3">
                    <Controller
                      name="rating"
                      control={control}
                      rules={{
                        required: "Rating is required!",
                        min: {
                          value: 1,
                          message: "Rating must be at least 1",
                        },
                        max: {
                          value: 5,
                          message: "Rating cannot exceed 5",
                        },
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min={1}
                          max={5}
                          className="form-control"
                          placeholder="Enter Rating (1-5)"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  {errors.rating && (
                    <small className="text-danger">
                      {errors.rating.message}
                    </small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="col-form-label">
                    Reviewer Comments{" "}
                    <small className="text-muted">(Max 255 characters)</small>{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="reviewer_comments"
                    control={control}
                    rules={{
                      required: "Reviewer Comments is required!",
                      maxLength: {
                        value: 255,
                        message:
                          "Reviewer Comments must be less than or equal to 255 characters",
                      },
                    }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        maxLength={255}
                        className="form-control"
                        placeholder="Enter Reviewer Comments "
                      />
                    )}
                  />
                  {errors.reviewer_comments && (
                    <small className="text-danger">
                      {errors.reviewer_comments.message}
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
                {selected
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

export default ManageAppraisalEntries;
