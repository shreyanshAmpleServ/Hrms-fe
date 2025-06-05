import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SalesOverview = () => {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Income",
        data: [40, 30, 45, 80, 85, 90, 80, 80, 80, 85, 20, 80],
        backgroundColor: "#f97316",
        borderRadius: 4,
      },
      {
        label: "Expenses",
        data: [60, 70, 55, 20, 15, 10, 20, 20, 20, 15, 80, 20],
        backgroundColor: "#f1f5f9",
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 20 },
        grid: { borderDash: [5, 5], color: "#ccc" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="card-body p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Sales Overview</h5>
        <div>All Departments ▼</div>
      </div>
      <p className="text-end text-muted" style={{ fontSize: "0.8rem" }}>
        Last Updated at 11:30PM
      </p>
      <div style={{ height: "250px" }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default SalesOverview;
