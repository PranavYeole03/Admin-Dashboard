import { useEffect, useState } from "react";
import api from "../services/api";
import { FiUser, FiMail, FiSave } from "react-icons/fi";

export default function Profile() {

  const [data, setData] = useState({
    name: "",
    email: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      setLoading(true);

      const res = await api.get("/admin/settings/profile");

      setData({
        name: res.data.name,
        email: res.data.email
      });

    } catch (err) {

      setMessage("Failed to load profile");

    } finally {

      setLoading(false);

    }
  };

  const updateProfile = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await api.put("/admin/settings/profile-update", data);

      await fetchProfile();

      setMessage("Profile updated successfully");

    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="max-w-3xl mx-auto">

      <div className="bg-white shadow-lg rounded-xl p-8">

        <h2 className="text-xl font-semibold mb-6">
          Admin Profile
        </h2>

        {/* Avatar */}

        <div className="flex items-center gap-4 mb-6">

          <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl">
            <FiUser />
          </div>

          <div>
            <p className="font-semibold">{data.name}</p>
            <p className="text-gray-500 text-sm">{data.email}</p>
          </div>

        </div>

        {/* MESSAGE */}

        {message && (
          <p className="mb-4 text-green-600 text-sm">
            {message}
          </p>
        )}

        {/* FORM */}

        <form onSubmit={updateProfile} className="space-y-5">

          {/* NAME */}

          <div>

            <label className="block text-sm mb-1">
              Name
            </label>

            <div className="flex items-center border rounded-lg px-3">

              <FiUser className="text-gray-400" />

              <input
                type="text"
                value={data.name}
                onChange={(e) =>
                  setData({ ...data, name: e.target.value })
                }
                className="w-full p-2 outline-none"
                required
              />

            </div>

          </div>

          {/* EMAIL */}

          <div>

            <label className="block text-sm mb-1">
              Email
            </label>

            <div className="flex items-center border rounded-lg px-3">

              <FiMail className="text-gray-400" />

              <input
                type="email"
                value={data.email}
                onChange={(e) =>
                  setData({ ...data, email: e.target.value })
                }
                className="w-full p-2 outline-none"
                required
              />

            </div>

          </div>

          {/* BUTTON */}

          <button
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
          >
            <FiSave />
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>

      </div>

    </div>

  );

}