import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BarChart({ prices }) {
  const data = {
    labels: prices.map((p) => p.market.name),
    datasets: [
      {
        label: "Price (GMD)",
        data: prices.map((p) => p.amount),
        backgroundColor: "#1D9E75",
        borderRadius: 6,
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
        Price by market
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
}
