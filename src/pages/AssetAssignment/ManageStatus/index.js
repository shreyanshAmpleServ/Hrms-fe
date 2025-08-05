import moment from "moment";
import React, { useEffect } from "react";
import { Button, CloseButton, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { updateAssetAssignment } from "../../../redux/AssetAssignment";

const statusOptions = [
  { value: "P", label: "Pending" },
  { value: "A", label: "Approved" },
  { value: "R", label: "Rejected" },
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
      status: selected?.status || "Pending",
      returned_on: selected?.returned_on
        ? new Date(selected.returned_on)
        : new Date(),
    },
  });

  useEffect(() => {
    if (selected) {
      setValue("status", selected.status);
      setValue(
        "returned_on",
        selected?.returned_on ? new Date(selected.returned_on) : new Date()
      );
    }
  }, [selected]);

  const onSubmit = (data) => {
    dispatch(
      updateAssetAssignment({
        id: selected.id,
        assetAssignmentData: {
          ...selected,
          status: data.status,
          returned_on: data.returned_on,
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
                  name="status"
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
                {errors?.status && (
                  <small className="text-danger">{errors.status.message}</small>
                )}
              </div>
            </div>
            {watch("status") === "R" && (
              <div className="row">
                <div className="col-md-12">
                  <label className="col-form-label">Returned Date</label>
                  <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <Controller
                      name="returned_on"
                      control={control}
                      rules={{
                        required:
                          watch("status") === "R"
                            ? "Rejection Reason is required"
                            : false,
                      }}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          className="form-control"
                          placeholderText="Select Returned Date"
                          selected={field.value}
                          value={
                            field.value
                              ? moment(field.value).format("DD-MM-YYYY")
                              : null
                          }
                          onChange={field.onChange}
                          dateFormat="DD-MM-YYYY"
                        />
                      )}
                    />
                  </div>
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
