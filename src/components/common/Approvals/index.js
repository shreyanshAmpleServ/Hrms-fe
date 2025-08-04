import { CloseOutlined } from "@ant-design/icons";
import { Drawer } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllRequests } from "../../../redux/Request";
import Confirmation from "./Confirmation";

const ApprovalSidebarItem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("A");
  const { requests, loadingAll } = useSelector((state) => state.request);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllRequests());
  }, [dispatch]);

  const approvals = requests || [];

  const handleClose = () => {
    const element = document.getElementById("close-button");
    element?.click();
  };

  const showDrawer = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Link
        className="nav-link position-relative d-flex align-items-center justify-content-center"
        to="#"
        onClick={showDrawer}
      >
        <i className="ti ti-checklist" />
        <span className="badge bg-danger rounded-pill">{approvals.length}</span>
      </Link>

      <Drawer
        open={isOpen}
        onClose={onClose}
        headerStyle={{ display: "none" }}
        footerStyle={{ display: "none" }}
        closable={false}
        styles={{
          wrapper: {
            width: "500px",
          },
          body: {
            padding: 0,
          },
        }}
      >
        {/* Your custom header */}
        <div className="d-flex bg-white align-items-center justify-content-between p-3">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <div
                className="rounded-1 bg-primary d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                <i className="ti ti-checklist text-white fs-5"></i>
              </div>
            </div>
            <div>
              <p className="mb-0 fs-6 fw-bold text-dark">Pending Approvals</p>
              <small className="text-muted">Manage pending approvals</small>
            </div>
          </div>
          <CloseOutlined
            style={{ cursor: "pointer", fontSize: "1.2rem" }}
            onClick={onClose}
          />
        </div>

        <div
          className="p-1"
          style={{ backgroundColor: "#f8f9fa", height: "100%" }}
        >
          {approvals.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center p-5 text-center">
              <i className="ti ti-clipboard-check display-1 mb-3 text-muted opacity-50"></i>
              <h6 className="text-dark">All Caught Up!</h6>
              <p className="mb-2 small text-muted">
                No pending approvals at the moment.
              </p>
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  navigate("report/approvals");
                  onClose();
                }}
              >
                View Approval History
              </button>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {approvals.map((item) => {
                const requestType =
                  item.reference?.leave_types?.leave_type ||
                  item.request_type
                    .replace("_", " ")
                    .replace(/^\w/, (c) => c.toUpperCase());
                const requesterName =
                  item.requests_employee?.full_name || "Unknown";
                const reason = item.reference?.reason || "N/A";
                const timeAgo = moment(item.createdate).calendar();

                return (
                  <div
                    className="list-group-item card mb-0 border-0 border-bottom"
                    key={item.id}
                  >
                    {item.request_type === "leave_request" && (
                      <div className="d-flex align-items-start">
                        <div className="flex-shrink-0 me-3">
                          <div
                            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {item.requests_employee?.profile_pic ? (
                              <img
                                src={item.requests_employee?.profile_pic}
                                alt="User"
                                className="rounded-circle"
                              />
                            ) : (
                              requesterName?.[0]?.toUpperCase()
                            )}
                          </div>
                        </div>

                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <p className="mb-1 fw-semibold text-dark">
                              <strong>{requesterName}</strong> requested{" "}
                              <span className="text-primary">
                                {requestType}
                              </span>
                            </p>
                            <small className="text-muted">{timeAgo}</small>
                          </div>

                          <p className="mb-1 small text-muted">
                            Reason: {reason}
                          </p>
                          <p className="mb-2 small text-muted">
                            Leave Days :{" "}
                            {moment(item.reference?.start_date).format(
                              "DD-MM-YYYY"
                            )}{" "}
                            -{" "}
                            {moment(item.reference?.end_date).format(
                              "DD-MM-YYYY"
                            )}{" "}
                            (
                            {moment(item.reference?.end_date).diff(
                              moment(item.reference?.start_date),
                              "days"
                            ) + 1}
                            )
                          </p>

                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success rounded"
                              style={{ width: "80px" }}
                              onClick={() => {
                                setOpen(item);
                                setStatus("A");
                                handleClose();
                              }}
                            >
                              Approve
                            </button>
                            <button
                              style={{ width: "80px" }}
                              className="btn btn-sm btn-danger rounded"
                              onClick={() => {
                                setOpen(item);
                                setStatus("R");
                                handleClose();
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="d-flex justify-content-center mt-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    navigate("report/approvals");
                    onClose();
                  }}
                >
                  View Approval History
                </button>
              </div>
            </div>
          )}
        </div>
      </Drawer>
      <Confirmation
        open={open}
        setOpen={setOpen}
        setStatus={setStatus}
        status={status}
      />
    </>
  );
};

export default ApprovalSidebarItem;
