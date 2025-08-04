import { Modal } from "antd";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { getAllRequests, takeActionOnRequest } from "../../../../redux/Request";

const Confirmation = ({ open, setOpen, setStatus, status = "A" }) => {
  const { handleSubmit, control, watch, reset } = useForm();
  const dispatch = useDispatch();

  const request_approval_id = open?.request_approval_request?.find(
    (item) => item.status === "P"
  )?.id;

  useEffect(() => {
    reset({
      request_id: open?.id,
      request_approval_id: request_approval_id,
      action: status,
      remarks: "",
    });
  }, [open, status]);

  const onSubmit = async (data) => {
    await dispatch(takeActionOnRequest(data)).unwrap();
    setOpen(null);
    setStatus("A");
    reset();
    await dispatch(getAllRequests()).unwrap();
  };

  return (
    <Modal
      open={open}
      onOk={onSubmit}
      onCancel={() => setOpen(false)}
      footer={null}
      style={{
        width: "500px",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <div>
            <div className="text-center">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor:
                    status === "A"
                      ? "rgba(0, 255, 0, 0.1)"
                      : "rgba(255, 0, 0, 0.1)",
                }}
                className={`avatar avatar-xl ${status === "A" ? "bg-success-light" : "bg-danger-light"} rounded-circle mb-3`}
              >
                <i
                  className={`ti ${status === "A" ? "ti-check" : "ti-x"} fs-36 ${status === "A" ? "text-success" : "text-danger"}`}
                />
              </div>

              <h4 className="mb-2">
                {status === "A" ? "Approve" : "Reject"} Request?
              </h4>

              <p className="mb-4">
                Are you sure you want to {status === "A" ? "approve" : "reject"}{" "}
                this request?
              </p>

              {/* Remarks textarea */}
              <div className="mb-4">
                <label className="form-label text-start d-block fw-semibold">
                  Remarks <span className="text-danger">*</span>
                </label>
                <Controller
                  name="remarks"
                  control={control}
                  rules={{
                    required: "Remarks is required",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <textarea
                        {...field}
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        rows="4"
                        placeholder={`Enter ${status === "A" ? "approval" : "rejection"} remarks...`}
                      />
                      {error && (
                        <div className="invalid-feedback">{error.message}</div>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Action buttons */}
              <div className="d-flex align-items-center justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className={`btn ${status === "A" ? "btn-success" : "btn-danger"}`}
                  type="submit"
                >
                  <i
                    className={`ti ${status === "A" ? "ti-check" : "ti-x"} me-1`}
                  ></i>
                  Yes, {status === "A" ? "Approve" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default Confirmation;
