import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  try {

    let token = req.cookies.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Token not found"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only"
      });
    }

    req.userId = user._id;
    req.admin = user;

    next();

  } catch (error) {

    console.error("Admin middleware error:", error);

    return res.status(401).json({
      message: "Authentication failed"
    });

  }
};