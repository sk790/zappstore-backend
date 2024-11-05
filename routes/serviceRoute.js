import express from "express";
import { addService } from "../controllers/serviceController.js";

const router = express.Router();

router.route('/add-service').post(addService);


export default router