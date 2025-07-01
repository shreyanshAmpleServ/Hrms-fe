import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import { addLeaveType, updateLeaveType } from "../../../../../redux/LeaveType";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.leaveType);
  dayjs.extend(customParseFormat);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        leave_type: initialData.leave_type || "",
        leave_qty: initialData.leave_qty || "",
        leave_unit: initialData.leave_unit || "",
        carry_forward: initialData?.carry_forward || false,
        for_gender: initialData?.for_gender || "",
        prorate_allowed: initialData?.prorate_allowed === "Y" ? true : false,
        is_active: initialData?.is_active || "Y",
      });
    } else {
      reset({
        leave_type: "",
        leave_qty: "",
        leave_unit: "",
        carry_forward: false,
        for_gender: "",
        prorate_allowed: false,
        is_active: "Y",
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_add_edit_leave_type_modal"
    );
    if (mode === "add") {
      dispatch(
        addLeaveType({
          leave_type: data.leave_type,
          leave_qty: data.leave_qty,
          leave_unit: data.leave_unit,
          carry_forward: data?.carry_forward || false,
          for_gender: data?.for_gender || "",
          prorate_allowed: data?.prorate_allowed ? "Y" : "N",
          is_active: data?.is_active || "Y",
        })
      );
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateLeaveType({
          id: initialData.id,
          reqData: {
            leave_type: data.leave_type,
            leave_qty: data.leave_qty,
            leave_unit: data.leave_unit,
            carry_forward: data?.carry_forward || false,
            for_gender: data?.for_gender || "",
            prorate_allowed: data?.prorate_allowed ? "Y" : "N",
            is_active: data?.is_active || "Y",
          },
        })
      );
    }
    reset();
    setSelected(null);
    closeButton.click();
  };

  return (
    <div className="modal fade" id="add_edit_leave_type_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add  Leave Type" : "Edit Leave Type"}
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_add_edit_leave_type_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <Row className="mb-3">
                <Col md={6}>
                  <label className="col-form-label">
                    Leave Type <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.leave_type ? "is-invalid" : ""}`}
                    placeholder="Enter Leave Type"
                    {...register("leave_type", {
                      required: "Leave type is required.",
                    })}
                  />
                  {errors.leave_type && (
                    <small className="text-danger">
                      {errors.leave_type.message}
                    </small>
                  )}
                </Col>
                <Col md={6}>
                  <label className="col-form-label">
                    Leave Quantity <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.leave_qty ? "is-invalid" : ""}`}
                    placeholder="Enter Leave Quantity"
                    {...register("leave_qty", {
                      required: "Leave Quantity is required.",
                    })}
                  />
                  {errors.leave_qty && (
                    <small className="text-danger">
                      {errors.leave_qty.message}
                    </small>
                  )}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <label className="col-form-label">
                    Leave Unit <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="leave_unit"
                    control={control}
                    rules={{ required: "Leave unit is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={[
                          { value: "D", label: "Day" },
                          { value: "H", label: "Hour" },
                        ]}
                        placeholder="Choose Leave Unit"
                        classNamePrefix="react-select"
                        className={`select2 ${errors.leave_unit ? "is-invalid" : ""}`}
                        onChange={(option) =>
                          field.onChange(option?.value || "")
                        }
                        value={[
                          { value: "D", label: "Day" },
                          { value: "H", label: "Hour" },
                        ].find(
                          (option) => option.value === watch("leave_unit")
                        )}
                      />
                    )}
                  />
                  {errors.leave_unit && (
                    <small className="text-danger">
                      {errors.leave_unit.message}
                    </small>
                  )}
                </Col>
                <Col md={6}>
                  <label className="col-form-label">
                    For Gender <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="for_gender"
                    control={control}
                    rules={{ required: "For gender is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={[
                          { value: "B", label: "Both" },
                          { value: "M", label: "Male" },
                          { value: "F", label: "Female" },
                        ]}
                        placeholder="Choose For Gender"
                        classNamePrefix="react-select"
                        className={`select2 ${errors.for_gender ? "is-invalid" : ""}`}
                        onChange={(option) =>
                          field.onChange(option?.value || "")
                        }
                        value={[
                          { value: "B", label: "Both" },
                          { value: "M", label: "Male" },
                          { value: "F", label: "Female" },
                        ].find(
                          (option) => option.value === watch("for_gender")
                        )}
                      />
                    )}
                  />
                  {errors.for_gender && (
                    <small className="text-danger">
                      {errors.for_gender.message}
                    </small>
                  )}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6} className="d-flex gap-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    {...register("carry_forward")}
                  />
                  <label className="col-form-label">Carry Forward</label>
                </Col>
                <Col md={6} className="d-flex gap-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    {...register("prorate_allowed")}
                  />
                  <label className="col-form-label">Prorate Allowed</label>
                </Col>
              </Row>
              {/* Status */}
              <Row className="mb-3">
                <Col md={6}>
                  <label className="col-form-label">Status</label>
                  <div className="d-flex align-items-center">
                    <div className="me-2">
                      <input
                        type="radio"
                        className="status-radio"
                        id="active"
                        value="Y"
                        {...register("is_active")}
                      />
                      <label htmlFor="active">Active</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        className="status-radio"
                        id="inactive"
                        value="N"
                        {...register("is_active")}
                      />
                      <label htmlFor="inactive">Inactive</label>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

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
