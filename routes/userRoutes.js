import express from "express";
import {
  getProfile,
  login,
  signup,
  updateLocation,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/update-profile").post(updateProfile);
router.route("/get-profile").get(getProfile);
router.route("/update-location").post(updateLocation);

export default router;
