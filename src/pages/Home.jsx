import { useEffect, useState } from "react";
import { getCrops, getPrices, getPricesByCrop } from "../api";
import PriceTable from "../components/PriceTable";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import { Link } from "react-router-dom";

export default function Home() {
  const [crops, setCrops] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCrops().then((res) => {
      setCrops(res.data);
      setSelectedCrop(res.data[0]?.id);
    });
    getPrices().then((res) => {
      setPrices(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedCrop) {
      getPricesByCrop(selectedCrop).then((res) => setPrices(res.data));
    }
  }, [selectedCrop]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-gray-800">
            🌾 Gambia Price Tracker
          </h1>
          <p className="text-xs text-gray-400">
            Live crop prices across The Gambia
          </p>
        </div>
        <Link
          to="/login"
          className="text-xs text-green-700 border border-green-700 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors"
        >
          Admin
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Crop selector */}
            <div className="mb-6">
              <label className="text-sm text-gray-600 mb-1 block">
                Select crop
              </label>
              <select
                onChange={(e) => setSelectedCrop(e.target.value)}
                value={selectedCrop || ""}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {crops.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price table */}
            <PriceTable prices={prices} />

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <BarChart prices={prices} />
              <LineChart prices={prices} />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-8">
        Built for farmers and traders in The Gambia · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
