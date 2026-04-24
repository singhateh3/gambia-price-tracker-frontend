import axios from "axios";

const api = axios.create({
  baseURL: "https://gambia-price-tracker.onrender.com/api",
  withCredentials: true,
});

export const getCrops = () => api.get("/crops");
export const getMarkets = () => api.get("/markets");
export const getPrices = () => api.get("/prices");
export const getPricesByCrop = (cropId) => api.get(`/prices/${cropId}`);

// This keeps all your API calls in one place. If your Laravel URL ever changes, you only update baseURL here.

// Auth
export const login = (data) => api.post("/login", data);
export const logout = () => api.post("/logout");

// Admin
export const storePrice = (data) => api.post("/prices", data);
export const updatePrice = (id, data) => api.put(`/prices/${id}`, data);
export const deletePrice = (id) => api.delete(`/prices/${id}`);
