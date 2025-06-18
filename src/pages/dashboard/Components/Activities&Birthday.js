import { Avatar } from "antd";
import { useEffect, useState } from "react";
import {
  Button,
  CloseButton,
  Modal,
  Pagination,
  Placeholder,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUpcomingBirthdays } from "../../../redux/Dashboards/UpcomingBirthdays";
import { fetchUpcomingAnniversaries } from "../../../redux/Dashboards/UpcomingAnniversaries";

export const ActBirth = () => {
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [showAnniversaryModal, setShowAnniversaryModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const { upcomingBirthdays } = useSelector((state) => state.upcomingBirthdays);
  const { upcomingAnniversaries } = useSelector(
    (state) => state.upcomingAnniversaries
  );

  useEffect(() => {
    dispatch(fetchUpcomingBirthdays({ page: currentPage, limit: 10 }));
    dispatch(fetchUpcomingAnniversaries({ page: currentPage, limit: 10 }));
  }, [currentPage]);

  const renderSkeleton = () => {
    return (
      <>
        <div className="mb-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <Placeholder
                as="h6"
                animation="glow"
                className="my-2 rounded-3 ms-1"
              >
                <Placeholder xs={4} />
              </Placeholder>
              <div
                style={{ background: "rgba(0,27,177, .1)" }}
                className="row mb-2 py-1 align-items-center rounded-2 mx-1"
              >
                <div className="col-10 align-items-center gap-2 d-flex">
                  <Placeholder
                    as="div"
                    animation="glow"
                    style={{ height: "2.5rem", width: "2.5rem" }}
                    className="rounded-circle"
                  />
                  <div>
                    <Placeholder as="div" animation="glow">
                      <Placeholder xs={6} />
                    </Placeholder>
                    <Placeholder as="div" animation="glow">
                      <Placeholder xs={4} />
                    </Placeholder>
                  </div>
                </div>
                <div className="col-2">
                  <Placeholder.Button
                    animation="glow"
                    xs={12}
                    className="p-2 px-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderModalContent = (data) => {
    if (!data) return renderSkeleton();

    return (
      <>
        <Modal.Body
          className="p-1 overflow-y-auto"
          style={{ maxHeight: "400px" }}
          scrollable
        >
          {Object.keys(data?.data).map((item, index) => (
            <div key={index}>
              <h6 className="my-2 text-capitalize ms-1">{item}</h6>
              {data?.data[item]?.map((item, index) => (
                <div
                  key={index}
                  style={{ background: "rgba(0,27,177, .1)" }}
                  className="row mb-2 py-1 align-items-center rounded-2 mx-1"
                >
                  <div className="col-11 align-items-center gap-2 d-flex">
                    <Avatar
                      src={item.profile_pic}
                      alt={item.name}
                      style={{ height: "2.5rem", width: "2.5rem" }}
                      className="fs-5 bg-primary"
                    >
                      {item.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <div>
                      <div className="fw-bolder text-capitalize">
                        {item.name}
                      </div>
                      <div style={{ fontSize: ".7rem" }}>
                        {item.designation}
                      </div>
                    </div>
                  </div>
                  <div className="col-1 d-flex justify-content-end">
                    <Link to="#" className="btn btn-primary text-nowrap p-1">
                      <i className="ti ti-cake" />
                      <span style={{ fontSize: "10px", paddingLeft: "5px" }}>
                        Send
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-end p-1">
          <Pagination size="sm">
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {[...Array(data?.totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, data?.totalPages))
              }
              disabled={currentPage === data?.totalPages}
            />
          </Pagination>
        </Modal.Footer>
      </>
    );
  };

  return (
    <>
      <div className="row d-flex">
        <div className="col-lg-6">
          <div className="card shadow-sm w-100">
            <div className="d-flex flex-column">
              <div className="row d-flex align-items-center p-3">
                <h5 className="col-10 fw-semibold">Upcoming Anniversaries</h5>
                <Link
                  to="#"
                  className="col-2"
                  onClick={() => setShowAnniversaryModal(true)}
                >
                  View All
                </Link>
              </div>
              <hr className="border-secondary my-1" />
              <div className="flex-grow-1 px-2">
                {!upcomingAnniversaries?.data
                  ? renderSkeleton()
                  : upcomingAnniversaries?.data &&
                    Object.keys(upcomingAnniversaries?.data)?.map(
                      (item, index) => (
                        <div key={index}>
                          <h6 className="my-2 text-capitalize ms-1">{item}</h6>
                          {upcomingAnniversaries?.data[item]?.map(
                            (anniversary, index) => (
                              <div
                                key={index}
                                style={{ background: "rgba(0,27,177, .1)" }}
                                className="row mb-2 py-1 align-items-center rounded-2 mx-1"
                              >
                                <div className="col-10 align-items-center gap-2 d-flex">
                                  <Avatar
                                    src={anniversary.profile_pic}
                                    alt={anniversary.name}
                                    style={{
                                      height: "2.5rem",
                                      width: "2.5rem",
                                    }}
                                    className="fs-5 bg-primary"
                                  >
                                    {anniversary.name?.charAt(0)?.toUpperCase()}
                                  </Avatar>
                                  <div>
                                    <div className="fw-bolder text-capitalize">
                                      {anniversary.name}
                                    </div>
                                    <div style={{ fontSize: ".7rem" }}>
                                      {anniversary.designation}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-2">
                                  <Link
                                    to="#"
                                    className="btn btn-primary text-nowrap p-1"
                                  >
                                    <i className="ti ti-cake" />
                                    <span
                                      style={{
                                        fontSize: "10px",
                                        paddingLeft: "5px",
                                      }}
                                    >
                                      Send
                                    </span>
                                  </Link>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )
                    )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-sm w-100">
            <div className="d-flex flex-column">
              <div className="row d-flex align-items-center p-3">
                <h5 className="col-10 fw-semibold">Upcoming Birthdays</h5>
                <Link
                  to="#"
                  className="col-2"
                  onClick={() => setShowBirthdayModal(true)}
                >
                  View All
                </Link>
              </div>
              <hr className="border-secondary my-1" />
              <div className="flex-grow-1 px-2">
                {!upcomingBirthdays?.data
                  ? renderSkeleton()
                  : upcomingBirthdays?.data &&
                    Object.keys(upcomingBirthdays?.data)?.map((item, index) => (
                      <div key={index}>
                        <h6 className="my-2 text-capitalize ms-1">{item}</h6>
                        {upcomingBirthdays?.data[item]?.map(
                          (birthday, index) => (
                            <div
                              key={index}
                              style={{ background: "rgba(0,27,177, .1)" }}
                              className="row mb-2 py-1 align-items-center rounded-2 mx-1"
                            >
                              <div className="col-10 align-items-center gap-2 d-flex">
                                <Avatar
                                  src={birthday.profile_pic}
                                  alt={birthday.name}
                                  style={{ height: "2.5rem", width: "2.5rem" }}
                                  className="fs-5 bg-primary"
                                >
                                  {birthday.name?.charAt(0)?.toUpperCase()}
                                </Avatar>
                                <div>
                                  <div className="fw-bolder text-capitalize">
                                    {birthday.name}
                                  </div>
                                  <div style={{ fontSize: ".7rem" }}>
                                    {birthday.designation}
                                  </div>
                                </div>
                              </div>
                              <div className="col-2">
                                <Link
                                  to="#"
                                  className="btn btn-primary text-nowrap p-1"
                                >
                                  <i className="ti ti-cake" />
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      paddingLeft: "5px",
                                    }}
                                  >
                                    Send
                                  </span>
                                </Link>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showBirthdayModal}
        onHide={() => setShowBirthdayModal(false)}
        centered
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>Upcoming Birthdays</Modal.Title>
          <CloseButton onClick={() => setShowBirthdayModal(false)} />
        </Modal.Header>
        {renderModalContent(upcomingBirthdays)}
      </Modal>
      <Modal
        show={showAnniversaryModal}
        onHide={() => setShowAnniversaryModal(false)}
        centered
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>Upcoming Anniversaries</Modal.Title>
          <CloseButton onClick={() => setShowAnniversaryModal(false)} />
        </Modal.Header>
        {renderModalContent(upcomingAnniversaries)}
      </Modal>
    </>
  );
};
