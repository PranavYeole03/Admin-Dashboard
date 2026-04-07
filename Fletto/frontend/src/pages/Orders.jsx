import { useEffect, useState } from "react";
import api from "../services/api";

export default function Orders() {

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const statuses = ["pending", "preparing", "out of delivery", "delivered"];

  const fetchOrders = async () => {

    try {

      setLoading(true);

      const res = await api.get(
        `/admin/orders-search?status=${status}&search=${search}`
      );

      setOrders(res.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchOrders();
  }, [status, search]);

  return (

    <div className="p-4 md:p-8">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-xl md:text-2xl font-bold">
          Orders
        </h1>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search Order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

      </div>

      {/* MOBILE STATUS SELECT */}

      <div className="md:hidden mb-6">

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-3 rounded-lg"
        >

          {statuses.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}

        </select>

      </div>

      {/* DESKTOP STATUS TABS */}

      <div className="hidden md:flex gap-4 mb-6">

        {statuses.map(s => (

          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded ${status === s
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
              }`}
          >
            {s}
          </button>

        ))}

      </div>

      {/* DESKTOP TABLE */}

      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Shop</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
            </tr>

          </thead>
          <tbody>

            {loading ? (

              <tr>
                <td colSpan="5" className="text-center p-6">
                  Loading orders...
                </td>
              </tr>

            ) : orders.length === 0 ? (

              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No orders found
                </td>
              </tr>

            ) : (

              orders.map((order) => (

                <tr key={order._id} className="border-t">

                  <td className="p-3">
                    {order._id.slice(-6)}
                  </td>

                  <td className="p-3">
                    {order.user?.fullName || "Unknown"}
                  </td>

                  <td className="p-3">
                    {order.shopOrders?.[0]?.shop?.name || "N/A"}
                  </td>

                  <td className="p-3">
                    ₹ {order.totalAmount}
                  </td>

                  <td className="p-3 capitalize">
                    {order.shopOrders?.[0]?.status}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* MOBILE CARDS */}

      <div className="md:hidden space-y-4">

        {orders.map(order => (

          <div key={order._id} className="bg-white rounded-xl shadow p-4">

            <div className="flex justify-between mb-2">

              <span className="font-semibold">
                Order #{order._id.slice(-6)}
              </span>

              <span className="text-indigo-600 font-semibold">
                ₹ {order.totalAmount}
              </span>

            </div>

            <p className="text-sm text-gray-600">
              Customer: {order.user?.fullName}
            </p>

            <p className="text-sm text-gray-600">
              Shop: {order.shopOrders?.[0]?.shop?.name}
            </p>

            <p className="text-sm mt-2 font-medium capitalize">
              Status: {order.shopOrders?.[0]?.status}
            </p>

          </div>

        ))}

      </div>

    </div>

  );
}