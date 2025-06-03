import express from "express";

import { authProtection } from "../middleware/auth.js";
import {
  deleteUser,
  getUserProfile,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authProtection, getUserProfile);
router.get("/", getUsers);
router.get("/logout", authProtection, logoutUser);
router.delete("/:id", deleteUser);

export default router;
