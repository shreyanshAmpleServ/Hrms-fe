import { Link } from "react-router-dom";
import image1 from "../../../assets/avatar1.webp";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip } from "chart.js";
Chart.register(ArcElement, Tooltip);

const collapseStyle = {
    height: "1.8rem",
    width: "1.8rem",
    objectFit: "cover",
    marginLeft: "-6"
  }

export const Attendance = () => {
    const totalAttendance = 120;
    const data = {
      labels: ["Late", "Present", "Permission", "Absent"],
      datasets: [
        {
          data: [21, 59, 2, 15],
          backgroundColor: ["#003f5c", "#00cc66", "#ffcc00", "#ff0000"],
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
          cutout: "65%",
        },
      ],
    };
  
    const options = {
     responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "black",
        font: {
          weight: 600,
        },
      },
    },
    title: {
      display: true,
      color: "black",
      font: {
        weight: 600,
      },
    },
  },
    };
//   const data = [
//     {
//       date: 'Today',
//       notifications: [
//         {
//           name: 'Matt Morgan',
//           jobTitle: 'Project Manager',  // Job title instead of project description
//           image: 'image1.jpg'  // Image URL can be dynamic
//         },
//         {
//           name: 'John Doe',
//           jobTitle: 'Marketing Specialist',
//           image: 'image2.jpg'
//         }
//       ]
//     },
//     {
//       date: 'Tomorrow',
//       notifications: [
//         {
//           name: 'Jane Smith',
//           jobTitle: 'UX Designer',
//           image: 'image3.jpg'
//         },
//         {
//           name: 'Jane Smith',
//           jobTitle: 'UX Designer',
//           image: 'image3.jpg'
//         },
//         {
//           name: 'Chris White',
//           jobTitle: 'Software Engineer',
//           image: 'image4.jpg'
//         }
//       ]
//     },
//     {
//       date: '25 Jan 2025',
//       notifications: [
//         {
//           name: 'Jane Smith',
//           jobTitle: 'UX Designer',
//           image: 'image3.jpg'
//         },
//         {
//           name: 'Chris White',
//           jobTitle: 'Software Engineer',
//           image: 'image4.jpg'
//         }
//       ]
//     }
//   ];
  
  return (
    <>
<div className="row d-flex">
  {/* Activity */}
  <div className="col-lg-6 d-flex min-vh-50">
  <div className="card shadow-lg w-100">
       <div className="card-body d-flex flex-column">
         <div className="row">
           <h5 className="mb-3 col-8 mt-2 fw-semibold">
             Attendance Overview
           </h5>
                     <div className="col-2">
                               <Link
                                 to="#"
                                 className="btn btn-group border text-nowrap p-1 "
                                 // data-bs-toggle="offcanvas"
                                 // data-bs-target="#offcanvas_add_deal"
                               >
                                 <i className="ti ti-calendar me-1" />
                                 <span style={{ fontSize: "12px" }}> Today</span>
                               </Link>
                             </div>
         </div>
         <hr className="border-black my-1" />
         <div className="mb-3 flex-grow-1">
         <div className="position-relative">
        <Doughnut data={data} options={options} />
        <div style={{top:"70%",left:"50%"}}  className="position-absolute  translate-middle text-center">
          <div className="text-muted h5 small">Total Attendance</div>
          <div className="fw-bold fs-4">{totalAttendance}</div>
        </div>
      </div>

      <div className="mt-4">
        <h6>Status</h6>
        <ul className="list-unstyled">
          <li>
          <span className="d-flex justify-content-between" ><span><span className="badge bg-success rounded-circle me-2">&nbsp;</span> Present</span><span className="fw-bolder">- 59%</span></span> </li>
          <li>
          <span className="d-flex justify-content-between"><span><span className="badge rounded-circle bg-dark me-2">&nbsp;</span>Late</span><span className="fw-bolder">- 21%</span></span> </li>
          <li>
          <span className="d-flex justify-content-between"><span><span className="badge rounded-circle bg-warning text-dark me-2">&nbsp;</span>Permission</span><span className="fw-bolder">- 12%</span></span></li>
          <li>
          <span className="d-flex justify-content-between"><span> <span className="badge rounded-circle bg-danger me-2">&nbsp;</span>Absent</span><span className="fw-bolder">- 15%</span></span> </li>
        </ul>
      </div>

      <div className="d-flex bg-dark-subtle justify-content-between align-items-center  p-2 rounded mt-3">
      <div className="d-flex align-items-center gap-2" >
  <strong>Total Absentees</strong>
  <div className="d-flex align-items-center mt-1">
    <div className="d-flex align-items-center" style={{ position: "relative" }}>
      <img
        src={image1}
        className="rounded-circle border"
        alt="user"
        style={{
          height: "1.6rem",
          width: "1.6rem",
          objectFit: "cover",
          zIndex: 0,
          marginLeft: "0"
        }}
      />
      <img
        src={image1}
        className="rounded-circle border"
        alt="user"
        style={{
          height: "1.6rem",
          width: "1.6rem",
          objectFit: "cover",
          zIndex: 1,
          marginLeft: "-0.6rem"
        }}
      />
      <img
        src={image1}
        className="rounded-circle border"
        alt="user"
        style={{
          height: "1.6rem",
          width: "1.6rem",
          objectFit: "cover",
          zIndex: 2,
          marginLeft: "-0.6rem"
        }}
      />
      <span
        className="badge bg-warning text-dark rounded-circle d-flex justify-content-center align-items-center"
        style={{
          height: "1.6rem",
          width: "1.6rem",
          marginLeft: "-0.6rem",
          zIndex: 3
        }}
      >
        +1
      </span>
    </div>
  </div>
</div>

        <Link to="#" className=" btn btn-link ">View Details</Link>
      </div>
         </div>
       </div>
     </div>
  </div>
  
  {/* Birthday */}
  <div className="col-lg-6 d-flex min-vh-50">
    <div className="card shadow-lg w-100">
      <div className="card-body d-flex flex-column">
        <div className="row">
          <h5 className="mb-3 col-8 mt-2 fw-semibold">
            Check-in/Out
          </h5>
                   <div className="col-2">
                             <Link
                               to="#"
                               className="btn btn-group border text-nowrap p-1 "
                               // data-bs-toggle="offcanvas"
                               // data-bs-target="#offcanvas_add_deal"
                             >
                               <i className="ti ti-calendar me-1" />
                               <span style={{ fontSize: "12px" }}> Today</span>
                             </Link>
                           </div>
        </div>
        <hr className="border-black my-1" />
        {/* <div className="mb-3 flex-grow-1">
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
        </div> */}
      </div>
    </div>
  </div>
</div>

    </>
  );
};
