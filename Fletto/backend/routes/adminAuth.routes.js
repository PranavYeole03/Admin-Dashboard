import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin
} from "../controllers/adminAuth.controller.js";

import isAuth from "../middleware/isAuth.js";

const adminAuthRouter = express.Router();

/* REGISTER ADMIN */
adminAuthRouter.post("/register", registerAdmin);

/* LOGIN ADMIN */
adminAuthRouter.post("/login", loginAdmin);

/* LOGOUT ADMIN */
adminAuthRouter.post("/logout", isAuth, logoutAdmin);

export default adminAuthRouter;