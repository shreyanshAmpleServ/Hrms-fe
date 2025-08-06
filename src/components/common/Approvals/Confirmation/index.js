import { Modal } from "antd";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  getPendingRequests,
  takeActionOnRequest,
} from "../../../../redux/Request";

const Confirmation = ({ open, setOpen, setStatus, status = "A" }) => {
  const { handleSubmit, control, reset } = useForm();
  const dispatch = useDispatch();
  const request = open;

  const request_approval_id = request?.request_approval_request?.find(
    (item) => item.status === "P"
  )?.id;

  useEffect(() => {
    reset({
      request_id: request?.id,
      request_approval_id: request_approval_id,
      action: status,
      remarks: "",
    });
  }, [request, status]);

  const onSubmit = async (data) => {
    await dispatch(takeActionOnRequest(data)).unwrap();
    setOpen(null);
    setStatus("A");
    reset();
    await dispatch(getPendingRequests()).unwrap();
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to render reference details based on request type
  const renderReferenceDetails = () => {
    if (!request?.reference || !request?.request_type) return null;

    const { reference, request_type } = request;

    switch (request_type) {
      case "leave_request":
        return (
          <div className="reference-details bg-light py-2 rounded mb-4">
            <h6 className="fw-semibold mb-3 text-primary">
              <i className="ti ti-calendar me-2"></i>Leave Request Details
            </h6>
            <div className="row g-2">
              <div className="col-6">
                <small className="text-muted">Leave Type:</small>
                <div className="fw-medium">
                  {reference.leave_types?.leave_type || "N/A"}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Duration:</small>
                <div className="fw-medium">
                  {formatDate(reference.start_date)} -{" "}
                  {formatDate(reference.end_date)}
                </div>
              </div>
              <div className="col-12">
                <small className="text-muted">Reason:</small>
                <div className="fw-medium">{reference.reason || "N/A"}</div>
              </div>
            </div>
          </div>
        );

      case "loan_request":
        return (
          <div className="reference-details bg-light py-2 rounded mb-4">
            <h6 className="fw-semibold mb-3 text-primary">
              <i className="ti ti-credit-card me-2"></i>Loan Request Details
            </h6>
            <div className="row g-2">
              <div className="col-6">
                <small className="text-muted">Loan Type:</small>
                <div className="fw-medium">
                  {reference.loan_types?.loan_name || "N/A"}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Amount:</small>
                <div className="fw-medium">
                  {reference.loan_req_currency?.currency_code}{" "}
                  {reference.amount}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">EMI Months:</small>
                <div className="fw-medium">{reference.emi_months} months</div>
              </div>
              <div className="col-6">
                <small className="text-muted">EMI Amount:</small>
                <div className="fw-medium">
                  {reference.loan_req_currency?.currency_code}{" "}
                  {reference.loan_emi_loan_request?.[0]?.emi_amount || "N/A"}
                </div>
              </div>
            </div>
          </div>
        );

      case "advance_request":
        return (
          <div className="reference-details bg-light py-2 rounded mb-4">
            <h6 className="fw-semibold mb-3 text-primary">
              <i className="ti ti-wallet me-2"></i>Advance Request Details
            </h6>
            <div className="row g-2">
              <div className="col-6">
                <small className="text-muted">Requested Amount:</small>
                <div className="fw-medium">
                  {
                    reference.hrms_advance_payement_entry_employee
                      ?.employee_currency?.currency_code
                  }{" "}
                  {reference.amount_requested}
                </div>
              </div>

              <div className="col-6">
                <small className="text-muted">Request Date:</small>
                <div className="fw-medium">
                  {formatDate(reference.request_date)}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Repayment Schedule:</small>
                <div className="fw-medium">
                  {formatDate(reference.repayment_schedule)}
                </div>
              </div>
              <div className="col-12">
                <small className="text-muted">Reason:</small>
                <div className="fw-medium">{reference.reason || "N/A"}</div>
              </div>
            </div>
          </div>
        );

      case "asset_request":
        return (
          <div className="reference-details bg-light py-2 rounded mb-4">
            <h6 className="fw-semibold mb-3 text-primary">
              <i className="ti ti-device-laptop me-2"></i>Asset Request Details
            </h6>
            <div className="row g-2">
              <div className="col-6">
                <small className="text-muted">Asset Name:</small>
                <div className="fw-medium">{reference.asset_name || "N/A"}</div>
              </div>
              <div className="col-6">
                <small className="text-muted">Asset Type:</small>
                <div className="fw-medium">
                  {reference.asset_assignment_type?.asset_type_name || "N/A"}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Serial Number:</small>
                <div className="fw-medium">
                  {reference.serial_number || "N/A"}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Issued Date:</small>
                <div className="fw-medium">
                  {formatDate(reference.issued_on)}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Return Date:</small>
                <div className="fw-medium">
                  {formatDate(reference.returned_on)}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Depreciation Rate:</small>
                <div className="fw-medium">
                  {reference.asset_assignment_type?.depreciation_rate || "N/A"}%
                </div>
              </div>
            </div>
          </div>
        );

      case "probation_review":
        return (
          <div className="reference-details bg-light py-2 rounded mb-4">
            <h6 className="fw-semibold mb-3 text-primary">
              <i className="ti ti-user-check me-2"></i>Probation Review Details
            </h6>
            <div className="row g-2">
              <div className="col-6">
                <small className="text-muted">Employee:</small>
                <div className="fw-medium">
                  {reference.probation_review_employee?.full_name} (
                  {reference.probation_review_employee?.employee_code})
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Reviewer:</small>
                <div className="fw-medium">
                  {reference.probation_reviewer?.full_name} (
                  {reference.probation_reviewer?.employee_code})
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Probation End Date:</small>
                <div className="fw-medium">
                  {formatDate(reference.probation_end_date)}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Review Meeting Date:</small>
                <div className="fw-medium">
                  {formatDate(reference.review_meeting_date)}
                </div>
              </div>

              {reference.extension_required === "true" && (
                <>
                  <div className="col-6">
                    <small className="text-muted">Extension Reason:</small>
                    <div className="fw-medium">
                      {reference.extension_reason || "N/A"}
                    </div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Extended Till:</small>
                    <div className="fw-medium">
                      {formatDate(reference.extended_till_date)}
                    </div>
                  </div>
                </>
              )}
              <div className="col-12">
                <small className="text-muted">Review Notes:</small>
                <div className="fw-medium">
                  {reference.review_notes || "N/A"}
                </div>
              </div>
              <div className="col-12">
                <small className="text-muted">Final Remarks:</small>
                <div className="fw-medium">
                  {reference.final_remarks || "N/A"}
                </div>
              </div>
            </div>
          </div>
        );

      case "appraisal_review":
        return (
          <div className="reference-details bg-light py-2 rounded mb-4">
            <h6 className="fw-semibold mb-3 text-primary">
              <i className="ti ti-star me-2"></i>Appraisal Review Details
            </h6>
            <div className="row g-2">
              <div className="col-6">
                <small className="text-muted">Employee:</small>
                <div className="fw-medium">
                  {reference.appraisal_employee?.full_name || "N/A"}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Review Period:</small>
                <div className="fw-medium">
                  {reference.review_period || "N/A"}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Rating:</small>
                <div className="fw-medium">
                  <div className="d-flex align-items-center">
                    <span className="me-2">{reference.rating || 0}/5</span>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`ti ti-star${
                            star <= (reference.rating || 0)
                              ? "-filled text-warning"
                              : " text-muted"
                          } me-1`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <small className="text-muted">Reviewer Comments:</small>
                <div className="fw-medium">
                  {reference.reviewer_comments || "N/A"}
                </div>
              </div>
            </div>
          </div>
        );

      case "leave_encashment":
        return (
          <div className="reference-details bg-light py-2 rounded mb-4">
            <h6 className="fw-semibold mb-3 text-primary">
              <i className="ti ti-coins me-2"></i>Leave Encashment Details
            </h6>
            <div className="row g-2">
              <div className="col-6">
                <small className="text-muted">Employee:</small>
                <div className="fw-medium">
                  {reference.leave_encashment_employee?.full_name || "N/A"}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Leave Type:</small>
                <div className="fw-medium">
                  {reference.encashment_leave_types?.leave_type || "N/A"}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Leave Days:</small>
                <div className="fw-medium">{reference.leave_days} days</div>
              </div>
              <div className="col-6">
                <small className="text-muted">Encashment Amount:</small>
                <div className="fw-medium text-success fw-bold">
                  ₹
                  {parseFloat(
                    reference.encashment_amount || 0
                  ).toLocaleString()}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Encashment Date:</small>
                <div className="fw-medium">
                  {formatDate(reference.encashment_date)}
                </div>
              </div>
              <div className="col-6">
                <small className="text-muted">Approval Status:</small>
                <div className="fw-medium">
                  <span
                    className={`badge ${
                      reference.approval_status === "A"
                        ? "bg-success"
                        : reference.approval_status === "P"
                          ? "bg-warning"
                          : "bg-danger"
                    }`}
                  >
                    {reference.approval_status === "A"
                      ? "Approved"
                      : reference.approval_status === "P"
                        ? "Pending"
                        : "Rejected"}
                  </span>
                </div>
              </div>
              {reference.payroll_period && (
                <div className="col-12">
                  <small className="text-muted">Payroll Period:</small>
                  <div className="fw-medium">{reference.payroll_period}</div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="reference-details bg-light py-2 rounded mb-4">
            <h6 className="fw-semibold mb-3 text-primary">
              <i className="ti ti-info-circle me-2"></i>Request Details
            </h6>
            <div className="text-muted">
              Reference details for {request_type.replace("_", " ")} are not
              configured.
            </div>
          </div>
        );
    }
  };

  return (
    <Modal
      open={!!open}
      onCancel={() => setOpen(null)}
      footer={null}
      width={600}
      className="confirmation-modal"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="text-center mb-4">
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor:
                status === "A"
                  ? "rgba(0, 255, 0, 0.1)"
                  : "rgba(255, 0, 0, 0.1)",
              margin: "0 auto",
            }}
            className={`d-flex align-items-center justify-content-center ${
              status === "A" ? "bg-success-light" : "bg-danger-light"
            } rounded-circle mb-3`}
          >
            <i
              className={`ti ${status === "A" ? "ti-check" : "ti-x"} fs-24 ${
                status === "A" ? "text-success" : "text-danger"
              }`}
            />
          </div>

          <h4 className="mb-2">
            {status === "A" ? "Approve" : "Reject"} Request?
          </h4>

          <p className="mb-4 px-3 text-muted">
            Are you sure you want to {status === "A" ? "approve" : "reject"}{" "}
            this {request?.request_type?.replace("_", " ")} request from{" "}
            <strong>{request?.requests_employee?.full_name}</strong>?
          </p>
        </div>

        {/* Render Reference Details */}
        {renderReferenceDetails()}

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
                  rows="3"
                  placeholder={`Enter ${
                    status === "A" ? "approval" : "rejection"
                  } remarks...`}
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
            onClick={() => setOpen(null)}
          >
            Cancel
          </button>
          <button
            className={`btn ${status === "A" ? "btn-success" : "btn-danger"}`}
            type="submit"
          >
            <i className={`ti ${status === "A" ? "ti-check" : "ti-x"} me-1`} />
            Yes, {status === "A" ? "Approve" : "Reject"}
          </button>
        </div>
      </form>

      <style>{`
        .reference-details {
          border-left: 4px solid #007bff;
        }
        .rating-stars {
          font-size: 14px;
        }
        .confirmation-modal .ant-modal-content {
          border-radius: 12px;
        }
      `}</style>
    </Modal>
  );
};

export default Confirmation;
