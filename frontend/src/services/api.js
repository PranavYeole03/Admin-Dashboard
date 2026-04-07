import axios from "axios";

import { serverURL } from "../config/server";

const api = axios.create({
  baseURL: serverURL + "/api",
  withCredentials: true,
});

export const getDashboard = () => api.get("/admin/dashboard");

export const getRevenue = () => api.get("/admin/revenue");

export const getOrdersAnalytics = () => api.get("/admin/orders-analytics")

export default api;