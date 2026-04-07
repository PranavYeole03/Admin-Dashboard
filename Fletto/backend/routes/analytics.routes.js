import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getOwnerAnalytics } from "../controllers/analytics.controller.js";



const analyticsRouter = express.Router();

analyticsRouter.get("/",isAuth,getOwnerAnalytics)
export default analyticsRouter;
