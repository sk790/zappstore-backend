import express from "express";
import { login, signup, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/update-profile').post(updateProfile);

export default router