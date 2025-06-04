import moment from "moment";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import DefaultEditor from "react-simple-wysiwyg";
import { fetchEmployee } from "../../../redux/Employee";
import { createdisciplinryAction, updatedisciplinryAction } from "../../../redux/disciplinaryActionLog";
import { fetchdisciplinary_penalty } from "../../../redux/disciplinaryPenalty"

const ManagedisciplinryAction = ({ setdisciplinryAction, disciplinryAction }) => {
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
      incident_date: new Date().toISOString(),
      incident_description: "",
      action_taken: "",
      committee_notes: "",
      penalty_type: "",
      effective_from: new Date().toISOString(),
      status: "Pending",
    },
  });

  const { loading } = useSelector((state) => state.disciplinryAction || {}); // Updated slice name if applicable

  useEffect(() => {
    if (disciplinryAction) {
      reset({
        employee_id: disciplinryAction.employee_id || "",
        incident_date: disciplinryAction.incident_date || new Date().toISOString(),
        incident_description: disciplinryAction.incident_description || "",
        action_taken: disciplinryAction.action_taken || "",
        committee_notes: disciplinryAction.committee_notes || "",
        penalty_type: disciplinryAction.penalty_type || "",
        effective_from: disciplinryAction.effective_from || new Date().toISOString(),
        status: disciplinryAction.status || "Pending",
      });
    } else {
      reset({
        employee_id: "",
        incident_date: new Date().toISOString(),
        incident_description: "",
        action_taken: "",
        committee_notes: "",
        penalty_type: "",
        effective_from: new Date().toISOString(),
        status: "Pending",
      });
    }
  }, [disciplinryAction, reset]);

  useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
    dispatch(fetchdisciplinary_penalty({ searchValue }));
  }, [dispatch, searchValue]);

  const { employee, loading: employeeLoading } = useSelector(
    (state) => state.employee || {}
  );

  const { disciplinary_penalty, loading: diciplinaryloading } = useSelector(
    (state) => state.disciplinary_penalty || {});


  const employees = employee?.data?.map((i) => ({
    label: i?.full_name,
    value: i?.id,
  }));

  const penaltyOptions = (disciplinary_penalty?.data || []).map((p) => ({
    label: p?.description,
    value: p?.id,
  }));





  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      disciplinryAction
        ? await dispatch(
          updatedisciplinryAction({
            id: disciplinryAction.id,
            disciplinryActionData: { ...data },
          })
        ).unwrap()
        : await dispatch(createdisciplinryAction({ ...data })).unwrap();
      closeButton?.click();
      reset();
      setdisciplinryAction(null);
    } catch (error) {
      closeButton?.click();
    }
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("offcanvas_add");
    if (offcanvasElement) {
      const handleModalClose = () => {
        setdisciplinryAction(null);
      };
      offcanvasElement.addEventListener("hidden.bs.offcanvas", handleModalClose);
      return () => {
        offcanvasElement.removeEventListener("hidden.bs.offcanvas", handleModalClose);
      };
    }
  }, [setdisciplinryAction]);

  return (
    <>
      {/* Add New appointment */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add"
      >
        <div className="offcanvas-header border-bottom">
          <h4>{disciplinryAction ? "Update " : "Add New "} Disciplinary Action Log</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => {
              setdisciplinryAction(null);
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
                  <label className="col-form-label">Employee <span className="text-danger">*</span></label>
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
                  <label className="col-form-label"> Penalty Type<span className="text-danger">*</span></label>
                  <Controller
                    name="id"
                    control={control}
                    rules={{ required: "disciplinary penalty is required" }}
                    render={({ field }) => {
                      const selected = (penaltyOptions || []).find(opt => opt.value === field.value);
                      return (
                        <Select
                          {...field}
                          options={penaltyOptions}
                          placeholder="Select Training"
                          isLoading={diciplinaryloading}
                          value={selected || null}
                          onChange={(opt) => field.onChange(opt?.value)}
                          classNamePrefix="react-select"
                        />
                      );
                    }}
                  />
                  {errors.id && <small className="text-danger">{errors.id.message}</small>}
                </div>


                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Incident Date <span className="text-danger">*</span></label>
                  <Controller
                    name="incident_date"
                    control={control}
                    rules={{ required: "Incident date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        value={
                          field.value ? moment(field.value).format("DD-MM-YYYY") : ""
                        }
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => {
                          field.onChange(date)
                        }}
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select Date"
                      />
                    )}
                  />
                </div>




                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Action Taken</label>
                  <Controller
                    name="action_taken"
                    control={control}
                    render={({ field }) => (
                      <input {...field} className="form-control" placeholder="e.g., Verbal warning" />
                    )}
                  />
                </div>



                <div className="col-md-6 mb-3">
                  <label className="col-form-label">Effective From</label>
                  <Controller
                    name="effective_from"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        value={
                          field.value ? moment(field.value).format("DD-MM-YYYY") : ""
                        }
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) => {
                          field.onChange(date)
                        }}
                        className="form-control"
                        dateFormat="dd-MM-yyyy"
                        placeholderText="Select Date"
                      />
                    )}
                  />
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

                <div className="col-12 mb-3">
                  <label className="col-form-label">Committee Notes</label>
                  <Controller
                    name="committee_notes"
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

                <div className="col-12 mb-3">
                  <label className="col-form-label">Incident Description</label>
                  <Controller
                    name="incident_description"
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
                {disciplinryAction
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

export default ManagedisciplinryAction;
