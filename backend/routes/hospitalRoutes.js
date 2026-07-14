import express from "express";
import { updateHospitalResources, getMyHospitalProfile, getAllHospitals } from "../controllers/hospitalController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public open query endpoint
router.get("/", getAllHospitals);

// Private dashboard endpoints restricted to authenticated structural hospital accounts
router.get("/profile", protect, authorizeRoles("hospital"), getMyHospitalProfile);
router.put("/resources", protect, authorizeRoles("hospital"), updateHospitalResources);

export default router;