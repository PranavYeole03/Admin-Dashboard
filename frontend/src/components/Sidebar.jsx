import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react"; // ✅ added
import {
  FiHome,
  FiUsers,
  FiTruck,
  FiPackage,
  FiSettings
} from "react-icons/fi";
import { BsShop } from "react-icons/bs";

export default function Sidebar({ openSidebar, setOpenSidebar }) {

  const location = useLocation();

  // ✅ FIX: handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpenSidebar(true); // always open in laptop
      }
    };

    handleResize(); // run once
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setOpenSidebar]);

  const menu = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { name: "Users", icon: <FiUsers />, path: "/dashboard/users" },
    { name: "Owners", icon: <BsShop />, path: "/dashboard/owners" },
    { name: "Delivery", icon: <FiTruck />, path: "/dashboard/delivery-boys" },
    { name: "Orders", icon: <FiPackage />, path: "/dashboard/orders" }
  ];

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{
        x:
          window.innerWidth >= 768
            ? 0
            : openSidebar
              ? 0
              : -260
      }}
      transition={{ duration: 0.25 }}
      className="fixed top-0 left-0 z-40 w-64 h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col p-6 shadow-xl"
    >

      {/* CLOSE BUTTON (ONLY MOBILE) */}
      <button
        onClick={() => setOpenSidebar(false)}
        className="absolute top-4 right-4 text-xl md:hidden"
      >
        ✕
      </button>

      {/* LOGO */}
      <h1 className="text-2xl font-bold mb-10 tracking-wide">
        Fletto Admin
      </h1>

      {/* MENU */}
      <ul className="space-y-3 flex-1">

        {menu.map((item, index) => {

          const active = location.pathname === item.path;

          return (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  
                ${active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                  
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          );
        })}

      </ul>

      {/* SETTINGS */}
      <div className="border-t border-gray-700 pt-4">
        <Link
          to="/dashboard/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
          
          ${location.pathname === "/dashboard/settings"
              ? "bg-indigo-600 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }
          
          `}
        >
          <FiSettings />
          Settings
        </Link>
      </div>

    </motion.aside>
  );
}