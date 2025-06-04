import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchEmployee } from "../../../redux/Employee";
import { fetchAppraisalEntries } from "../../../redux/AppraisalsEntries";
import { fetchgoal_category } from "../../../redux/goalCategoryMaster";
import { creategoalSheet, updategoalSheet } from "../../../redux/GoalSheetAssignment";

const ManagegoalSheet = ({ setgoalSheet, goalSheet }) => {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { employee } = useSelector((state) => state.employee || {});
  const { appraisalEntries } = useSelector((state) => state.appraisalEntries || []);
  console.log("appraisalEntries:", appraisalEntries);

  const { goalCategoryMaster } = useSelector((state) => state.goalCategoryMaster || {});
  const { loading } = useSelector((state) => state.goalSheet || {});

  const employees = employee?.data?.map((i) => ({
    label: i?.full_name,
    value: i?.id,
  }));

  const appraisalEntriesList = Array.isArray(appraisalEntries)
    ? appraisalEntries.map((i) => ({
      label: i?.review_period,
      value: i?.id,
    }))
    : [];

  const goalCategoryOptions = goalCategoryMaster?.map((i) => ({
    label: i?.category_name,
    value: i?.id,
  }));

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
    dispatch(fetchAppraisalEntries());
    dispatch(fetchgoal_category());
  }, [dispatch, searchValue]);

  useEffect(() => {
    reset({
      employee_id: goalSheet?.employee_id || "",
      appraisal_cycle_id: goalSheet?.appraisal_cycle_id || "",
      goal_category_id: goalSheet?.goal_category_id || "",
      goal_description: goalSheet?.goal_description || "",
      weightage: goalSheet?.weightage || "",
      target_value: goalSheet?.target_value || "",
      measurement_criteria: goalSheet?.measurement_criteria || "",
      due_date: goalSheet?.due_date ? new Date(goalSheet.due_date) : new Date(),
      status: goalSheet?.status || "",
    });
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

  return (
    <div className="offcanvas offcanvas-end offcanvas-large" tabIndex={-1} id="offcanvas_add">
      <div className="offcanvas-header border-bottom">
        <h4>{goalSheet ? "Update" : "Add New"} Goal Sheet</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1 rounded-circle"
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
              <label className="form-label">Employee <span className="text-danger">*</span></label>
              <Controller
                name="employee_id"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={employees}
                    placeholder="Select Employee"
                    onInputChange={(val) => setSearchValue(val)}
                    value={employees?.find((e) => e.value === field.value) || null}
                    onChange={(opt) => field.onChange(opt.value)}
                  />
                )}
              />
              {errors.employee_id && <small className="text-danger">{errors.employee_id.message}</small>}
            </div>

            {/* Appraisal Cycle */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Appraisal Cycle <span className="text-danger">*</span></label>
              <Controller
                name="appraisal_id"
                control={control}
                rules={{ required: "Appraisal cycle is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={appraisalEntriesList}
                    placeholder="Select Cycle"
                    value={appraisalEntriesList.find((opt) => opt.value === field.value) || null}
                    onChange={(opt) => field.onChange(opt.value)}
                  />
                )}
              />
              {errors.appraisal_id && <small className="text-danger">{errors.appraisal_id.message}</small>}
            </div>

            {/* Goal Category */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Goal Category</label>
              <Controller
                name="goal_category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={goalCategoryOptions}
                    placeholder="Select Category"
                    // value={goalCategoryOptions.find((opt) => opt.value === field.value) || null}
                    onChange={(opt) => field.onChange(opt?.value)}
                    isClearable
                  />
                )}
              />
            </div>

            {/* Goal Description */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Goal Description <span className="text-danger">*</span></label>
              <Controller
                name="goal_description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <input {...field} className="form-control" placeholder="Enter Description" />
                )}
              />
              {errors.goal_description && <small className="text-danger">{errors.goal_description.message}</small>}
            </div>

            {/* Weightage */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Weightage (%) <span className="text-danger">*</span></label>
              <Controller
                name="weightage"
                control={control}
                rules={{ required: "Weightage is required" }}
                render={({ field }) => (
                  <input type="number" {...field} className="form-control" placeholder="Enter weightage" />
                )}
              />
              {errors.weightage && <small className="text-danger">{errors.weightage.message}</small>}
            </div>

            {/* Target Value */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Target Value</label>
              <Controller
                name="target_value"
                control={control}
                render={({ field }) => (
                  <input {...field} className="form-control" placeholder="Enter target value" />
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
                  <input {...field} className="form-control" placeholder="Enter measurement criteria" />
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
            <div className="col-md-6 mb-3">
              <label className="form-label">Status <span className="text-danger">*</span></label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={statusOptions}
                    placeholder="Select Status"
                    value={statusOptions.find((opt) => opt.value === field.value) || null}
                    onChange={(opt) => field.onChange(opt.value)}
                  />
                )}
              />
              {errors.status && <small className="text-danger">{errors.status.message}</small>}
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-light me-2" data-bs-dismiss="offcanvas">Cancel</button>
            <button type="submit" className="btn btn-primary">
              {goalSheet ? (loading ? "Updating..." : "Update") : (loading ? "Creating..." : "Create")}
              {loading && <span className="spinner-border spinner-border-sm ms-2" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagegoalSheet;
