import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addLeaveType, updateLeaveType } from "../../../../../redux/LeaveType";

const AddEditModal = ({ mode = "add", initialData = null, setSelected }) => {
  const { loading } = useSelector((state) => state.leaveType);
  dayjs.extend(customParseFormat);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        leave_type: initialData.leave_type || "",
        carry_forward: initialData?.carry_forward || false,
      });
    } else {
      reset({ leave_type: "", carry_forward: false });
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
          carry_forward: data?.carry_forward || false,
        })
      );
    } else if (mode === "edit" && initialData) {
      dispatch(
        updateLeaveType({
          id: initialData.id,
          reqData: {
            leave_type: data.leave_type,
            carry_forward: data?.carry_forward || false,
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
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add New Leave Type" : "Edit Leave Type"}
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
              {/* Leave Type */}
              <div className="mb-3">
                <label className="col-form-label">
                  Leave Type <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.leave_type ? "is-invalid" : ""}`}
                  placeholder="Enter Leave Type"
                  {...register("leave_type", {
                    required: "Leave type is required.",
                    minLength: {
                      value: 3,
                      message: "Leave type must be at least 3 characters.",
                    },
                  })}
                />
                {errors.leave_type && (
                  <small className="text-danger">
                    {errors.leave_type.message}
                  </small>
                )}
              </div>

              <div className="d-flex gap-2">
                <label className="col-form-label">Carry Forward</label>
                <input
                  type="checkbox"
                  className="form-check-input"
                  {...register("carry_forward")}
                />
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
