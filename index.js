import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";

import userRouter from "./routes/userRoutes.js";

const app = express();

import dotenv from "dotenv";
dotenv.config();

connectDB();
app.use(express.json());

app.use("/api/user", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
