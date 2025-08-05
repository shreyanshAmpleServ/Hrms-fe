import React, { useEffect } from "react";
import { Button, CloseButton, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { updateprobationReview } from "../../../redux/ProbationReview";

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
      confirmation_status: selected?.confirmation_status || "Pending",
      rejection_reason: selected?.rejection_reason || "",
    },
  });

  useEffect(() => {
    if (selected) {
      setValue("confirmation_status", selected.confirmation_status);
      setValue("rejection_reason", selected.rejection_reason);
    }
  }, [selected]);

  const onSubmit = (data) => {
    dispatch(
      updateprobationReview({
        id: selected.id,
        probationReviewData: {
          ...selected,
          confirmation_status: data.confirmation_status,
          rejection_reason: data.rejection_reason,
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
                  name="confirmation_status"
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
                {errors?.confirmation_status && (
                  <small className="text-danger">
                    {errors.confirmation_status.message}
                  </small>
                )}
              </div>
            </div>
            {watch("status") === "R" && (
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
