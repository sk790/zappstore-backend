import express from "express";
import {
  getProfile,
  login,
  signup,
  updateLocation,
  updateProfile,
} from "../controllers/userController.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/update-profile").post(verifyUser, updateProfile);
router.route("/get-profile").get(verifyUser, getProfile);
router.route("/update-location").post(updateLocation);

export default router;
