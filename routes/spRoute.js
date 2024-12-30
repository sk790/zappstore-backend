import express from "express";
import {
  getSpByCategoryAndDiastance,
  getSpBySearch,
} from "../controllers/spController.js";
const router = express.Router();

router.route("/get-sp").post(getSpByCategoryAndDiastance);
router.route("/search-sp").post(getSpBySearch);

export default router;
