import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ status: "fail", message: "All fields are required" });
  }
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ status: "fail", message: "Password is too short (<6)" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: "fail",
        message: "user already exists with this email",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate the jwt token
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ status: "fail", message: "Failed to create" });
    }
  } catch {
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};
export const login = (req, res) => {
  res.send("login");
};
export const logout = (req, res) => {
  res.send("logout");
};
