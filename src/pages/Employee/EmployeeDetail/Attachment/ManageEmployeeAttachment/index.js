import React from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Select from "react-select";
import {
  createEmployeeAttachment,
  updateEmployeeAttachment,
} from "../../../../../redux/EmployeeAttachment";

const ManageEmployeeAttachment = ({
  setEmployeeAttachment,
  employeeAttachment,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { loading } = useSelector((state) => state.employeeAttachment || {});

  React.useEffect(() => {
    reset({
      employee_id: id,
      document_type: employeeAttachment?.document_type || "",
      document_path: "",
    });
  }, [employeeAttachment, reset]);

  const employeeAttachmentTypes = [
    { value: "Resume", label: "Resume" },
    { value: "Offer Letter", label: "Offer Letter" },
    { value: "Joining Letter", label: "Joining Letter" },
    { value: "ID Proof", label: "ID Proof" },
    { value: "Address Proof", label: "Address Proof" },
    { value: "Experience Letter", label: "Experience Letter" },
    { value: "Educational Certificates", label: "Educational Certificates" },
    { value: "Salary Slips", label: "Salary Slips" },
    { value: "Relieving Letter", label: "Relieving Letter" },
    { value: "Promotion Letter", label: "Promotion Letter" },
    { value: "Other", label: "Other" },
  ];

  const onSubmit = async (data) => {
    const closeButton = document.getElementById(
      "close_btn_update_attachment_modal"
    );
    const formData = new FormData();
    formData.append("employee_id", data.employee_id);
    formData.append("document_type", data.document_type);
    formData.append("document_path", data.document_path);
    if (employeeAttachment) {
      formData.append("id", employeeAttachment?.id);
    }
    try {
      employeeAttachment
        ? await dispatch(updateEmployeeAttachment(formData)).unwrap()
        : await dispatch(createEmployeeAttachment(formData)).unwrap();
      reset();
      closeButton.click();
      setEmployeeAttachment(null);
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
  };

  return (
    <>
      <div className="modal fade" id="update_attachment_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h4>{employeeAttachment ? "Update " : "Add "} Attachment</h4>
              <button
                type="button"
                className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="close_btn_update_attachment_modal"
                onClick={() => {
                  setEmployeeAttachment(null);
                  reset();
                }}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <div className="row">
                    <div className="col-md-12">
                      <label className="col-form-label">
                        Attachment Type <span className="text-danger">*</span>
                      </label>
                      <div className="mb-3">
                        <Controller
                          name="document_type"
                          control={control}
                          rules={{ required: "Attachment type is required!" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className="select"
                              options={employeeAttachmentTypes}
                              placeholder="Select Attachment Type"
                              classNamePrefix="react-select"
                              value={employeeAttachmentTypes.find(
                                (x) => x.value === field.value
                              )}
                              onChange={(option) =>
                                field.onChange(option.value)
                              }
                            />
                          )}
                        />
                        {errors.document_type && (
                          <small className="text-danger">
                            {errors.document_type.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="col-md-12">
                      <label className="col-form-label">
                        Attachment <span className="text-danger">*</span>
                      </label>
                      <div className="mb-3">
                        <Controller
                          name="document_path"
                          control={control}
                          rules={{ required: "Attachment is required!" }}
                          render={({ field: { onChange } }) => (
                            <input
                              type="file"
                              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                              className="form-control"
                              onChange={(e) => onChange(e.target.files[0])}
                            />
                          )}
                        />
                        {errors.document_path && (
                          <small className="text-danger">
                            {errors.document_path.message}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    id="close_btn_update_attachment_modal"
                    className="btn btn-light me-2"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {employeeAttachment
                      ? loading
                        ? "Updating..."
                        : "Update"
                      : loading
                        ? "Uploading..."
                        : "Upload"}
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
        </div>
      </div>
    </>
  );
};

export default ManageEmployeeAttachment;
