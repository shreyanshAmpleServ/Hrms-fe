import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addresume_upload, updateresume_upload } from "../../../redux/resumeUpload";
import { fetchEmployee } from "../../../redux/Employee";
import { Controller } from "react-hook-form";
import Select from "react-select";
import React, { useEffect, useMemo } from "react";

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

  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        // resume_upload_name: initialData.resume_upload_name || "",
        employee_id: initialData.employee_id || "",
        resume_path: initialData.resume_path || "",
        uploaded_on: initialData.uploaded_on
          ? new Date(initialData.uploaded_on).toISOString().split("T")[0]
          : "",
      });
    } else {
      reset({
        // resume_upload_name: "",
        employee_id: "",
        resume_path: "",
        uploaded_on: new Date().toISOString().split("T")[0], // today
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
    formData.append("employee_id", data.employee_id || "");
    formData.append("uploaded_on", new Date(data.uploaded_on).toISOString());
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
              {mode === "add" ? "Add New Goal Category " : "Edit Goal Category"}
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

              {/* Resume Path */}
              <div className="mb-3">
                <label className="col-form-label">Resume File (PDF Only)</label>
                <input
                  type="file"
                  className={`form-control ${errors.resume_path ? "is-invalid" : ""}`}
                  accept=".pdf"
                  {...register("resume_path", {
                    required: "Resume file is required.",
                    validate: {
                      isPdf: (files) =>
                        files[0]?.type === "application/pdf" || "Only PDF files are allowed.",
                    },
                  })}
                />
                {errors.resume_path && (
                  <small className="text-danger">{errors.resume_path.message}</small>
                )}
              </div>

              {/* <div className="mb-3">
                <label className="col-form-label">Profile Image (JPG/PNG)</label>
                <input
                  type="file"
                  className={`form-control ${errors.profile_image ? "is-invalid" : ""}`}
                  accept="image/jpeg,image/png"
                  {...register("profile_image", {
                    required: "Profile image is required.",
                    validate: {
                      isImage: (files) => {
                        const type = files[0]?.type;
                        return (
                          type === "image/jpeg" || type === "image/png" || "Only JPG or PNG images are allowed."
                        );
                      },
                    },
                  })}
                />
                {errors.profile_image && (
                  <small className="text-danger">{errors.profile_image.message}</small>
                )}
              </div> */}




              {/* Uploaded On */}
              <div className="mb-3">
                <label className="col-form-label">Uploaded On</label>
                <input
                  type="date"
                  className={`form-control ${errors.uploaded_on ? "is-invalid" : ""}`}
                  {...register("uploaded_on", {
                    required: "Upload date is required.",
                  })}
                />
                {errors.uploaded_on && (
                  <small className="text-danger">{errors.uploaded_on.message}</small>
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
