import { useEffect, useState } from "react";
import api from "../services/api";
import AdminDeliveryAnalytics from "./AdminDeliveryAnalytics";
import { useNavigate } from "react-router-dom";

export default function DeliveryBoys() {

  const [boys, setBoys] = useState([]);
  const [search, setSearch] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBoys = async () => {
    try {

      setLoading(true);

      let url = "/admin/delivery-boys";

      if (search.trim() !== "") {
        url = `/admin/delivery-boy-search?search=${search}`;
      }

      const res = await api.get(url);

      setBoys(res.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoys();
  }, [search]);

  const viewBoy = (id) => {
    navigate(`/dashboard/delivery-boys/${id}`);
  };

  const downloadPDF = async (id) => {
    try {

      const res = await api.get(`/admin/delivery-boy-report/${id}`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "delivery-boy-report.pdf");

      document.body.appendChild(link);
      link.click();

    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this delivery boy?")) return;

    try {

      await api.delete(`/admin/delivery-boys/${id}`);

      fetchBoys();

    } catch (error) {
      console.log(error);
    }
  };

  return (

    <div className="p-4 md:p-6 lg:p-8">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <h1 className="text-xl md:text-2xl font-bold">
          Delivery Boys
        </h1>

        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">

          {/* SEARCH BOX */}

          <input
            type="text"
            placeholder="Search name or mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-72 text-sm"
          />

          {/* ANALYTICS BUTTON */}

          <button
            onClick={() => setShowAnalytics(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm w-full md:w-auto"
          >
            Delivery Analytics
          </button>

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="min-w-[900px] w-full text-xs sm:text-sm md:text-base">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Today Orders</th>
              <th className="p-3 text-left">Total Orders</th>
              <th className="p-3 text-left">Today Earnings</th>
              <th className="p-3 text-left">Total Earnings</th>
              <th className="p-3 text-left">Action</th>
            </tr>

          </thead>

          <tbody>

            {boys.length === 0 ? (

              <tr>
                <td colSpan="8" className="text-center p-8 text-gray-500">
                  No delivery boys found
                </td>
              </tr>

            ) : (

              boys.map((boy) => (

                <tr key={boy._id} className="border-t">

                  <td className="p-3">{boy.fullName}</td>

                  <td className="p-3">{boy.mobile}</td>

                  <td className="p-3">

                    <span
                      className={`px-2 py-1 text-[10px] sm:text-xs rounded text-white ${boy.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                    >
                      {boy.isOnline ? "Online" : "Offline"}
                    </span>

                  </td>

                  <td className="p-3">{boy.todayOrders}</td>

                  <td className="p-3">{boy.totalOrders}</td>

                  <td className="p-3 font-semibold">
                    ₹{boy.todayEarnings}
                  </td>

                  <td className="p-3 font-semibold">
                    ₹{boy.totalEarnings}
                  </td>

                  <td className="p-3">

                    <div className="flex flex-wrap gap-2">

                      <button
                        onClick={() => viewBoy(boy._id)}
                        className="bg-blue-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded hover:bg-blue-600"
                      >
                        View
                      </button>

                      <button
                        onClick={() => downloadPDF(boy._id)}
                        className="bg-green-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded hover:bg-green-700"
                      >
                        PDF
                      </button>

                      <button
                        onClick={() => handleDelete(boy._id)}
                        className="bg-red-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded hover:bg-red-600"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* ANALYTICS MODAL */}

      {showAnalytics && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full h-full md:h-auto md:max-w-5xl md:rounded-xl p-4 md:p-6 overflow-y-auto">

            <AdminDeliveryAnalytics onClose={() => setShowAnalytics(false)} />

          </div>

        </div>

      )}

    </div>

  );

}