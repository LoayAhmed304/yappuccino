import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getSidebarUsers,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
const router = express.Router();

router.get("/user", protect, getSidebarUsers);

router.get("/:id", protect, getMessages);

router.post("/send/:id", protect, sendMessage);

export default router;
