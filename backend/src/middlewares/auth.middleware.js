import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ status: "fail", mesage: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ status: "fail", mesage: "Invalid" });
    }
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ status: "fail", mesage: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};
