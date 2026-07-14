import express from "express";
import { createEmergencyRequest, getPatientEmergencyHistory, getHospitalIncomingQueue, updateEmergencyStatus } from "../controllers/emergencyController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route mappings
router.post("/request", protect, authorizeRoles("patient"), createEmergencyRequest);
router.get("/patient-history", protect, authorizeRoles("patient"), getPatientEmergencyHistory);
router.get("/hospital-queue", protect, authorizeRoles("hospital"), getHospitalIncomingQueue);
router.put("/:id/status", protect, updateEmergencyStatus);

export default router;