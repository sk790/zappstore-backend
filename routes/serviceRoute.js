import express from "express";
import {
  addCategory,
  addService,
  getCategories,
} from "../controllers/serviceController.js";
import { verifyUser } from "../middlewares/verifyUser.js";

const router = express.Router();

router.route("/add-service").post(verifyUser, addService);
router.route("/add-category").post(verifyUser, addCategory);
router.route("/get-categories").get(verifyUser, getCategories);

export default router;
