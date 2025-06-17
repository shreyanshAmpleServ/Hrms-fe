import { Link } from "react-router-dom";
import image1 from "../../../assets/avatar1.webp";
import { Avatar } from "antd";
import { Placeholder } from "react-bootstrap";

export const ActBirth = ({ upcomingBirthdays, upcomingAnniversaries }) => {
  const renderSkeleton = () => {
    return (
      <>
        <div className="mb-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <>
              <Placeholder
                as="h6"
                animation="glow"
                className="my-2 rounded-3 ms-1"
              >
                <Placeholder xs={4} />
              </Placeholder>{" "}
              <div
                key={index}
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
            </>
          ))}
        </div>
      </>
    );
  };

  console.log(upcomingAnniversaries);
  return (
    <>
      <div className="row d-flex">
        <div className="col-lg-6">
          <div className="card shadow-sm w-100">
            <div className="d-flex flex-column">
              <div className="row d-flex align-items-center p-3">
                <h5 className="col-10 fw-semibold">Upcoming Anniversaries</h5>
                <Link to="#" className="col-2">
                  View All
                </Link>
              </div>
              <hr className="border-secondary my-1" />
              <div className="flex-grow-1 px-2">
                {!upcomingAnniversaries
                  ? renderSkeleton()
                  : upcomingAnniversaries &&
                    Object.keys(upcomingAnniversaries)?.map((item, index) => (
                      <div key={index}>
                        <h6 className="my-2 text-capitalize ms-1">{item}</h6>
                        {upcomingAnniversaries[item]?.map(
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
                                  style={{ height: "2.5rem", width: "2.5rem" }}
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
                                  className="btn btn-dark text-nowrap p-0 px-1"
                                >
                                  <i className="ti ti-cake" />
                                  <span style={{ fontSize: "10px" }}>
                                    {" "}
                                    Send
                                  </span>
                                </Link>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ))}{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-sm w-100">
            <div className="d-flex flex-column">
              <div className="row d-flex align-items-center p-3">
                <h5 className="col-10 fw-semibold">Upcoming Birthdays</h5>
                <Link to="#" className="col-2">
                  View All
                </Link>
              </div>
              <hr className="border-secondary my-1" />
              <div className="flex-grow-1 px-2">
                {!upcomingBirthdays
                  ? renderSkeleton()
                  : upcomingBirthdays &&
                    Object.keys(upcomingBirthdays)?.map((item, index) => (
                      <div key={index}>
                        <h6 className="my-2 text-capitalize ms-1">{item}</h6>
                        {upcomingBirthdays[item]?.map((birthday, index) => (
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
                                className="btn btn-dark text-nowrap p-0 px-1"
                              >
                                <i className="ti ti-cake" />
                                <span style={{ fontSize: "10px" }}> Send</span>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
