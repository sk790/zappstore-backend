import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import cookieParser from "cookie-parser";

import userRoute from "./routes/userRoutes.js";
import serviceRoute from "./routes/serviceRoute.js";
import spRoute from "./routes/spRoute.js";

const app = express();

connectDB();
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoute);
app.use("/api/service", serviceRoute);
app.use("/api/sp", spRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
