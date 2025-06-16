import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

const empStatusOptions = [
  { label: "Active", value: "Active" },
  { label: "Probation", value: "Probation" },
  { label: "On Hold", value: "On Hold" },
  { label: "Resigned", value: "Resigned" },
  { label: "Notice Period", value: "Notice Period" },
  { label: "Terminated", value: "Terminated" },
  { label: "Retired", value: "Retired" },
  { label: "Absconded", value: "Absconded" },
  { label: "Inactive", value: "Inactive" },
  { label: "Exited", value: "Exited" },
];

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

export const EmployeeByStatus = ({ data }) => {
  const chartData = {
    labels: data?.data?.labels || [],
    datasets: [
      {
        label: "Employees",
        data: data?.data?.values || [],
        backgroundColor: [
          "#4CAF50", // Active
          "#FFC107", // Probation
          "#2196F3", // On Hold
          "#9C27B0", // Resigned
          "#FF9800", // Notice Period
          "#F44336", // Terminated
          "#607D8B", // Retired
          "#795548", // Absconded
          "#9E9E9E", // Inactive
          "#E91E63", // Exited
        ],
        borderRadius: 4,
        barThickness: 30,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
      },
    ],
  };
  console.log(data?.data?.values);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: {
          beginAtZero: true,
          stepSize: 10,
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
        <div className="col-lg-12 d-flex ">
          <div className="card shadow-sm w-100">
            <div className="d-flex flex-column">
              <div className="row align-items-center p-3">
                <h5 className="col-10 fw-semibold">Employee By Status</h5>
              </div>
              <hr className="border-secondary my-1" />
              <div className="mb-3 flex-grow-1 px-3 py-2">
                <div style={{ minHeight: "400px" }}>
                  <Bar data={chartData} options={options} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
