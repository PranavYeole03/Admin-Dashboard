import { useState } from "react"
import ProfileSettings from "../components/Profile"
import PasswordSettings from "../components/ChangePassword"
import AppInfo from "../components/AppInfo"

export default function Settings() {

  const [tab, setTab] = useState("profile")

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Settings
      </h1>

      <div className="flex gap-4 mb-6">

        <button onClick={() => setTab("profile")} className="px-4 py-2 bg-gray-200 rounded">
          Profile
        </button>

        <button onClick={() => setTab("password")} className="px-4 py-2 bg-gray-200 rounded">
          Password
        </button>

        <button onClick={() => setTab("info")} className="px-4 py-2 bg-gray-200 rounded">
          App Info
        </button>

      </div>

      {tab === "profile" && <ProfileSettings />}
      {tab === "password" && <PasswordSettings />}
      {tab === "theme" && <ThemeSettings />}
      {tab === "info" && <AppInfo />}

    </div>

  )

}