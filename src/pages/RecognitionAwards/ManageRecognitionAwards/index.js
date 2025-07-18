import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import {
  createrecognitionAwards,
  updaterecognitionAwards,
} from "../../../redux/RecognitionAwards";

const ManageRecognitionAwards = ({
  setrecognitionAwards,
  recognitionAwards,
}) => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: "",
      award_title: "",
      description: "",
      award_date: "",
      nominated_by: "",
    },
  });

  useEffect(() => {
    if (recognitionAwards) {
      // Edit mode
      reset({
        employee_id: recognitionAwards.employee_id || "",
        award_title: recognitionAwards.award_title || "",
        description: recognitionAwards.description || "",
        award_date: recognitionAwards.award_date
          ? new Date(recognitionAwards.award_date)
          : new Date(),
        nominated_by: recognitionAwards.nominated_by || "",
      });
    } else {
      // Add mode
      reset({
        employee_id: "",
        award_title: "",
        description: "",
        award_date: new Date(),
        nominated_by: "",
      });
    }
  }, [recognitionAwards, reset]);

  const { loading } = useSelector((state) => state.recognitionAwards || {});

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      if (recognitionAwards) {
        await dispatch(
          updaterecognitionAwards({
            id: recognitionAwards.id,
            recognitionAwardsData: data,
          })
        ).unwrap();
      } else {
        await dispatch(createrecognitionAwards(data)).unwrap();
      }
      closeButton?.click();
      reset();
      setrecognitionAwards(null);
    } catch (error) {
      console.error("Error in submission", error);
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setrecognitionAwards(null);
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
  }, [setrecognitionAwards]);

  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{recognitionAwards ? "Update" : "Add"} Recognition Award</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1"
          data-bs-dismiss="offcanvas"
          onClick={() => {
            setrecognitionAwards();
            reset();
          }}
        />
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {/* Employee */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Employee<span className="text-danger"> *</span>
              </label>
              <Controller
                name="employee_id"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <EmployeeSelect
                    {...field}
                    value={field.value}
                    onChange={(opt) => field.onChange(opt?.value)}
                  />
                )}
              />
              {errors.employee_id && (
                <small className="text-danger">
                  {errors.employee_id.message}
                </small>
              )}
            </div>

            {/* Nominated By */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Nominated By<span className="text-danger"> *</span>
              </label>
              <Controller
                name="nominated_by"
                control={control}
                rules={{ required: "Nominated by is required" }}
                render={({ field }) => (
                  <EmployeeSelect
                    {...field}
                    value={field.value}
                    onChange={(opt) => field.onChange(opt?.value)}
                  />
                )}
              />
              {errors.nominated_by && (
                <small className="text-danger">
                  {errors.nominated_by.message}
                </small>
              )}
            </div>

            {/* Award Title */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Award Title <span className="text-danger"> *</span>
              </label>
              <Controller
                name="award_title"
                control={control}
                rules={{ required: "Award title is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="form-control"
                    placeholder="Enter Award Title"
                  />
                )}
              />
              {errors.award_title && (
                <small className="text-danger">
                  {errors.award_title.message}
                </small>
              )}
            </div>

            {/* Award Title */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Award Date <span className="text-danger"> *</span>
              </label>
              <Controller
                name="award_date"
                control={control}
                rules={{ required: "Award date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Select Award Date"
                    className="form-control"
                    autoComplete="off"
                  />
                )}
              />
              {errors.award_date && (
                <small className="text-danger">
                  {errors.award_date.message}
                </small>
              )}
            </div>

            {/* Award Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">
                Award Date <span className="text-danger"> *</span>
              </label>
              <Controller
                name="award_date"
                control={control}
                rules={{ required: "Sent date is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="form-control"
                    selected={field.value}
                    placeholderText="Select Sent Date"
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd-MM-yyyy"
                  />
                )}
              />

              {errors.award_date && (
                <small className="text-danger">
                  {errors.award_date.message}
                </small>
              )}
            </div>

            {/* Description */}
            <div className="col-12 mb-3">
              <label className="col-form-label">
                Description{" "}
                <span className="text-muted">(max 255 characters)</span>
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
            </div>
            {errors.description && (
              <small className="text-danger">
                {errors.description.message}
              </small>
            )}
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
              {recognitionAwards
                ? loading
                  ? "Updating..."
                  : "Update"
                : loading
                  ? "Creating..."
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

export default ManageRecognitionAwards;
