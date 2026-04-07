import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"; import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/NavBar";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Owners from "./pages/Owners";
import OwnerDashboard from "./pages/OwnerDashboard";
import DeliveryBoys from "./pages/DeliveryBoys";
import Orders from "./pages/Orders";
import UserDetails from "./pages/UserDetails";
import AdminAuth from "./pages/AdminAuth";
import Settings from "./pages/Settings";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import DeliveryBoyDetails from "./pages/DeliveryBoyDetails";

export const serverURL = "https://admin-dashboard-n6b6.onrender.com"
function Layout() {

  const [openSidebar, setOpenSidebar] = useState(false)

  return (

    <div className="flex">

      <Sidebar
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      <div className="flex-1 md:ml-64">

        <Navbar setOpenSidebar={setOpenSidebar} />

        <Outlet />

      </div>

    </div>

  )

}

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/admin-auth" element={<AdminAuth />} />
        <Route path="/dashboard" element={<Layout />}>

          <Route index element={<Dashboard />} />

          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetails />} />

          <Route path="owners" element={<Owners />} />
          <Route path="owner/:id" element={<OwnerDashboard />} />

          <Route path="delivery-boys" element={<DeliveryBoys />} />
          <Route path="delivery-boys/:id" element={<DeliveryBoyDetails />} />
          <Route path="orders" element={<Orders />} />

          {/* SETTINGS */}
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/admin-auth" />} />
      </Routes>

    </BrowserRouter>

  );

}

export default App;
