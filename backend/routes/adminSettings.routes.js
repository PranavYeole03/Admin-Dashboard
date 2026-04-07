import express from "express"
import isAuth from "../middleware/isAuth.js"
import { isAdmin } from "../middleware/isAdmin.js"

import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getAppInfo
} from "../controllers/adminSettings.controller.js"

const adminSetRouter = express.Router()

// profile
adminSetRouter.get("/profile", isAuth, isAdmin, getAdminProfile)
adminSetRouter.put("/profile-update", isAuth, isAdmin, updateAdminProfile)

// password
adminSetRouter.put("/password", isAuth, isAdmin, changeAdminPassword)

// app info
adminSetRouter.get("/app-info", getAppInfo)

export default adminSetRouter