import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addLeaveType, updateLeaveType } from "../../../../../redux/LeaveType";

const AddEditModal = ({ mode = "add", initialData = null }) => {
  const { loading } = useSelector((state) => state.leaveType);
  dayjs.extend(customParseFormat);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        leave_type: initialData.leave_type || "",
        carry_forward:initialData?.carry_forward || ""
      });
    } else {
      reset({
        name: "",
        carry_forward:true,
      });
    }
  }, [mode, initialData, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_add_edit_leave_type_modal",
    );
    console.log("DAta",data)
    if (mode === "add") {
      // Dispatch Add action
      dispatch(
        addLeaveType({
          leave_type: data.leave_type,
           carry_forward:data?.carry_forward == "true" ? Boolean(true)  : false,
        }),
      );
    } else if (mode === "edit" && initialData) {
      // Dispatch Edit action
      dispatch(
        updateLeaveType({
          id: initialData.id,
          reqData: { 
            leave_type: data.leave_type,
          carry_forward:data?.carry_forward == "true" ? Boolean(true)  : false  },
        }),
      );
    }
    reset(); // Clear the form
    closeButton.click();
  };

  return (
    <div className="modal fade" id="add_edit_leave_type_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Shift" : "Edit Shift"}
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
              {/* Shift Name */}
              <div className="mb-3">
                <label className="col-form-label">
                  Leave Type <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  {...register("leave_type", {
                    required: "Shift name is required.",
                    minLength: {
                      value: 3,
                      message: "Shift name must be at least 3 characters.",
                    },
                  })}
                />
                {errors.leave_type && (
                  <small className="text-danger">{errors.leave_type.message}</small>
                )}
              </div>
              {/* <div className="row col-12">
              <div className="mb-3 col-lg-6">
                <label className="col-form-label">
                  Start Time <span className="text-danger">*</span>
                </label>
                <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-clock-hour-10" />
                    </span>
                    <Controller
                      name="start_time"
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          {...field}
                          placeholder="Select Time"
                          className="form-control"
                          value={
                            field.value ? dayjs(field.value, "HH:mm:ss") : null
                          }
                          selected={field.value}
                          onChange={field.onChange}
                          dateFormat="HH:mm:ss"
                        />
                      )}
                    />
                  </div>
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>
              <div className="mb-3 col-lg-6">
                <label className="col-form-label">
                  End Time <span className="text-danger">*</span>
                </label>
                <div className="mb-3 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-clock-hour-10" />
                    </span>
                    <Controller
                      name="end_time"
                      control={control}
                      render={({ field }) => (
                        <TimePicker
                          {...field}
                          placeholder="Select Time"
                          className="form-control"
                          value={
                            field.value ? dayjs(field.value, "HH:mm:ss") : null
                          }
                          selected={field.value}
                          onChange={field.onChange}
                          dateFormat="HH:mm:ss"
                        />
                      )}
                    />
                  </div>
                {errors.name && (
                  <small className="text-danger">{errors.name.message}</small>
                )}
              </div>
              </div> */}

              {/* Status */}
              <div className="mb-0">
                <label className="col-form-label">isCarryForword</label>
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <input
                      type="radio"
                      className="status-radio"
                      id="active"
                      value={true}
                      {...register("carry_forward", {
                        required: "Carry forword status is required.",
                      })}
                    />
                    <label htmlFor="active">True</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      className="status-radio"
                      id="inactive"
                      value={false}
                      {...register("carry_forward")}
                    />
                    <label htmlFor="inactive">False</label>
                  </div>
                </div>
                {errors.carry_forward && (
                  <small className="text-danger">{errors.carry_forward.message}</small>
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
