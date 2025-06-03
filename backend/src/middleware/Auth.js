import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";
dotenv.config();

export const authProtection = async (req, res, next) => {
  try {
    const access_token = req.cookies.access_token;
    if (!access_token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access, please login first",
      });
    }
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access, user not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
