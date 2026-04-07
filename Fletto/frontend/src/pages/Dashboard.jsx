import { useEffect, useState } from "react";
import api from "../services/api";
import { socket } from "../socket";
import { Link } from "react-router-dom";

import StatCard from "../components/StatCard";
import RevenueChart from "../components/RevenueChart";
import OrdersChart from "../components/OrdersChart";

export default function Dashboard() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalShops: 0,
    totalRevenue: 0
  })
  const year = new Date().getFullYear();
  const [revenue, setRevenue] = useState([])
  const [dailyRevenue, setDailyRevenue] = useState([])
  const [ordersAnalytics, setOrdersAnalytics] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [topRestaurants, setTopRestaurants] = useState([])
  const [topDelivery, setTopDelivery] = useState([])
  const [ordersActivity, setOrdersActivity] = useState([])

  const [range, setRange] = useState("week")
  const [loading, setLoading] = useState(true)

  const statsData = [
    { title: "Total Users", value: stats.totalUsers, link: "/dashboard/users" },
    { title: "Total Owner", value: stats.totalOwner, link: "/dashboard/owners" },
    { title: "DeliveryBoy", value: stats.totalDeliveryBoy, link: "/dashboard/delivery-boys" },
    { title: "Total Shops", value: stats.totalShops }
  ];

  const fetchDashboardData = async () => {

    try {

      const [
        dashboardRes,
        revenueRes,
        analyticsRes,
        dailyRevenueRes,
        recentOrdersRes,
        restaurantsRes,
        deliveryRes,
        ordersActivityRes
      ] = await Promise.all([

        api.get("/admin/dashboard"),
        api.get("/admin/revenue"),
        api.get(`/admin/orders-analytics-filter?range=${range}`),
        api.get("/admin/daily-revenue"),
        api.get("/admin/recent-orders"),
        api.get("/admin/top-restaurants"),
        api.get("/admin/top-delivery"),
        api.get("/admin/orders-last7days")

      ])

      setStats(dashboardRes.data || {})
      setRecentOrders(recentOrdersRes.data || [])
      setTopRestaurants(restaurantsRes.data || [])
      setTopDelivery(deliveryRes.data || [])
      setOrdersActivity(ordersActivityRes.data || [])

      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ]

      const formattedRevenue = (revenueRes.data || []).map(item => ({
        month: months[item._id - 1],
        revenue: item.revenue
      }))

      setRevenue(formattedRevenue)

      const formattedDaily = (dailyRevenueRes.data || []).map(item => ({
        day: `${item._id.day}/${item._id.month}`,
        revenue: item.revenue
      }))

      setDailyRevenue(formattedDaily)

      setOrdersAnalytics(analyticsRes.data || [])

    } catch (error) {

      console.log("Dashboard error:", error)

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    fetchDashboardData()

    socket.emit("identity", { role: "admin" })

    socket.on("adminNewOrder", fetchDashboardData)
    socket.on("update-Status", fetchDashboardData)
    socket.on("adminDashboardUpdate", fetchDashboardData)

    return () => {

      socket.off("adminNewOrder")
      socket.off("update-Status")
      socket.off("adminDashboardUpdate")

    }

  }, [range])

  const totalOrdersAnalytics = ordersAnalytics.reduce(
    (sum, item) => sum + item.value,
    0
  )

  if (loading) {

    return (
      <div className="flex justify-center items-center h-[400px] text-white">
        Loading dashboard...
      </div>
    )

  }

  return (

    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-6">
      {/* STATS */}

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statsData.map((item, i) => (
          <Link key={i} to={item.link}>
            <StatCard title={item.title} value={item.value} />
          </Link>
        ))}
      </div>


      {/* TOP PERFORMERS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">

          <h2 className="text-xl text-white mb-4">
            Top Restaurants
          </h2>

          {topRestaurants.map((r, index) => (

            <div
              key={r?._id?._id || index}
              className="flex justify-between py-3 border-b border-white/10 text-white"
            >

              <span>
                #{index + 1} {r._id?.name}
              </span>

              <span>{r.totalOrders} orders</span>

            </div>

          ))}

        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">

          <h2 className="text-xl text-white mb-4">
            Top Delivery Partners
          </h2>

          {topDelivery.map((d, index) => (

            <div
              key={d?._id?._id}
              className="flex justify-between py-3 border-b border-white/10 text-white"
            >

              <span>
                #{index + 1} {d?._id?.fullName}
              </span>

              <span>{d.totalOrders} deliveries</span>

            </div>

          ))}

        </div>

      </div>


      {/* REVENUE CHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">

          <h2 className="text-xl text-white mb-6">
            Monthly Revenue
          </h2>

          <RevenueChart data={revenue} />

        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">

          <h2 className="text-xl text-white mb-6">
            Daily Revenue
          </h2>

          <RevenueChart data={dailyRevenue} />

        </div>

      </div>


      {/* ORDERS ANALYTICS */}

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">

        {/* Header */}

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-xl text-white">
            Orders Analytics
          </h2>

          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-slate-800 text-white px-3 py-1 rounded"
          >

            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>

          </select>

        </div>


        {/* TODAY VIEW */}

        {range === "today" && (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            <div className="flex justify-center">
              <OrdersChart data={ordersAnalytics} />
            </div>

            <div className="space-y-4">

              {ordersAnalytics.map(item => {

                const percent = totalOrdersAnalytics
                  ? Math.round((item.value / totalOrdersAnalytics) * 100)
                  : 0

                return (

                  <div
                    key={item.name}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center"
                  >

                    <span className="text-gray-300 capitalize">
                      {item.name}
                    </span>

                    <span className="text-xl font-semibold text-white">
                      {percent}%
                    </span>

                  </div>

                )

              })}

            </div>

          </div>

        )}


        {/* WEEK / MONTH VIEW */}

        {range !== "today" && (

          <div>

            <h3 className="text-lg text-gray-300 mb-4">

              {range === "week"
                ? "Orders Activity (Last 7 Days)"
                : "Orders Activity (Last 30 Days)"}

            </h3>

            <RevenueChart data={ordersActivity} />

          </div>

        )}

      </div>


      {/* RECENT ORDERS */}

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">

        <h2 className="text-xl text-white mb-6">
          Recent Orders
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-white">

            <thead>

              <tr className="text-gray-400 border-b border-white/10 text-left">

                <th className="py-3">Order</th>
                <th>User</th>
                <th>Restaurant</th>
                <th>Amount</th>

              </tr>

            </thead>

            <tbody>

              {recentOrders.map(order => (

                <tr
                  key={order._id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >

                  <td className="py-3">
                    {order._id.slice(-6)}
                  </td>

                  <td>{order.user?.fullName.slice(0, 6)}</td>

                  <td>{order.shopOrders[0]?.shop?.name}</td>

                  <td>₹{order.totalAmount}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
      {/* Footer */}
      <footer className="bg-black text-gray-400 mt-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

          {/* TOP SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div>
              <h1 className="text-white text-lg font-semibold">
                Fletto Admin
              </h1>
              <p className="text-sm mt-2 text-gray-500">
                Manage users, shops, delivery partners and orders easily.
              </p>
            </div>

            <div className="md:col-span-1"></div>

            <div className="md:text-right">
              <h2 className="text-white text-sm mb-3">Contact</h2>
              <p className="text-sm">fletto123fd@gmail.com</p>
            </div>

          </div>

          {/* DIVIDER */}
          <div className="border-t border-gray-800 my-6"></div>

          {/* BOTTOM */}
          <div className="flex flex-col md:flex-row justify-between items-center text-xs gap-3 text-center md:text-left">

            <p>
              © {year} Fletto Pvt. Ltd. All rights reserved.
            </p>

            <div className="flex gap-4">
              <Link
                to="/privacy"
                className=" hover:text-white cursor-pointer"
              >Privacy </Link>
              <Link
                to="/terms"
                className="hover:text-white cursor-pointer"
              >Terms</Link>
            </div>

          </div>

        </div>
      </footer>
    </div>

  )

}