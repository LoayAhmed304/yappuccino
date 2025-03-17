import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getSidebarUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");

    res.status(200).json({
      status: "success",
      data: { ...filteredUsers },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      message: "Server error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: him } = req.params;
    const me = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: me, receverId: him },
        { senderId: him, receiverId: me },
      ],
    });

    res.status(200).json({
      status: "success",
      data: { messages },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      message: "Server error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const response = await cloudinary.uploader.upload(image);
      imageUrl = response.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    // socket.io is here:

    ////////
    res.status(201).json({
      status: "success",
      data: { newMessage },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "fail",
      message: "Server error",
    });
  }
};
