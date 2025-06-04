import { useDispatch } from "react-redux";
import { deleteJobPosting } from "../../../redux/JobPosting";

const DeleteConfirmation = ({ showModal, setShowModal, JobPostingId }) => {
  const dispatch = useDispatch();
  const handleDeleteJobPosting = () => {
    if (JobPostingId) {
      dispatch(deleteJobPosting(JobPostingId));
      setShowModal(false);
    }
  };

  return (
    <>
      {showModal && (
        <div
          className="modal fade show"
          id="delete_helpdesk_ticket"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="text-center">
                  <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
                    <i className="ti ti-trash-x fs-36 text-danger" />
                  </div>
                  <h4 className="mb-2">Remove Notifications?</h4>
                  <p className="mb-0">
                    Are you sure you want to remove <br /> the Notifications
                    you selected?
                  </p>
                  <div className="d-flex align-items-center justify-content-center mt-4">
                    <button
                      className="btn btn-light me-2"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleDeleteJobPosting}
                    >
                      Yes, Delete it
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteConfirmation;
