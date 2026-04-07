import express from "express";

import {
  getDashboardStats,
  getMonthlyRevenue,
  deleteUser,
  getOwners,
  getUsers,
  deleteOwner,
  deleteDeliveryBoy,
  getAllOrders,
  getOrdersByStatus,
  getOrdersAnalytics,
  getDailyRevenue,
  getOwnerStats,
  getDeliveryBoyDetails,
  getDeliveryBoys,
  getAdminDeliveryAnalytics,
  getUserDetails,
  searchUsers,
  searchOrders,
  searchOwners,
  searchDeliveryBoys,
  getRecentOrders,
  getTopRestaurants,
  getTopDeliveryPartners,
  getFilteredOrderAnalytics,
  getOrdersLast7Days,
  getOrdersLast30Days,
  blockUser
} from "../controllers/admin.controller.js";

import { isAdmin } from "../middleware/isAdmin.js";
import isAuth from "../middleware/isAuth.js";
import { downloadDeliveryBoyReport, downloadOwnerReport, downloadUserReport } from "../controllers/adminReports.controller.js";

const adminRouter = express.Router();

/* DASHBOARD */

adminRouter.get("/dashboard", isAuth, isAdmin, getDashboardStats);
adminRouter.get("/revenue", isAuth, isAdmin, getMonthlyRevenue);
adminRouter.get("/daily-revenue", isAuth, isAdmin, getDailyRevenue);
adminRouter.get("/orders-analytics", isAuth, isAdmin, getOrdersAnalytics);

/* USERS */

adminRouter.get("/users", isAuth, isAdmin, getUsers);
adminRouter.get("/users/:id/details", isAuth, isAdmin, getUserDetails);
adminRouter.delete("/users/:id", isAuth, isAdmin, deleteUser);
adminRouter.patch("/users/block/:id", isAuth, isAdmin, blockUser);

/* OWNERS */

adminRouter.get("/owners", isAuth, isAdmin, getOwners);
adminRouter.delete("/owners/:id", isAuth, isAdmin, deleteOwner);
adminRouter.get("/owner-stats/:id", isAuth, isAdmin, getOwnerStats);

/* DELIVERY BOYS */

adminRouter.get("/delivery-boys", isAuth, isAdmin, getDeliveryBoys);
adminRouter.get("/delivery-boys/:id", isAuth, isAdmin, getDeliveryBoyDetails);
adminRouter.get("/analytics/delivery", isAuth, isAdmin, getAdminDeliveryAnalytics);
adminRouter.delete("/delivery-boys/:id", isAuth, isAdmin, deleteDeliveryBoy);

/* ORDERS */

adminRouter.get("/orders", isAuth, isAdmin, getAllOrders);
adminRouter.get("/orders-status", isAuth, isAdmin, getOrdersByStatus);

/* SEARCH */

adminRouter.get("/users-search", isAuth, isAdmin, searchUsers);
adminRouter.get("/owners-search", isAuth, isAdmin, searchOwners);
adminRouter.get("/delivery-boy-search", isAuth, isAdmin, searchDeliveryBoys);
adminRouter.get("/orders-search", isAuth, isAdmin, searchOrders);

// Analysis
adminRouter.get("/recent-orders", isAuth, isAdmin, getRecentOrders)
adminRouter.get("/top-restaurants", isAuth, isAdmin, getTopRestaurants)
adminRouter.get("/top-delivery", isAuth, isAdmin, getTopDeliveryPartners)
adminRouter.get("/orders-analytics-filter", isAuth, isAdmin, getFilteredOrderAnalytics)
adminRouter.get("/orders-last7days", isAuth, isAdmin, getOrdersLast7Days)
adminRouter.get("/orders-last30days", isAuth, isAdmin, getOrdersLast30Days)

// Report

/* REPORTS */

adminRouter.get("/reports/users/:id", isAuth, isAdmin, downloadUserReport);
adminRouter.get("/owner-report/:id", isAuth, isAdmin, downloadOwnerReport);
adminRouter.get("/delivery-boy-report/:id", isAuth, isAdmin, downloadDeliveryBoyReport);
export default adminRouter;