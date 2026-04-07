import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const navigate = useNavigate();

  const fetchUsers = async () => {

    try {

      const res = await api.get(
        `/admin/users-search?search=${search}&sort=${sort}`
      );

      setUsers(res.data);

    } catch (error) {
      console.log("Fetch users error", error);
    }

  };

  useEffect(() => {

    const delay = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(delay);

  }, [search, sort]);

  const handleBlock = async (id) => {

    if (!window.confirm("Block / Unblock this user?")) return;

    try {

      await api.patch(`/admin/users/block/${id}`);

      fetchUsers();

    } catch (error) {
      console.log("Block user error", error);
    }

  };

  return (

    <div className="p-4 md:p-6 lg:p-8">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <h1 className="text-xl md:text-2xl font-bold">
          Users
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

          <input
            type="text"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-64 text-sm"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-3 py-2 rounded text-sm w-full sm:w-auto"
          >

            <option value="latest">Newest</option>
            <option value="orders">Most Orders</option>
            <option value="spent">Highest Spending</option>

          </select>

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="min-w-[700px] w-full text-sm md:text-base">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Orders</th>
              <th className="p-3 text-left">Spent</th>
              <th className="p-3 text-left">Actions</th>
            </tr>

          </thead>

          <tbody>

            {users.length === 0 ? (

              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No users found
                </td>
              </tr>

            ) : (

              users.map(user => (

                <tr key={user._id} className="border-t">

                  <td className="p-3">{user.fullName}</td>

                  <td className="p-3">{user.email}</td>

                  <td className="p-3">{user.mobile}</td>

                  <td className="p-3">{user.totalOrders}</td>

                  <td className="p-3 text-green-600 font-semibold">
                    ₹{user.totalSpent}
                  </td>

                  <td className="p-3">

                    <div className="flex flex-wrap gap-2">

                      <button
                        onClick={() => navigate(`/dashboard/users/${user._id}`)}
                        className="bg-blue-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleBlock(user._id)}
                        className="bg-red-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded"
                      >
                        Block
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}