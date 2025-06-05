import { Link } from "react-router-dom";
import image1 from "../../../assets/avatar1.webp";

export const ActBirth = () => {
  const notifications = [
    {
      image: "image1.jpg", // Path to the image
      name: "Matt Morgan",
      project: "Added new project HRMS Dashboard",
      time: "5:30 PM",
    },
    {
      image: "image2.jpg",
      name: "John Doe",
      project: "Completed the Marketing Plan",
      time: "3:00 PM",
    },
    {
      image: "image3.jpg",
      name: "Jane Smith",
      project: "Reviewed User Stories for the App",
      time: "1:15 PM",
    },
    {
      image: "image1.jpg", // Path to the image
      name: "Matt Morgan",
      project: "Added new project HRMS Dashboard",
      time: "5:30 PM",
    },
    {
      image: "image2.jpg",
      name: "John Doe",
      project: "Completed the Marketing Plan",
      time: "3:00 PM",
    },
    {
      image: "image3.jpg",
      name: "Jane Smith",
      project: "Reviewed User Stories for the App",
      time: "1:15 PM",
    },
    {
      image: "image1.jpg", // Path to the image
      name: "Matt Morgan",
      project: "Added new project HRMS Dashboard",
      time: "5:30 PM",
    },
    {
      image: "image2.jpg",
      name: "John Doe",
      project: "Completed the Marketing Plan",
      time: "3:00 PM",
    },
    {
      image: "image3.jpg",
      name: "Jane Smith",
      project: "Reviewed User Stories for the App",
      time: "1:15 PM",
    },
  ];
  const data = [
    {
      date: "Today",
      notifications: [
        {
          name: "Matt Morgan",
          jobTitle: "Project Manager", // Job title instead of project description
          image: "image1.jpg", // Image URL can be dynamic
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

  return (
    <>
      <div className="row d-flex">
        {/* Activity */}
        <div className="col-lg-6 d-flex min-vh-50">
          <div className="card shadow-lg w-100">
            <div className="card-body d-flex flex-column">
              <div className="row">
                <h5 className="mb-3 col-8 mt-2 fw-semibold">
                  Recent Activities
                </h5>
                <Link
                  to="#"
                  className="btn col-4"
                  // data-bs-toggle="offcanvas"
                  // data-bs-target="#offcanvas_add_deal"
                >
                  View All
                </Link>
              </div>
              <hr className="border-black my-1" />
              <div className="mb-3 flex-grow-1">
                {notifications.map((notification, index) => (
                  <div key={index} className="row mb-3">
                    <div className="col-10 align-items-center gap-2 d-flex">
                      <img
                        src={image1}
                        alt="Logo"
                        style={{ height: "2.5rem", width: "2.5rem" }}
                        className="preview rounded-circle"
                      />
                      <div>
                        <div className="h6">{notification.name}</div>
                        <div style={{ fontSize: ".7rem" }}>
                          {notification.project}
                        </div>
                      </div>
                    </div>
                    <div className="col-2 p-0 text-nowrap fw-bolder mt-2">
                      {notification.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Birthday */}
        <div className="col-lg-6 d-flex min-vh-50">
          <div className="card shadow-lg w-100">
            <div className="card-body d-flex flex-column">
              <div className="row">
                <h5 className="mb-3 col-8 mt-2 fw-semibold">Birthday</h5>
                <Link
                  to="#"
                  className="btn col-4"
                  // data-bs-toggle="offcanvas"
                  // data-bs-target="#offcanvas_add_deal"
                >
                  View All
                </Link>
              </div>
              <hr className="border-black my-1" />
              <div className="mb-3 flex-grow-1">
                {data?.map((item, index) => (
                  <div key={index}>
                    <div className="h6 my-2 ms-1">{item.date}</div>
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
                            // data-bs-toggle="offcanvas"
                            // data-bs-target="#offcanvas_add_deal"
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
