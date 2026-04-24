import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getCrops,
  getMarkets,
  getPrices,
  storePrice,
  updatePrice,
  deletePrice,
} from "../api";

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [crops, setCrops] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [prices, setPrices] = useState([]);
  const [form, setForm] = useState({
    crop_id: "",
    market_id: "",
    amount: "",
    recorded_at: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getCrops().then((res) => setCrops(res.data));
    getMarkets().then((res) => setMarkets(res.data));
    getPrices().then((res) => setPrices(res.data));
  }, []);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        const res = await updatePrice(editingId, {
          amount: form.amount,
          recorded_at: form.recorded_at,
        });
        setPrices(prices.map((p) => (p.id === editingId ? res.data : p)));
        setSuccess("Price updated successfully");
        setEditingId(null);
      } else {
        const res = await storePrice(form);
        setPrices([res.data, ...prices]);
        setSuccess("Price added successfully");
      }
      setForm({ crop_id: "", market_id: "", amount: "", recorded_at: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (price) => {
    setEditingId(price.id);
    setForm({
      crop_id: price.crop_id,
      market_id: price.market_id,
      amount: price.amount,
      recorded_at: price.recorded_at,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this price?")) return;
    await deletePrice(id);
    setPrices(prices.filter((p) => p.id !== id));
    setSuccess("Price deleted");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Admin dashboard
          </h1>
          <p className="text-xs text-gray-400">Gambia Crop Price Tracker</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Feedback messages */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
            {success}
          </div>
        )}

        {/* Price form */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            {editingId ? "Edit price" : "Add new price"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Crop</label>
              <select
                value={form.crop_id}
                onChange={(e) => setForm({ ...form, crop_id: e.target.value })}
                disabled={!!editingId}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
              >
                <option value="">Select crop</option>
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Market</label>
              <select
                value={form.market_id}
                onChange={(e) =>
                  setForm({ ...form, market_id: e.target.value })
                }
                disabled={!!editingId}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
              >
                <option value="">Select market</option>
                {markets.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Price (GMD)
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Date recorded
              </label>
              <input
                type="date"
                value={form.recorded_at}
                onChange={(e) =>
                  setForm({ ...form, recorded_at: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              {editingId ? "Update price" : "Add price"}
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    crop_id: "",
                    market_id: "",
                    amount: "",
                    recorded_at: "",
                  });
                }}
                className="border border-gray-200 text-gray-600 text-sm px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Price history table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="text-sm font-medium text-gray-700">Price history</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Crop</th>
                <th className="px-4 py-3">Market</th>
                <th className="px-4 py-3">Price (GMD)</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((price) => (
                <tr
                  key={price.id}
                  className="border-t border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {price.crop.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {price.market.name}
                  </td>
                  <td className="px-4 py-3 text-green-700 font-medium">
                    D {price.amount}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {price.recorded_at}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(price)}
                      className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(price.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
