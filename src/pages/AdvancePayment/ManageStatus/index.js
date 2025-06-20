import React, { useEffect } from "react";
import { Button, CloseButton, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { updateAdvancePayment } from "../../../redux/AdvancePayment";
import DatePicker from "react-datepicker";

const statusOptions = [
  { label: "Pending", value: "P" },
  { label: "Approved", value: "A" },
  { label: "Rejected", value: "R" },
];
const ManageStatus = ({ open, setOpen, selected }) => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    watch,
    control,
    errors,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      approval_status: selected?.approval_status || "Pending",
      rejection_reason: selected?.rejection_reason || "",
      amount_approved: selected?.amount_approved ?? "", // use nullish coalescing
      approval_date: selected?.approval_date
        ? new Date(selected.approval_date)
        : null,
    },
  });

  useEffect(() => {
    if (selected) {
      setValue("approval_status", selected?.approval_status ?? "Pending");
      setValue("rejection_reason", selected?.rejection_reason ?? "");
      setValue("amount_approved", selected?.amount_approved ?? "");
      setValue(
        "approval_date",
        selected.approval_date ? new Date(selected.approval_date) : null
      );
    }
  }, [selected]);

  const onSubmit = (data) => {
    dispatch(
      updateAdvancePayment({
        id: selected.id,
        advancePaymentData: {
          ...selected,
          approval_status: data.approval_status,
          rejection_reason: data.rejection_reason,
          amount_approved: data.amount_approved,
          approval_date: data.approval_date,
        },
      })
    );
    setOpen(false);
    reset();
  };

  return (
    <>
      <Modal
        show={open}
        onHide={() => setOpen(false)}
        centered
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        id="manage_status_modal"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header>
            <Modal.Title>Manage Status</Modal.Title>
            <CloseButton onClick={() => setOpen(false)} />
          </Modal.Header>
          <Modal.Body>
            <div className="row mb-3">
              <div className="col-md-12">
                <label className="form-label">
                  Status <span className="text-danger">*</span>
                </label>
                <Controller
                  name="approval_status"
                  control={control}
                  rules={{ required: "Status is required" }}
                  render={({ field }) => {
                    const selectedStatus = statusOptions?.find(
                      (status) => status.value === field.value
                    );
                    return (
                      <Select
                        {...field}
                        className="select"
                        options={statusOptions}
                        placeholder="Select Status"
                        value={selectedStatus || null}
                        classNamePrefix="react-select"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption.value)
                        }
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    );
                  }}
                />
                {errors?.approval_status && (
                  <small className="text-danger">
                    {errors.approval_status.message}
                  </small>
                )}
              </div>
            </div>
            {watch("approval_status") === "A" && (
              <>
                <div className="col-md-12">
                  <label className="col-form-label">
                    Amount Approved <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="amount_approved"
                    control={control}
                    rules={{ required: "Amount Approved is required!" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className={`form-control ${
                          errors?.amount_approved ? "is-invalid" : ""
                        }`}
                        placeholder="Enter Amount Approved"
                      />
                    )}
                  />
                  {errors?.amount_approved && (
                    <small className="text-danger">
                      {errors?.amount_approved.message}
                    </small>
                  )}
                </div>

                <div className="col-md-12">
                  <label className="col-form-label">
                    Approval Date <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="approval_date"
                    control={control}
                    rules={{ required: "Approval Date is required!" }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        className="form-control"
                        placeholderText="Select Approval Date"
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="dd-MM-yyyy"
                      />
                    )}
                  />
                  {errors?.approval_date && (
                    <small className="text-danger">
                      {errors?.approval_date.message}
                    </small>
                  )}
                </div>
              </>
            )}
            {watch("approval_status") === "R" && (
              <div className="row">
                <div className="col-md-12">
                  <label className="form-label">
                    Rejection Reason <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="rejection_reason"
                    control={control}
                    rules={{
                      required:
                        watch("status") === "R"
                          ? "Rejection Reason is required"
                          : false,
                    }}
                    render={({ field }) => {
                      return (
                        <textarea
                          {...field}
                          className="form-control"
                          placeholder="Enter Rejection Reason"
                          value={field.value || ""}
                          onChange={field.onChange}
                          rows={3}
                        />
                      );
                    }}
                  />
                  {errors?.rejection_reason && (
                    <small className="text-danger">
                      {errors.rejection_reason.message}
                    </small>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
            <Button
              type="button"
              className="btn btn-light"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default ManageStatus;
