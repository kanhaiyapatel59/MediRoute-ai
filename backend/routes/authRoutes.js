import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public facing routing structures
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes requiring header validation checks
router.route("/profile").get(protect, getUserProfile);

export default router;