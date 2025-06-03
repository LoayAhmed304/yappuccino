import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }
    const conn = await mongoose.connect(uri);
    
    if(!conn) {
      throw new Error("Failed to connect to the database");
    }

    console.log("Connected successfully to the DB!");
  } catch (err) {
    console.log("Error occured: ", err);
  }
};
