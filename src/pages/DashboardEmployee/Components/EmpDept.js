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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title);

export const EmployeeDept = ({ data }) => {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Employees",
        data: data?.values || [],
        backgroundColor: "#f97316",
        borderRadius: 4,
        barThickness: 10,
        categoryPercentage: 0.5,
        barPercentage: 0.8,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { beginAtZero: true, stepSize: 20, color: "#1e293b" },
        grid: { drawOnChartArea: false },
      },
      y: { ticks: { color: "#1e293b" }, grid: { drawBorder: false } },
    },
    animation: { duration: 1000 },
  };
  return (
    <>
      <div className="row d-flex">
        <div className="col-lg-12 d-flex ">
          <div className="card shadow-sm w-100">
            <div className="d-flex flex-column">
              <div className="row align-items-center p-3">
                <h5 className="col-10 fw-semibold">Employee By Department</h5>
              </div>
              <hr className="border-secondary my-1" />
              <div className="mb-3 flex-grow-1 p-2">
                <div style={{ minHeight: "350px" }}>
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
