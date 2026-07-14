import express from "express";
import { getAdminAnalytics, getHospitalAnalytics } from "../controllers/analyticsController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Role-restricted analytics routes
router.get("/admin-dashboard", protect, authorizeRoles("admin"), getAdminAnalytics);
router.get("/hospital-dashboard", protect, authorizeRoles("hospital"), getHospitalAnalytics);

export default router;