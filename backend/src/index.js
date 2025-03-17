import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () =>
  console.log("Server listening on port ", process.env.PORT)
);
