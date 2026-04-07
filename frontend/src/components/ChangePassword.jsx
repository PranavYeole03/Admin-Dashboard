import { useState } from "react";
import api from "../services/api";
import { FiLock, FiKey, FiEye, FiEyeOff } from "react-icons/fi";

export default function ChangePassword() {

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const changePassword = async (e) => {

    e.preventDefault();

    try {

      await api.put("/admin/settings/password", password);

      alert("Password updated");

      setPassword({
        oldPassword: "",
        newPassword: ""
      });

    } catch (error) {

      alert(error.response?.data?.message || "Password change failed");

    }

  };

  return (

    <div className="flex items-center justify-center min-h-[70vh]">

      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">

        <h2 className="text-xl font-semibold mb-6 text-center">
          Change Password
        </h2>

        <form onSubmit={changePassword} className="space-y-5">

          {/* CURRENT PASSWORD */}

          <div>

            <label className="block text-sm mb-1">
              Current Password
            </label>

            <div className="flex items-center border rounded-lg px-3">

              <FiLock className="text-gray-400" />

              <input
                type={showOld ? "text" : "password"}
                value={password.oldPassword}
                placeholder="Enter current password"
                onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
                className="w-full p-2 outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? <FiEye /> : <FiEyeOff />}
              </button>

            </div>

          </div>

          {/* NEW PASSWORD */}

          <div>

            <label className="block text-sm mb-1">
              New Password
            </label>

            <div className="flex items-center border rounded-lg px-3">

              <FiKey className="text-gray-400" />

              <input
                type={showNew ? "text" : "password"}
                value={password.newPassword}
                placeholder="Enter new password"
                onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                className="w-full p-2 outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <FiEye /> : <FiEyeOff />}
              </button>

            </div>

          </div>

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium"
          >
            Update Password
          </button>

        </form>

      </div>

    </div>

  );

}