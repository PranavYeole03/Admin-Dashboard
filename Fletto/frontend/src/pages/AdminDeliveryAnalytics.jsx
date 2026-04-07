import { useEffect, useState } from "react";
import api from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function AdminDeliveryAnalytics({ onClose }) {

  const [data,setData] = useState(null);

  const fetchAnalytics = async () => {

    try {

      const res = await api.get("/admin/analytics/delivery");

      setData(res.data);

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(()=>{
    fetchAnalytics();
  },[]);

  if(!data){
    return (
      <div className="p-6 text-center">
        Loading analytics...
      </div>
    );
  }

  return(

  <div className="w-full h-full bg-white">

  {/* HEADER (important for mobile close button) */}

  <div className="flex items-center justify-between mb-6 border-b pb-3">

  <h1 className="text-xl md:text-2xl font-bold">
  Delivery Analytics
  </h1>

  {onClose && (
  <button
  onClick={onClose}
  className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
  >
  Close
  </button>
  )}

  </div>


  {/* SUMMARY CARDS */}

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

  <div className="bg-white shadow rounded-xl p-4">

  <p className="text-gray-500 text-sm">
  Total Deliveries
  </p>

  <p className="text-xl md:text-2xl font-bold">
  {data.totalDeliveries}
  </p>

  </div>

  <div className="bg-white shadow rounded-xl p-4">

  <p className="text-gray-500 text-sm">
  Delivery Revenue
  </p>

  <p className="text-xl md:text-2xl font-bold">
  ₹{data.totalRevenue}
  </p>

  </div>

  <div className="bg-white shadow rounded-xl p-4">

  <p className="text-gray-500 text-sm">
  Delivery Boys
  </p>

  <p className="text-xl md:text-2xl font-bold">
  {data.deliveryBoys}
  </p>

  </div>

  <div className="bg-white shadow rounded-xl p-4">

  <p className="text-gray-500 text-sm">
  Online Riders
  </p>

  <p className="text-xl md:text-2xl font-bold">
  {data.onlineBoys}
  </p>

  </div>

  </div>


  {/* CHART */}

  <div className="bg-white shadow rounded-xl p-4 md:p-6">

  <h2 className="text-base md:text-lg font-semibold mb-4">
  Daily Deliveries
  </h2>

  <ResponsiveContainer width="100%" height={300}>

  <LineChart data={data.dailyChart}>

  <CartesianGrid strokeDasharray="3 3" />

  <XAxis dataKey="date" />

  <YAxis />

  <Tooltip />

  <Line
  type="monotone"
  dataKey="deliveries"
  stroke="#3b82f6"
  strokeWidth={3}
  />

  </LineChart>

  </ResponsiveContainer>

  </div>

  </div>

  );

}