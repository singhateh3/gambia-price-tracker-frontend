import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

export default function LineChart({ prices }) {
  const sorted = [...prices].sort(
    (a, b) => new Date(a.recorded_at) - new Date(b.recorded_at),
  );

  const data = {
    labels: sorted.map((p) => p.recorded_at),
    datasets: [
      {
        label: "Price (GMD)",
        data: sorted.map((p) => p.amount),
        borderColor: "#378ADD",
        backgroundColor: "#E6F1FB",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#378ADD",
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: {
      y: {
        grid: { color: "#f3f4f6" },
        ticks: { color: "#9ca3af", font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#9ca3af", font: { size: 11 } },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-4">
        Price trend over time
      </h3>
      <Line data={data} options={options} />
    </div>
  );
}
