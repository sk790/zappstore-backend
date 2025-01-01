import express from "express";
import {
  getProfile,
  login,
  sendOtp,
  updateProfile,
  verifyOtp,
} from "../controllers/userController.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.route("/send-otp").post(sendOtp);
router.route("/verify-otp").post(verifyOtp);
router.route("/login").post(login);
router.route("/update-profile").post(verifyUser, updateProfile);
router.route("/get-profile").get(verifyUser, getProfile);

export default router;
