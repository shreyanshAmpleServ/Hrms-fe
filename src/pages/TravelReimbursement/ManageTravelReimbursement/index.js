import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import { fetchUsers } from "../../../redux/manage-user";
import {
  createtravelReimbursement,
  updatetravelReimbursement,
} from "../../../redux/TravelReimbursement";
import DatePicker from "react-datepicker";

const ManagetravelReimbursement = ({ settravelReimbursement, travelReimbursement }) => {
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
      travel_purpose: "",
      start_date: "",
      end_date: "",
      destination: "",
      total_amount: "",
      approved_by: "",
      approval_status: "",
    },
  });

  useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
    dispatch(fetchUsers({ searchValue }));
  }, [dispatch, searchValue]);


  useEffect(() => {
    if (travelReimbursement) {
      reset({
        employee_id: travelReimbursement.employee_id || "",
        travel_purpose: travelReimbursement.travel_purpose || "",
        start_date: travelReimbursement.start_date || "",
        end_date: travelReimbursement.end_date || "",
        destination: travelReimbursement.destination || "",
        total_amount: travelReimbursement.total_amount || "",
        approved_by: travelReimbursement.approved_by || "",
        approval_status: travelReimbursement.approval_status || "",
      });
    } else {
      reset();
    }
  }, [travelReimbursement, reset]);

  const { employee } = useSelector((state) => state.employee || {});
  const { users } = useSelector((state) => state.users || {});
  const { loading } = useSelector((state) => state.travelReimbursement || {});

  const employeeOptions = employee?.data?.map((emp) => ({
    label: emp.full_name,
    value: emp.id,
  }));

  const userOptions = users?.data?.map((u) => ({
    label: u.full_name,
    value: u.id,
  }));

  const statusOptions = [
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
  ];

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      if (travelReimbursement) {
        await dispatch(updatetravelReimbursement({
          id: travelReimbursement.id,
          travelReimbursementData: data,
        })).unwrap();
      } else {
        await dispatch(createtravelReimbursement(data)).unwrap();
      }
      closeButton?.click();
      reset();
      settravelReimbursement(null);
    } catch (error) {
      console.error("Error in submission", error);
    }
  };

  return (
    <div className="offcanvas offcanvas-end offcanvas-large" tabIndex={-1} id="offcanvas_add">
      <div className="offcanvas-header border-bottom">
        <h4>{travelReimbursement ? "Update" : "Add"} Travel Reimbursement</h4>
        <button
          type="button"
          className="btn-close custom-btn-close border p-1"
          data-bs-dismiss="offcanvas"
          onClick={() => {
            settravelReimbursement(null);
            reset();
          }}
        />
      </div>
      <div className="offcanvas-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">

            {/* Employee */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Employee<span className="text-danger">*</span></label>
              <Controller
                name="employee_id"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => {
                  const selected = (employeeOptions || []).find(opt => opt.value === field.value);
                  return (
                    <Select
                      {...field}
                      options={employeeOptions}
                      placeholder="Select Employee"
                      value={selected || null}
                      onInputChange={setSearchValue}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                    />
                  );
                }}
              />
              {errors.employee_id && <small className="text-danger">{errors.employee_id.message}</small>}
            </div>

            {/* Approved By */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Approved By</label>
              <Controller
                name="approved_by"
                control={control}
                render={({ field }) => {
                  const selected = (userOptions || []).find(opt => opt.value === field.value);
                  return (
                    <Select
                      {...field}
                      options={userOptions}
                      placeholder="Select Approver"
                      value={selected || null}
                      onInputChange={setSearchValue}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                    />
                  );
                }}
              />
              {errors.approved_by && <small className="text-danger">{errors.approved_by.message}</small>}
            </div>


            {/* Travel Purpose */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Travel Purpose</label>
              <Controller
                name="travel_purpose"
                control={control}
                render={({ field }) => (
                  <input type="text" className="form-control" placeholder="Enter purpose" {...field} />
                )}
              />
            </div>

            {/* Destination */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Destination</label>
              <Controller
                name="destination"
                control={control}
                render={({ field }) => (
                  <input type="text" className="form-control" placeholder="Enter destination" {...field} />
                )}
              />
            </div>

            {/* Start Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Start Date</label>
              <Controller
                name="start_date"
                control={control}
                rules={{ required: "Date is required" }}
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
                    placeholderText="Select Start Date"
                  />
                )}
              />
            </div>

            {/* End Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">End Date</label>
              <Controller
                name="end_date"
                control={control}
                rules={{ required: "Date is required" }}
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
                    placeholderText="Select End Date"
                  />
                )}
              />
            </div>

            {/* Total Amount */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Total Amount</label>
              <Controller
                name="total_amount"
                control={control}
                render={({ field }) => (
                  <input type="number" className="form-control" placeholder="Enter amount" {...field} />
                )}
              />
            </div>

            {/* Approval Status */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Approval Status</label>
              <Controller
                name="approval_status"
                control={control}
                render={({ field }) => {
                  const selected = statusOptions.find(opt => opt.value === field.value);
                  return (
                    <Select
                      {...field}
                      options={statusOptions}
                      placeholder="Select status"
                      value={selected || null}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-light me-2" data-bs-dismiss="offcanvas">Cancel</button>
            <button type="submit" className="btn btn-primary">
              {travelReimbursement ? (loading ? "Updating..." : "Update") : loading ? "Creating..." : "Create"}
              {loading && <div className="spinner-border spinner-border-sm ms-2" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagetravelReimbursement;
