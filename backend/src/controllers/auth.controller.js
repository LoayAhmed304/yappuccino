import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

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
        status: "success",
        data: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      res.status(400).json({ status: "fail", message: "Failed to create" });
    }
  } catch {
    console.log("ERROR:", err);

    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "fail", message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid credentials",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid credentials",
      });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      status: "success",
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.log("ERROR:", err);

    return res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res
        .status(400)
        .json({ status: "fail", message: "Profile pic is required" });
    }

    const response = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePic: response.secure_url,
      },
      { new: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  } catch (err) {}
};

export const checkAuth = async (req, res, next) => {
  try {
    res.status(200).json({ status: "success", data: req.user });
  } catch (err) {
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};
