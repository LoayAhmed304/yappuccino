import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully to the DB!");
  } catch (err) {
    console.log("Error occured: ", err);
  }
};
