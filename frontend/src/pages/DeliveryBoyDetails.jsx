import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { FaArrowLeft } from "react-icons/fa6";

export default function DeliveryBoyDetails() {

  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/dashboard/delivery-boys");
  };

  useEffect(() => {
    fetchBoy();
  }, [id]);

  const fetchBoy = async () => {

    try {

      const res = await api.get(`/admin/delivery-boys/${id}`);

      setData(res.data);

    } catch (error) {
      console.log(error);
    }

  };

  if (!data) {
    return (
      <div className="p-8 text-gray-500">
        Loading delivery boy details...
      </div>
    );
  }

  return (

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">

        <FaArrowLeft
          className="cursor-pointer text-gray-600 hover:text-black"
          onClick={goBack}
        />

        Delivery Boy Profile

      </h1>

      {/* PROFILE */}

      <div className="bg-white p-6 rounded shadow mb-6">

        <p><b>Name:</b> {data.profile.fullName}</p>
        <p><b>Email:</b> {data.profile.email}</p>
        <p><b>Mobile:</b> {data.profile.mobile}</p>
        <p><b>Status:</b> {data.profile.isOnline ? "Online" : "Offline"}</p>

      </div>

      {/* ORDERS */}

      <div className="bg-white p-6 rounded shadow">

        <h2 className="text-lg font-semibold mb-4">
          Delivered Orders
        </h2>

        {!data.orders || data.orders.length === 0 ? (

          <p className="text-gray-500">No orders found</p>

        ) : (

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Mobile</th>
                <th className="p-2 text-left">Order ID</th>

              </tr>

            </thead>

            <tbody>

              {data.orders.map((order) => (

                <tr key={order._id} className="border-b">

                  <td className="p-2">
                    {order.user?.fullName}
                  </td>

                  <td className="p-2">
                    {order.user?.mobile}
                  </td>

                  <td className="p-2">
                    {order._id}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>

  );

}