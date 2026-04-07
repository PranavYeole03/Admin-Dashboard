import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverURL } from "../config/server"
import { FiMenu } from "react-icons/fi"
import adminImg from "../assets/Admin.png"
import { Link } from "react-router-dom"

export default function Navbar({ setOpenSidebar }) {

  const [admin, setAdmin] = useState(null)
  const [openMenu, setOpenMenu] = useState(false)

  const menuRef = useRef(null)
  const navigate = useNavigate()

  /* ================= CHECK ADMIN ================= */

  useEffect(() => {

    const checkAdmin = async () => {

      try {

        const res = await axios.get(
          `${serverURL}/api/admin/settings/profile`,
          { withCredentials: true }
        )

        setAdmin(res.data)

      } catch (error) {

        setAdmin(null)

      }

    }

    checkAdmin()

  }, [])

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false)
      }

    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }

  }, [])

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {

    try {

      await axios.post(
        `${serverURL}/api/adminAuth/logout`,
        {},
        { withCredentials: true }
      )

      setAdmin(null)

      navigate("/admin-auth", { replace: true })

    } catch (error) {

      console.log("Logout error:", error)

    }

  }
  const firstLetter = admin?.name?.charAt(0)?.toUpperCase() || "A"

  return (
    <div className="sticky top-0 z-50 h-16 bg-white border-b shadow-sm flex items-center justify-between px-4 md:px-6">      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpenSidebar(prev => !prev)}
          className="text-2xl md:hidden"
        >
          <FiMenu />
        </button>
        <Link to="/dashboard">
          <div className="flex items-center gap-2">
            <img
              src={adminImg}
              alt="Admin"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-black font-medium">Admin Dashboard</span>
          </div>
        </Link>


      </div>

      {/* RIGHT SIDE */}
      <div className="relative z-50" ref={menuRef}>
        {!admin ? (
          <button
            onClick={() => navigate("/admin-auth")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Login
          </button>
        ) : (
          <div>
            {/* AVATAR */}
            <div
              onClick={() => setOpenMenu(!openMenu)}
              className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold cursor-pointer hover:bg-indigo-700 transition"
            >
              {firstLetter}
            </div>
            {/* DROPDOWN */}
            {openMenu && (
              <div className="absolute right-0 mt-3 w-44 bg-white rounded-lg shadow-lg py-2">
                <div className="px-4 py-2 text-gray-700 border-b text-sm">
                  {admin.name}
                </div>
                <button
                  onClick={() => {
                    navigate("/dashboard")
                    setOpenMenu(false)
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    handleLogout()
                    setOpenMenu(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  )
}