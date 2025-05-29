import { useDispatch } from "react-redux";
import { deleteprobationReview } from "../../../redux/ProbationReview";

const DeleteConfirmation = ({ showModal, setShowModal, probationReviewId }) => {
  const dispatch = useDispatch();
  const handleDeleteprobationReview = () => {
    if (probationReviewId) {
      dispatch(deleteprobationReview(probationReviewId));
      setShowModal(false);
    }
  };

  return (
    <>
      {showModal && (
        <div
          className="modal fade show"
          id="delete_time_sheet"
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
                  <h4 className="mb-2">Remove probation ReviewId?</h4>
                  <p className="mb-0">
                    Are you sure you want to remove <br /> the probation Review
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
                      onClick={handleDeleteprobationReview}
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
