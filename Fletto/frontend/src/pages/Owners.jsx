import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Owners() {

  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchOwners = async (value = "") => {

    try {

      setLoading(true);

      const res = await api.get(`/admin/owners-search?search=${value}`);
      setOwners(res.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {

    const delay = setTimeout(() => {
      fetchOwners(search);
    }, 400);

    return () => clearTimeout(delay);

  }, [search]);

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Delete this owner?");
    if (!confirmDelete) return;

    try {

      await api.delete(`/admin/owners/${id}`);

      setOwners((prev) => prev.filter((o) => o._id !== id));

    } catch (error) {
      console.log(error);
    }

  };

  return (

    <div className="p-4 md:p-6 lg:p-8">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

        <h1 className="text-xl md:text-2xl font-bold">
          Shop Owners
        </h1>

        <input
          type="text"
          placeholder="Search owner name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64 text-sm"
        />

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="min-w-[600px] w-full text-sm md:text-base">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Action</th>
            </tr>

          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan="4" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && owners.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No owners found
                </td>
              </tr>
            )}

            {owners.map((owner) => (

              <tr key={owner._id} className="border-t">

                <td className="p-3">{owner.fullName}</td>

                <td className="p-3">{owner.email}</td>

                <td className="p-3">{owner.mobile}</td>

                <td className="p-3">

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() => navigate(`/dashboard/owner/${owner._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleDelete(owner._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}