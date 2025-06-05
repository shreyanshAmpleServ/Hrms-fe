import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

export const EmployeeDept = () => {
  const data = {
    labels: [
      "UI/UX",
      "Development",
      "Management",
      "HR",
      "Testing",
      "Marketing",
      "QA",
      "Worker",
    ],
    datasets: [
      {
        label: "Employees",
        data: [80, 110, 75, 25, 60, 20, 49, 100],
        backgroundColor: "#f97316", // Tailwind orange-500
        borderRadius: 4,
        barThickness: 10, // thinner bar
        categoryPercentage: 0.5, // reduce spacing box size
        barPercentage: 0.8, // bar takes 80% of category box
      },
    ],
  };

  const options = {
    indexAxis: "y", // Horizontal Bar
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: {
          beginAtZero: true,
          stepSize: 20,
          color: "#1e293b",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y: {
        ticks: {
          color: "#1e293b",
        },
        grid: {
          drawBorder: false,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };
  return (
    <>
      <div className="row d-flex">
        {/* Activity */}
        <div className="col-lg-12 d-flex ">
          <div className="card shadow-lg w-100">
            <div className="card-body d-flex flex-column">
              <div className="row">
                <h5 className="mb-3 col-10 mt-2 fw-semibold">
                  Recent Activities
                </h5>
                <div className="col-2">
                  <Link
                    to="#"
                    className="btn btn-group border text-nowrap p-1 "
                    // data-bs-toggle="offcanvas"
                    // data-bs-target="#offcanvas_add_deal"
                  >
                    <i className="ti ti-cake me-1" />
                    <span style={{ fontSize: "12px" }}> This Week</span>
                  </Link>
                </div>
              </div>
              <hr className="border-black my-1" />
              <div className="mb-3 flex-grow-1">
                <div style={{ height: "350px" }}>
                  <Bar data={data} options={options} />
                </div>
              </div>
            </div>
            <div className="mt-3 d-flex ps-4 mb-3 align-items-center">
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#f97316",
                  marginRight: "8px",
                }}
              ></div>
              <span className="text-muted">
                No of Employees increased by{" "}
                <span className="text-success fw-bold">+20%</span> from last
                Week
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
