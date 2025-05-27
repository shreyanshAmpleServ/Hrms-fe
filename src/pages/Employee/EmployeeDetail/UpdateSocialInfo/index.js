import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateEmployee } from "../../../../redux/Employee";
const UpdateSocialInfo = ({ employeeDetail }) => {
  const { loading } = useSelector((state) => state.employee);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      linkedin: employeeDetail?.linkedin || "https://www.linkedin.com/",
      twitter: employeeDetail?.twitter || "https://www.twitter.com/",
      facebook: employeeDetail?.facebook || "https://www.facebook.com/",
      instagram: employeeDetail?.instagram || "https://www.instagram.com/",
    },
  });

  useEffect(() => {
    if (employeeDetail) {
      reset({
        linkedin: employeeDetail?.linkedin || "https://www.linkedin.com/",
        twitter: employeeDetail?.twitter || "https://www.twitter.com/",
        facebook: employeeDetail?.facebook || "https://www.facebook.com/",
        instagram: employeeDetail?.instagram || "https://www.instagram.com/",
      });
    } else {
      reset({
        linkedin: "https://www.linkedin.com/",
        twitter: "https://www.twitter.com/",
        facebook: "https://www.facebook.com/",
        instagram: "https://www.instagram.com/",
      });
    }
  }, [employeeDetail, reset]);

  const onSubmit = (data) => {
    const closeButton = document.getElementById(
      "close_btn_update_social_info_modal"
    );
    const formData = new FormData();
    if (employeeDetail) {
      formData.append("id", employeeDetail.id);
      formData.append("social_medias", JSON.stringify(data));
      dispatch(updateEmployee(formData));
    }
    reset();
    closeButton.click();
  };

  return (
    <div className="modal fade" id="update_social_info_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Social Info</h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_update_social_info_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  {/* LinkedIn */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      LinkedIn <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.linkedin ? "is-invalid" : ""}`}
                      placeholder="Enter LinkedIn"
                      {...register("linkedin", {})}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  {/* Twitter */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      Twitter <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.twitter ? "is-invalid" : ""}`}
                      placeholder="Enter Twitter"
                      {...register("twitter", {})}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  {/* Facebook */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      Facebook <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.facebook ? "is-invalid" : ""}`}
                      placeholder="Enter Facebook"
                      {...register("facebook", {})}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  {/* Instagram */}
                  <div className="mb-2">
                    <label className="col-form-label">
                      Instagram <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.instagram ? "is-invalid" : ""}`}
                      placeholder="Enter Instagram"
                      {...register("instagram", {})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <div className="d-flex align-items-center justify-content-end m-0">
                <Link
                  to="#"
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                  //onClick={onClose}
                >
                  Cancel
                </Link>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary"
                >
                  {loading
                    ? employeeDetail
                      ? "Updating..."
                      : "Creating..."
                    : employeeDetail
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSocialInfo;
