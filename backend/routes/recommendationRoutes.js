import express from "express";
import { processHospitalRecommendation } from "../controllers/recommendationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route configuration bound directly behind protected access layers
router.post("/process", protect, processHospitalRecommendation);

export default router;