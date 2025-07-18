import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import EmployeeSelect from "../../../components/common/EmployeeSelect";
import { fetchAppraisalEntries } from "../../../redux/AppraisalsEntries";
import { fetchgoal_category } from "../../../redux/goalCategoryMaster";
import {
  creategoalSheet,
  updategoalSheet,
} from "../../../redux/GoalSheetAssignment";

const ManagegoalSheet = ({ setgoalSheet, goalSheet }) => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { appraisalEntries, loading: appraisalLoading } = useSelector(
    (state) => state.appraisalEntries || {}
  );

  const { goal_category } = useSelector(
    (state) => state.goalCategoryMaster || {}
  );

  const { loading } = useSelector((state) => state.goalSheet || {});

  const appraisalEntriesList =
    (appraisalEntries?.data || []).map((i) => ({
      label: i?.review_period,
      value: i?.id,
    })) || [];

  const goalCategoryMasterList =
    (goal_category?.data || []).map((i) => ({
      label: i?.category_name,
      value: i?.id,
    })) || [];

  useEffect(() => {
    dispatch(fetchAppraisalEntries({ is_active: true }));
    dispatch(fetchgoal_category({ is_active: true }));
  }, [dispatch]);

  useEffect(() => {
    if (goalSheet) {
      // Edit mode
      reset({
        employee_id: goalSheet.employee_id || "",
        appraisal_cycle_id: goalSheet.appraisal_cycle_id || "",
        goal_category_id: goalSheet.goal_category_id || "",
        goal_description: goalSheet.goal_description || "",
        weightage: goalSheet.weightage || "",
        target_value: goalSheet.target_value || "",
        measurement_criteria: goalSheet.measurement_criteria || "",
        due_date: goalSheet.due_date
          ? new Date(goalSheet.due_date)
          : new Date(),
        status: goalSheet.status || "panding",
      });
    } else {
      reset({
        employee_id: "",
        appraisal_cycle_id: "",
        goal_category_id: "",
        goal_description: "",
        weightage: "",
        target_value: "",
        measurement_criteria: "",
        due_date: new Date(),
        status: "Panding",
      });
    }
  }, [goalSheet, reset]);

  const onSubmit = async (data) => {
    const closeBtn = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      goalSheet
        ? await dispatch(updategoalSheet({ id: goalSheet.id, data })).unwrap()
        : await dispatch(creategoalSheet(data)).unwrap();
      closeBtn.click();
      reset();
      setgoalSheet(null);
    } catch (err) {
      closeBtn.click();
    }
  };
  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setgoalSheet(null);
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
  }, [setgoalSheet]);
  return (
    <div
      className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="offcanvas_add"
    >
      <div className="offcanvas-header border-bottom">
        <h4>{goalSheet ? "Update" : "Add "} Goal Sheet</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => {
            setgoalSheet(null);
            reset();
          }}
        >
          <i className="ti ti-x" />
        </button>
      </div>

      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {/* Employee */}
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Employee <span className="text-danger">*</span>
              </label>
              <Controller
                name="employee_id"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <EmployeeSelect
                    {...field}
                    value={field.value}
                    onChange={(i) => field.onChange(i?.value)}
                  />
                )}
              />
              {errors.employee_id && (
                <small className="text-danger">
                  {errors.employee_id.message}
                </small>
              )}
            </div>

            {/* Appraisal Cycle */}
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Appraisal Cycle <span className="text-danger">*</span>
              </label>
              <Controller
                name="appraisal_cycle_id" // ✅ unique name
                control={control}
                rules={{ required: "Appraisal cycle is required" }}
                render={({ field }) => {
                  const selected = appraisalEntriesList.find(
                    (opt) => opt.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      options={[
                        { value: "", label: "-- Select --" },
                        ...appraisalEntriesList,
                      ]}
                      placeholder="-- Select --"
                      isLoading={appraisalLoading}
                      value={selected || null}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                    />
                  );
                }}
              />
              {errors.appraisal_cycle_id && (
                <small className="text-danger">
                  {errors.appraisal_cycle_id.message}
                </small>
              )}
            </div>

            {/* Goal Category */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Goal Category</label>
              <Controller
                name="goal_category_id" // ✅ unique name
                control={control}
                render={({ field }) => {
                  const selected = goalCategoryMasterList.find(
                    (opt) => opt.value === field.value
                  );
                  return (
                    <Select
                      {...field}
                      options={[
                        { value: "", label: "-- Select --" },
                        ...goalCategoryMasterList,
                      ]}
                      placeholder="-- Select --"
                      value={selected || null}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                      isClearable
                    />
                  );
                }}
              />
            </div>

            {/* Weightage */}
            <div className="col-md-6 mb-3">
              <label className="form-label">
                Weightage (%) <span className="text-danger">*</span>
              </label>
              <Controller
                name="weightage"
                control={control}
                rules={{ required: "Weightage is required" }}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    className="form-control"
                    placeholder="Enter Weightage"
                  />
                )}
              />
              {errors.weightage && (
                <small className="text-danger">
                  {errors.weightage.message}
                </small>
              )}
            </div>

            {/* Target Value */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Target Value</label>
              <Controller
                name="target_value"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    className="form-control"
                    placeholder="Enter Target Value"
                  />
                )}
              />
            </div>

            {/* Measurement Criteria */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Measurement Criteria</label>
              <Controller
                name="measurement_criteria"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    {...field}
                    className="form-control"
                    placeholder="Enter Measurement Criteria"
                  />
                )}
              />
            </div>

            {/* Due Date */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Due Date</label>
              <Controller
                name="due_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="form-control"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd-MM-yyyy"
                  />
                )}
              />
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
                render={({ field }) => (
                  <Select
                    {...field}
                    options={statusOptions}
                    placeholder="Select Status"
                    value={
                      statusOptions.find((opt) => opt.value === field.value) ||
                      null
                    }
                    onChange={(opt) => field.onChange(opt.value)}
                  />
                )}
              />
              {errors.status && (
                <small className="text-danger">{errors.status.message}</small>
              )}
            </div> */}
            {/* Goal Description */}
            <div className="col-md-12 mb-3">
              <label className="form-label">
                Goal Description{" "}
                <small className="text-muted">(Max 255 characters)</small>
              </label>
              <Controller
                name="resolution_notes"
                control={control}
                rules={{
                  required: "Description is required!",
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
                    placeholder="Enter Resolution Notes"
                  />
                )}
              />
              {/* {errors.goal_description && (
                <small className="text-danger">
                  {errors.goal_description.message}
                </small>
              )} */}
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
              {goalSheet
                ? loading
                  ? "Updating..."
                  : "Update"
                : loading
                  ? "Creating..."
                  : "Create"}
              {loading && (
                <span className="spinner-border spinner-border-sm ms-2" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagegoalSheet;
