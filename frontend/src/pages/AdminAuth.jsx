import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { serverURL } from "../config/server"

export default function AdminAuth() {

  const [isLogin, setIsLogin] = useState(true)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isLogin) {
        await axios.post(
          `${serverURL}/api/adminAuth/login`,
          { email, password },
          { withCredentials: true }
        )
        navigate("/dashboard")
      } else {
        await axios.post(
          `${serverURL}/api/adminAuth/register`,
          { fullName, email, password },
          { withCredentials: true }
        )
        alert("Admin registered successfully")
        setIsLogin(true)
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error")
    }
  }

  return (

    <div className="flex items-center justify-center h-screen bg-gradient-to-r bg-white">

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-96 p-8 rounded-xl shadow-xl"
      >

        <h2 className="text-2xl font-bold text-center mb-6">

          {isLogin ? "Admin Login" : "Admin Register"}

        </h2>

        <form onSubmit={handleSubmit}>

          {!isLogin && (

            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-3 mb-4 rounded"
              onChange={(e) => setFullName(e.target.value)}
            />

          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 mb-4 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 mb-4 rounded"
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-indigo-600 text-white p-3 rounded"
          >
            {isLogin ? "Login" : "Register"}
          </motion.button>

        </form>

        <p className="text-center mt-4">

          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 ml-2"
          >

            {isLogin ? "Register" : "Login"}

          </button>

        </p>

      </motion.div>

    </div>

  )

}