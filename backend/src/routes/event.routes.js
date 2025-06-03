import express from "express";

import { authProtection } from "../middleware/auth.js";
import {
  deleteEvent,
  createEvent,
  getEvent,
  getEvents,
  updateEvent,
  getParticularUserEvents,
} from "../controller/event.controller.js";

const router = express.Router();

router.post("/create", authProtection, createEvent);
router.get("/user", authProtection, getParticularUserEvents);
router.get("/", authProtection, getEvents);
router.get("/:id", authProtection, getEvent);
router.put("/:id", authProtection, updateEvent);
router.delete("/:id", authProtection, deleteEvent);

export default router;
