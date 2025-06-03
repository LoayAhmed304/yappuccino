import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import { Request, Response } from "express";
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    res
      .status(400)
      .json({ status: "fail", message: "All fields are required" });
    return;
  }
  try {
    if (password.length < 6) {
      res
        .status(400)
        .json({ status: "fail", message: "Password is too short (<6)" });
      return;
    }

    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({
        status: "fail",
        message: "user already exists with this email",
      });
      return;
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
      generateToken(newUser._id.toString(), res);
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
  } catch (err) {
    console.log("ERROR:", err);

    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ status: "fail", message: "All fields are required" });
    return;
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        status: "fail",
        message: "Invalid credentials",
      });
      return;
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      res.status(404).json({
        status: "fail",
        message: "Invalid credentials",
      });
      return;
    }

    generateToken(user._id.toString(), res);

    res.status(200).json({
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

    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const logout = (req: Request, res: Response): void => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ status: "fail", message: "Server error" + err });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ status: "fail", message: "Unauthorized" });
      return;
    }
    if (!profilePic) {
      res
        .status(400)
        .json({ status: "fail", message: "Profile pic is required" });
      return;
    }

    const response = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
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
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ status: "success", data: req.user });
  } catch {
    res.status(500).json({ status: "fail", message: "Server error" });
  }
};
