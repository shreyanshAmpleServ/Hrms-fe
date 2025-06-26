import React from "react";
import { useSelector } from "react-redux";
const UpdateProfilePicture = ({
  candidateDetail,
  onSubmit,
  image,
  setImage,
  handleImageUploadOpen,
}) => {
  const { loading } = useSelector((state) => state.candidate);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
    handleImageUploadOpen(e.target.files[0]);
  };
  return (
    <div className="modal fade" id="update_profile_picture_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Edit Profile Picture ({candidateDetail?.candidate_code})
            </h5>
            <button
              className="btn-close custom-btn-close border p-1 me-0 text-dark"
              data-bs-dismiss="modal"
              aria-label="Close"
              id="close_btn_update_profile_picture_modal"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body p-1">
              <div className="d-flex justify-content-center">
                <img
                  src={
                    image
                      ? URL.createObjectURL(image)
                      : candidateDetail?.profile_pic
                  }
                  alt="profile"
                  height={300}
                  width={300}
                  className="aspect-square object-fit-cover"
                />
              </div>
            </div>
            {/* Footer */}
            <div className="modal-footer">
              <div className="d-flex align-items-center justify-content-end m-0">
                <label
                  className="btn btn-light me-2"
                  data-bs-dismiss="modal"
                  onClick={() => setImage(null)}
                >
                  <input
                    type="file"
                    name="profile_pic"
                    onChange={handleImageUpload}
                    hidden
                  />
                  Change
                </label>
                <button
                  disabled={loading}
                  type="submit"
                  className="btn btn-primary"
                >
                  {loading
                    ? candidateDetail
                      ? "Updating..."
                      : "Creating..."
                    : candidateDetail
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

export default UpdateProfilePicture;
