import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
dotenv.config();

const app = express();

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server listening on port ", process.env.PORT);
  connectDB();
});
