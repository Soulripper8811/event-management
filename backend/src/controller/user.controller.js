import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { tryCatchWrapper } from "../utils/tryCatcher.js";
import ErrorResponse from "../middleware/errorResponse.js";
const generateToken = (res, user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};
export const registerUser = tryCatchWrapper(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    throw new ErrorResponse("Please provide all fields", 400);
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ErrorResponse("User already exists", 400);
  }
  const user = await User({
    userName,
    email,
    password,
  });
  await user.save();
  const token = generateToken(res, user);

  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "strict", // Helps prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })
    .status(201)
    .json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
});
export const loginUser = tryCatchWrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ErrorResponse("Please provide all fields", 400);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ErrorResponse("Invalid credentials", 401);
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ErrorResponse("Invalid credentials", 401);
  }
  const token = generateToken(res, user);
  res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "strict", // Helps prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })
    .status(201)
    .json({
      success: true,
      message: "User login successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
});
export const getUserProfile = tryCatchWrapper((req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      userName: user.userName,
      email: user.email,
    },
  });
});

export const getUsers = tryCatchWrapper(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(200).json({
    success: true,
    users,
  });
});

export const logoutUser = tryCatchWrapper(async (req, res) => {
  res
    .cookie("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "strict", // Helps prevent CSRF attacks
      maxAge: 0, // Set to 0 to delete the cookie
    })
    .status(200)
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

export const deleteUser = tryCatchWrapper(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
