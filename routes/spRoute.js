import express from "express";
import { getSp } from "../controllers/spController.js";
const router = express.Router();

router.route("/get-sp").get(getSp);

export default router;
