import { Link } from "react-router-dom";
import image1 from "../../../assets/avatar1.webp";

export const ActBirth = () => {
  const data = [
    {
      date: "Today",
      notifications: [
        {
          name: "Matt Morgan",
          jobTitle: "Project Manager",
          image: "image1.jpg",
        },
        {
          name: "John Doe",
          jobTitle: "Marketing Specialist",
          image: "image2.jpg",
        },
      ],
    },
    {
      date: "Tomorrow",
      notifications: [
        {
          name: "Jane Smith",
          jobTitle: "UX Designer",
          image: "image3.jpg",
        },
        {
          name: "Jane Smith",
          jobTitle: "UX Designer",
          image: "image3.jpg",
        },
        {
          name: "Chris White",
          jobTitle: "Software Engineer",
          image: "image4.jpg",
        },
      ],
    },
    {
      date: "25 Jan 2025",
      notifications: [
        {
          name: "Jane Smith",
          jobTitle: "UX Designer",
          image: "image3.jpg",
        },
        {
          name: "Chris White",
          jobTitle: "Software Engineer",
          image: "image4.jpg",
        },
      ],
    },
  ];
  const anniversaries = [
    {
      date: "Today",
      notifications: [
        {
          name: "John Doe",
          jobTitle: "Marketing Specialist",
          image: "image1.jpg",
        },
        {
          name: "Jane Smith",
          jobTitle: "UX Designer",
          image: "image2.jpg",
        },
      ],
    },
    {
      date: "Tomorrow",
      notifications: [
        {
          name: "Chris White",
          jobTitle: "Software Engineer",
          image: "image3.jpg",
        },
        {
          name: "Matt Morgan",
          jobTitle: "Project Manager",
          image: "image3.jpg",
        },
        {
          name: "John Doe",
          jobTitle: "Marketing Specialist",
          image: "image4.jpg",
        },
      ],
    },
    {
      date: "25 Jan 2025",
      notifications: [
        {
          name: "Matt Morgan",
          jobTitle: "Project Manager",
          image: "image4.jpg",
        },
      ],
    },
  ];

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
                {data?.map((item, index) => (
                  <div key={index}>
                    <h6 className="my-2 ms-1">{item.date}</h6>
                    {item?.notifications.map((notification, index) => (
                      <div
                        key={index}
                        style={{ background: "rgba(0,27,177, .1)" }}
                        className="row mb-2 py-1 align-items-center rounded-2 mx-1"
                      >
                        <div className="col-10 align-items-center gap-2 d-flex">
                          <img
                            src={image1}
                            alt="Logo"
                            style={{ height: "2.5rem", width: "2.5rem" }}
                            className="preview rounded-circle"
                          />
                          <div>
                            <div className="fw-bolder">{notification.name}</div>
                            <div style={{ fontSize: ".7rem" }}>
                              {notification.jobTitle}
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
                {anniversaries?.map((item, index) => (
                  <div key={index}>
                    <h6 className="my-2 ms-1">{item.date}</h6>
                    {item?.notifications.map((notification, index) => (
                      <div
                        key={index}
                        style={{ background: "rgba(0,27,177, .1)" }}
                        className="row mb-2 py-1 align-items-center rounded-2 mx-1"
                      >
                        <div className="col-10 align-items-center gap-2 d-flex">
                          <img
                            src={image1}
                            alt="Logo"
                            style={{ height: "2.5rem", width: "2.5rem" }}
                            className="preview rounded-circle"
                          />
                          <div>
                            <div className="fw-bolder">{notification.name}</div>
                            <div style={{ fontSize: ".7rem" }}>
                              {notification.jobTitle}
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
