import { ObjectId } from "mongodb";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { Request, Response } from "express";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { encryptMessage, decryptMessage } from "../lib/utils.js";

export const getSidebarUsers = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user?._id;
    if (!loggedInUser) {
      res.status(401).json({
        status: "fail",
        message: "Unauthorized access",
      });
      return;
    }

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    res.status(200).json({
      status: "success",
      data: filteredUsers,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      message: "Server error",
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: himString } = req.params;
    const me = req.user?._id;

    // Convert string ID to ObjectId for proper comparison
    const him = new ObjectId(himString);

    if (!me) {
      res.status(401).json({
        status: "fail",
        message: "Unauthorized access",
      });
      return;
    }

    const messages = await Message.find({
      $or: [
        { senderId: me, receiverId: him },
        { senderId: him, receiverId: me },
      ],
    });

    const decryptedMessages = messages.map((msg) => ({
      ...msg.toObject(),
      text: msg.text ? decryptMessage(msg.text) : null,
    }));

    res.status(200).json({
      status: "success",
      data: { messages: decryptedMessages },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      message: "Server error",
    });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    let imageUrl;
    if (image) {
      const response = await cloudinary.uploader.upload(image);
      imageUrl = response.secure_url;
    }
    const encryptedText = text ? encryptMessage(text) : null;
    const newMessage = new Message({
      senderId,
      receiverId,
      text: encryptedText,
      image: imageUrl,
    });
    await newMessage.save();

    // socket.io is here:
    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log(`Receiver Socket ID: ${receiverSocketId}`);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        ...newMessage.toObject(),
        text: decryptMessage(newMessage.text ?? ""),
      });
    } else {
      console.log(`No socket found for receiver ID: ${receiverId}`);
    }

    res.status(201).json({
      status: "success",
      data: {
        newMessage: {
          ...newMessage.toObject(),
          text: decryptMessage(newMessage.text ?? ""),
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      message: "Server error",
    });
  }
};
