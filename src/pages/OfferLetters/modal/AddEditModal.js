import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { addloan_requests, updateloan_requests } from "../../../redux/loanRequests";
import { fetchdepartment } from "../../../redux/department";
import { fetchEmployee } from "../../../redux/Employee";

const AddEditModal = ({ contact, mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.loan_requests);
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
    dispatch(fetchEmployee());
  }, [dispatch]);

  const employee = useSelector((state) => state.employee.employee);

  const EmployeeList = useMemo(
    () =>
      employee?.data?.map((item) => ({
        value: item.id,
        label: item.first_name, // or item.full_name or item.employee_name, depending on your API
      })) || [],
    [employee]
  );


  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        status: initialData.status || "",
        offer_date: initialData.offer_date ? new Date(initialData.offer_date).toISOString().split("T")[0] : "",
        valid_until: initialData.valid_until ? new Date(initialData.valid_until).toISOString().split("T")[0] : "",
        offered_salary: initialData.offered_salary || "",
        position: initialData.position || "",
        employee_id: initialData.employee_id || "",
      });

    } else {
      reset({
        status: "",
        offer_date: "",
        valid_until: "",
        offered_salary: "",
        position: "",
        employee_id: "",
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
      required_experience: data.required_experience !== "" && !isNaN(data.required_experience)
        ? data.required_experience
        : null,
      is_internal: data.is_internal,
    };


    if (mode === "add") {
      dispatch(addloan_requests(formattedData));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateloan_requests({
          id: initialData.id,
          loan_requestsData: formattedData,
        })
      );
    }

    reset();
    closeButton?.click();
  };

  useEffect(() => {
    const offcanvasElement = document.getElementById("add_edit_offer_letter_modal");
    if (offcanvasElement) {
      const handleModalClose = () => {
        // Clean up state if needed
      };
      offcanvasElement.addEventListener("hidden.bs.offcanvas", handleModalClose);
      return () => offcanvasElement.removeEventListener("hidden.bs.offcanvas", handleModalClose);
    }
  }, []);

  return (
    <div className="offcanvas offcanvas-end offcanvas-large"
      tabIndex={-1}
      id="add_edit_offer_letter_modal"
    // aria-labelledby="offcanvasLabel"
    >
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-semibold">{contact ? "Update" : "Add New"} Offer Letter</h5>
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
          {/* Department */}
          {/* Employee ID */}
          <div className="col-md-6">
            <label className="col-form-label">
              Employee <span className="text-danger">*</span>
            </label>
            <Controller
              name="employee_id"
              control={control}
              rules={{ required: "Employee is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={EmployeeList}
                  placeholder="Choose Employee"
                  isDisabled={!EmployeeList.length}
                  classNamePrefix="react-select"
                  className="select2"
                  onChange={(option) => field.onChange(option?.value || "")}
                  value={EmployeeList.find(
                    (option) => option.value === watch("employee_id")
                  )}
                />
              )}
            />
            {errors.employee_id && (
              <small className="text-danger">{errors.employee_id.message}</small>
            )}

          </div>


          {/* Offer Date */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Offer Date</label>
            <input
              type="date"
              className="form-control"
              {...register("offer_date", { required: "Offer date is required" })}
            />
            {errors.offer_date && (
              <small className="text-danger">{errors.offer_date.message}</small>
            )}
          </div>

          {/* Position */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Position</label>
            <input
              type="text"
              className="form-control"
              {...register("position", { required: "Position is required" })}
            />
            {errors.position && (
              <small className="text-danger">{errors.position.message}</small>
            )}
          </div>

          {/* Offered Salary */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Offered Salary</label>
            <input
              type="number"
              className="form-control"
              {...register("offered_salary", { required: "Offered salary is required" })}
            />
            {errors.offered_salary && (
              <small className="text-danger">{errors.offered_salary.message}</small>
            )}
          </div>

          {/* Valid Until */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Valid Until</label>
            <input
              type="date"
              className="form-control"
              {...register("valid_until", { required: "Valid until date is required" })}
            />
            {errors.valid_until && (
              <small className="text-danger">{errors.valid_until.message}</small>
            )}
          </div>

          {/* Status */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              {...register("status", { required: "Status is required" })}
              defaultValue=""
            >
              <option value="">Select</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            {errors.status && (
              <small className="text-danger">{errors.status.message}</small>
            )}
          </div>


          <div className="col-md-12 text-end">
            <button type="button" className="btn btn-light me-2" data-bs-dismiss="offcanvas">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (mode === "add" ? "Creating..." : "Updating...") : mode === "add" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditModal;
