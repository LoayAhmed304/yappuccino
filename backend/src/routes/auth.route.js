import express from "express";

import {
  signup,
  login,
  logout,
  updateProfile,
  protect,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protect, updateProfile);

export default router;
