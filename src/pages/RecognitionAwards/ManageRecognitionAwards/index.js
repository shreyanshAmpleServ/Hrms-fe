import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchEmployee } from "../../../redux/Employee";
import {
  createrecognitionAwards,
  updaterecognitionAwards,
} from "../../../redux/RecognitionAwards";

const ManageRecognitionAwards = ({ setrecognitionAwards, recognitionAwards }) => {
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
      award_title: "",
      description: "",
      award_date: "",
      nominated_by: "",
    },
  });

  useEffect(() => {
    dispatch(fetchEmployee({ searchValue }));
  }, [dispatch, searchValue]);

  useEffect(() => {
    if (recognitionAwards) {
      reset({
        employee_id: recognitionAwards.employee_id || "",
        award_title: recognitionAwards.award_title || "",
        description: recognitionAwards.description || "",
        award_date: recognitionAwards.award_date || "",
        nominated_by: recognitionAwards.nominated_by || "",
      });
    } else {
      reset();
    }
  }, [recognitionAwards, reset]);

  const { employee } = useSelector((state) => state.employee || {});
  const { loading } = useSelector((state) => state.recognitionAwards || {});

  const employeeOptions = employee?.data?.map((emp) => ({
    label: emp.full_name,
    value: emp.id,
  }));

  const onSubmit = async (data) => {
    const closeButton = document.querySelector('[data-bs-dismiss="offcanvas"]');
    try {
      if (recognitionAwards) {
        await dispatch(updaterecognitionAwards({
          id: recognitionAwards.id,
          recognitionAwardsData: data,
        })).unwrap();
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

  return (
    <div className="offcanvas offcanvas-end offcanvas-large" tabIndex={-1} id="offcanvas_add">
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
              <label className="col-form-label">Employee<span className="text-danger">*</span></label>
              <Controller
                name="employee_id"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => {
                  const selected = employeeOptions?.find(opt => opt.value === field.value);
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

            {/* Nominated By */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Nominated By</label>
              <Controller
                name="nominated_by"
                control={control}
                render={({ field }) => {
                  const selected = employeeOptions?.find(opt => opt.value === field.value);
                  return (
                    <Select
                      {...field}
                      options={employeeOptions}
                      placeholder="Select Nominator"
                      value={selected || null}
                      onInputChange={setSearchValue}
                      onChange={(opt) => field.onChange(opt?.value)}
                      classNamePrefix="react-select"
                    />
                  );
                }}
              />
            </div>

            {/* Award Title */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Award Title</label>
              <Controller
                name="award_title"
                control={control}
                render={({ field }) => (
                  <input type="text" className="form-control" placeholder="Enter award title" {...field} />
                )}
              />
            </div>

            {/* Award Date */}
            <div className="col-md-6 mb-3">
              <label className="col-form-label">Award Date</label>
              <Controller
                name="award_date"
                control={control}
                render={({ field }) => (
                  <input type="date" className="form-control" {...field} />
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
                  <textarea className="form-control" rows={4} placeholder="Enter description" {...field} />
                )}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-light me-2" data-bs-dismiss="offcanvas">Cancel</button>
            <button type="submit" className="btn btn-primary">
              {recognitionAwards ? (loading ? "Updating..." : "Update") : loading ? "Creating..." : "Create"}
              {loading && <div className="spinner-border spinner-border-sm ms-2" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageRecognitionAwards;
