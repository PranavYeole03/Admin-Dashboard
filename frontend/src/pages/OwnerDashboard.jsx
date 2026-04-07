import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { socket } from "../socket";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

import { FaArrowLeftLong } from "react-icons/fa6";

export default function OwnerDashboard() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const fetchStats = async () => {

    try {
      const res = await api.get(`/admin/owner-stats/${id}`);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }

  };

  useEffect(() => {

    fetchStats();

    socket.emit("identity", {
      userId: id,
      role: "owner"
    });

    socket.on("update-Status", () => {
      fetchStats();
    });

    socket.on("ownerStatsUpdated", (payload) => {

      if (payload?.ownerId === id) {
        fetchStats();
      }

    });

    return () => {
      socket.off("update-Status");
      socket.off("ownerStatsUpdated");
    };

  }, [id]);

  if (!data) {
    return (
      <p className="p-6 text-center">
        Loading...
      </p>
    );
  }

  const downloadPDF = async () => {

    try {

      const res = await api.get(`/admin/owner-report/${id}`, {
        responseType: "blob"
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `owner-report-${id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (error) {
      console.log(error);
    }

  };

  return (

    <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/dashboard/owners")}
            className="text-lg font-bold px-3 py-1 rounded hover:bg-gray-200"
          >
            <FaArrowLeftLong size={18} />
          </button>

          <h1 className="text-xl md:text-2xl font-bold">
            Owner Analysis
          </h1>

        </div>

        <button
          onClick={downloadPDF}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
        >
          Download PDF
        </button>

      </div>

      {/* OWNER INFO */}

      <div className="bg-white shadow rounded-xl p-4 md:p-6 mb-8">

        <h2 className="text-lg md:text-xl font-semibold mb-2">
          {data.shopName}
        </h2>

        <p className="text-sm md:text-base">Owner Email: {data.email}</p>
        <p className="text-sm md:text-base">Mobile: {data.mobile}</p>

      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">

        <div className="bg-white p-4 md:p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl md:text-3xl font-bold">{data.totalOrders}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-2xl md:text-3xl font-bold">₹{data.totalRevenue}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Today Revenue</h3>
          <p className="text-2xl md:text-3xl font-bold">₹{data.todayRevenue}</p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Items Sold</h3>
          <p className="text-2xl md:text-3xl font-bold">{data.itemsSold}</p>
        </div>

      </div>

      {/* DAILY REVENUE */}

      <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-10">

        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Daily Revenue
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={data.dailyRevenue}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* WEEKLY REVENUE */}

      <div className="bg-white p-4 md:p-6 rounded-xl shadow">

        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Weekly Revenue
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={data.dailyRevenue}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="revenue" fill="#10b981" />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}