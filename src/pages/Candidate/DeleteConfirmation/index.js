import { useDispatch } from "react-redux";
import { deleteCandidate } from "../../../redux/Candidate";

const DeleteConfirmation = ({ showModal, setShowModal, candidateId }) => {
  const dispatch = useDispatch();
  const handleDeleteCandidate = () => {
    if (candidateId) {
      dispatch(deleteCandidate(candidateId));
      setShowModal(false);
    }
  };

  return (
    <>
      {showModal && (
        <div
          className="modal fade show"
          id="delete_candidate"
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
                  <h4 className="mb-2">Remove Candidate?</h4>
                  <p className="mb-0">
                    Are you sure you want to remove <br /> the candidate you
                    selected?
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
                      onClick={handleDeleteCandidate}
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
