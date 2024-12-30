import express from "express";
import { addService } from "../controllers/serviceController.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.route("/add-service").post(verifyUser, addService);

export default router;
