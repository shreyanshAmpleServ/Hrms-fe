import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  addresume_upload,
  updateresume_upload,
} from "../../../redux/resumeUpload";
import { fetchCandidate } from "../../../redux/Candidate";
import { Controller } from "react-hook-form";
import Select from "react-select";
import React, { useEffect, useMemo } from "react";
import moment from "moment";
import DatePicker from "react-datepicker";
// import { Modal, Button } from 'react-bootstrap';

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.resume_upload);
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
    dispatch(fetchCandidate());
  }, [dispatch]);

  const candidate = useSelector((state) => state.candidate.candidate);

  const CandidateList = useMemo(
    () =>
      candidate?.data?.data?.map((item) => ({
        value: item.id,
        label: item.full_name,
      })) || []
  );

  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        // resume_upload_name: initialData.resume_upload_name || "",
        candidate_id: initialData.candidate_id || "",
        resume_path: initialData.resume_path || "",
        uploaded_on: initialData.uploaded_on || new Date().toISOString(),
      });
    } else {
      reset({
        // resume_upload_name: "",
        candidate_id: "",
        resume_path: "",
        uploaded_on: new Date().toISOString(), // today
      });
    }
  }, [mode, initialData, reset]);
  const onSubmit = (data) => {
    const closeButton = document.getElementById("close_resume_upload_modal");
    const resumeFile = data.resume_path?.[0];

    if (!resumeFile) {
      alert("Please upload resume file.");
      return;
    }

    const formData = new FormData();
    // If you use resume_upload_name, make sure to add it to the form
    // formData.append("resume_upload_name", data.resume_upload_name);
    formData.append("candidate_id", data.candidate_id || "");
    formData.append(
      "uploaded_on",
      data.uploaded_on || new Date().toISOString()
    );
    formData.append("resume_path", resumeFile);

    if (mode === "add") {
      dispatch(addresume_upload(formData));
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateresume_upload({
          id: initialData.id,
          resume_uploadData: formData,
        })
      );
    }

    reset();
    closeButton?.click();
  };

  return (
    <div className="modal fade" id="add_edit_resume_upload_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add  Resume " : "Edit Resume"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_resume_upload_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              {/* Industry Name */}

              {/* Resume Upload Name */}

              {/* Employee ID */}
              <div className="md-3">
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
                      isDisabled={!CandidateList.length}
                      classNamePrefix="react-select"
                      className="select2"
                      onChange={(option) => field.onChange(option?.value || "")}
                      value={CandidateList.find(
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

              {/* Resume Path */}
              <div className="mb-3 mt-3">
                <label className="col-form-label">Resume File (PDF Only)</label>
                <input
                  type="file"
                  className={`form-control ${errors.resume_path ? "is-invalid" : ""}`}
                  accept=".pdf"
                  {...register("resume_path", {
                    required: "Resume file is required.",
                    validate: {
                      isPdf: (files) =>
                        files[0]?.type === "application/pdf" ||
                        "Only PDF files are allowed.",
                    },
                  })}
                />
                {errors.resume_path && (
                  <small className="text-danger">
                    {errors.resume_path.message}
                  </small>
                )}
              </div>

              {/* Uploaded On */}
              <div className="mb-3">
                <label className="col-form-label">Uploaded On</label>
                <Controller
                  name="uploaded_on"
                  control={control}
                  rules={{ required: "End date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      className="form-control"
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="Select End Date"
                    />
                  )}
                />
                {errors.uploaded_on && (
                  <small className="text-danger">
                    {errors.uploaded_on.message}
                  </small>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <div className="d-flex align-items-center justify-content-end m-0">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary"
                >
                  {loading
                    ? mode === "add"
                      ? "Creating..."
                      : "Updating..."
                    : mode === "add"
                      ? "Create"
                      : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditModal;
