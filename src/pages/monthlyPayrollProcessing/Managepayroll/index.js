import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import DefaultEditor from "react-simple-wysiwyg";
import { fetchEmployee } from "../../../redux/Employee";
import { createmonthlyPayroll, updatemonthlyPayroll } from "../../../redux/monthlyPayrollProcessing";
import { fetchgrievance_type } from "../../../redux/grievanceTypeMaster"

const ManagemonthlyPayroll = ({ setmonthlyPayroll, monthlyPayroll }) => {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee_id: "",
      grievance_type: "",
      description: "",
      anonymous: false,
      submitted_on: new Date().toISOString(),
      status: "Pending",
      assigned_to: "",
      resolution_notes: "",
      resolved_on: "",
    },
  });

  const { loading } = useSelector((state) => state.monthlyPayroll || {}); // ✅ Use correct slice

  useEffect(() => {
    if (monthlyPayroll) {
      reset({
        employee_id: monthlyPayroll.employee_id || "",
        grievance_type: monthlyPayroll.grievance_type || "",
        description: monthlyPayroll.description || "",
        anonymous: monthlyPayroll.anonymous || false,
        submitted_on: monthlyPayroll.submitted_on || new Date().toISOString(),
        status: monthlyPayroll.status || "Pending",
        assigned_to: monthlyPayroll.assigned_to || "",
        resolution_notes: monthlyPayroll.resolution_notes || "",
        resolved_on: monthlyPayroll.resolved_on || "",
      });
    } else {
      reset({
        employee_id: "",
        grievance_type: "",
        description: "",
        anonymous: false,
        submitted_on: new Date().toISOString(),
        status: "Pending",
        assigned_to: "",
        resolution_notes: "",
        resolved_on: "",
      });
    }
  }, [monthlyPayroll, reset]);

  useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
    dispatch(fetchgrievance_type());
  }, [dispatch, searchValue]);

  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {}
  );

  const { grievance_type } = useSelector(
    (state) => state.grievanceType || {}
  );

  const employees = employee?.data?.map((i) => ({
    label: i?.full_name,
    value: i?.id,
  }));

  const grievanceTypeOptions = grievance_type?.data?.map((i) => ({
    label: i?.grievance_type_name,
    value: i?.id,
  }));

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      if (monthlyPayroll) {
        await dispatch(
          updatemonthlyPayroll({
            id: monthlyPayroll.id,
            monthlyPayrollData: { ...data },
          })
        ).unwrap();
      } else {
        await dispatch(createmonthlyPayroll({ ...data })).unwrap();
      }
      closeButton?.click();
      reset();
      setmonthlyPayroll(null);
    } catch (error) {
      closeButton?.click();
      console.error("Submission error:", error);
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setmonthlyPayroll(null);
      };
      offcanvasElement.addEventListener("hidden.bs.offcanvas", handleModalClose);
      return () => {
        offcanvasElement.removeEventListener("hidden.bs.offcanvas", handleModalClose);
      };
    }
  }, [setmonthlyPayroll]);


  return (
    <>
      {/* Add New appointment */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{monthlyPayroll ? "Update " : "Add New "} Grievance Submission</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setmonthlyPayroll(null);
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
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Employee<span className="text-danger">*</span></label>
                  <Controller
                    name="employee_id"
                    control={control}
                    rules={{ required: "Employee is required" }}
                    render={({ field }) => {
                      const selectedEmployee = employees?.find(emp => emp.value === field.value);
                      return (
                        <Select
                          {...field}
                          className="select"
                          options={employees}
                          placeholder="Select Employee"
                          isLoading={employeeLoading}
                          classNamePrefix="react-select"
                          value={selectedEmployee || null}
                          onInputChange={setSearchValue}
                          onChange={(opt) => field.onChange(opt?.value)}
                          styles={{ menu: provided => ({ ...provided, zIndex: 9999 }) }}
                        />
                      );
                    }}
                  />
                  {errors.employee_id && <small className="text-danger">{errors.employee_id.message}</small>}
                </div>





                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Status</label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={[
                          { value: "Pending", label: "Pending" },
                          { value: "Resolved", label: "Resolved" },
                          { value: "Closed", label: "Closed" },
                        ]}
                        placeholder="Select Status"
                        classNamePrefix="react-select"
                        value={
                          field.value ? { label: field.value, value: field.value } : null
                        }
                        onChange={(opt) => field.onChange(opt.value)}
                      />
                    )}
                  />
                </div>

                {/* Grievance Type */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">
                    Grievance Type <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="grievance_type"
                    control={control}
                    rules={{ required: "Grievance type is required" }}
                    render={({ field }) => {
                      const selectedGrievance = grievanceTypeOptions?.find(gt => gt.value === field.value);
                      return (
                        <Select
                          {...field}
                          className="select"
                          options={grievanceTypeOptions}
                          placeholder="Select Grievance Type"
                          classNamePrefix="react-select"
                          value={selectedGrievance || null}
                          onChange={(opt) => field.onChange(opt?.value)}
                          styles={{ menu: provided => ({ ...provided, zIndex: 9999 }) }}
                        />
                      );
                    }}
                  />
                  {errors.grievance_type && (
                    <small className="text-danger">{errors.grievance_type.message}</small>
                  )}
                </div>


                {/* Resolved On */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Resolved On</label>
                  <Controller
                    name="resolved_on"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        selected={field.value ? new Date(field.value) : null}
                        onChange={field.onChange}
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                      />
                    )}
                  />
                </div>




                {/* Submitted On */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Submitted On</label>
                  <Controller
                    name="submitted_on"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        selected={field.value ? new Date(field.value) : null}
                        onChange={field.onChange}
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                      />
                    )}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Assigned To</label>
                  <Controller
                    name="assigned_to"
                    control={control}
                    render={({ field }) => {
                      const selectedUser = employees?.find(emp => emp.value === field.value);
                      return (
                        <Select
                          {...field}
                          options={employees}
                          placeholder="Select Assignee"
                          value={selectedUser || null}
                          onInputChange={setSearchValue}
                          onChange={(opt) => field.onChange(opt?.value)}
                          classNamePrefix="react-select"
                          styles={{ menu: provided => ({ ...provided, zIndex: 9999 }) }}
                        />
                      );
                    }}
                  />
                </div>


                {/* Anonymous */}
                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Anonymous?</label>
                  <Controller
                    name="anonymous"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                </div>



                {/* Resolution Notes */}
                <div className="col-12 mb-3">
                  <label className="col-form-label">Resolution Notes</label>
                  <Controller
                    name="resolution_notes"
                    control={control}
                    render={({ field }) => (
                      <DefaultEditor
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e)}
                      />
                    )}
                  />
                </div>

                {/* Description */}
                <div className="col-12 mb-3">
                  <label className="col-form-label">Description</label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <DefaultEditor
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e)}
                      />
                    )}
                  />
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
                {monthlyPayroll
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

export default ManagemonthlyPayroll;
