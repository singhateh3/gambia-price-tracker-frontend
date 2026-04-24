import { useEffect, useState } from "react";
import { getCrops, getPrices, getPricesByCrop } from "../api";
import PriceTable from "../components/PriceTable";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";

export default function Home() {
  const [crops, setCrops] = useState([]);
  const [prices, setPrices] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    getCrops().then((res) => {
      setCrops(res.data);
      setSelectedCrop(res.data[0].id);
    });
    getPrices().then((res) => setPrices(res.data));
  }, []);

  useEffect(() => {
    if (selectedCrop) {
      getPricesByCrop(selectedCrop).then((res) => setPrices(res.data));
    }
  }, [selectedCrop]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibld text-gray-800">
            Gambia crop price tracker
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Live market prices across The Gambia
          </p>
        </div>

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

        <PriceTable prices={prices} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <BarChart prices={prices} />
          <LineChart prices={prices} />
        </div>
      </div>
    </div>
  );
}
