import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js"; // Import analytics path

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Main App API Routes
app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/recommendation", recommendationRoutes);
app.use("/api/analytics", analyticsRoutes); // Mounted Analytics Engine

app.get("/", (req, res) => {
  res.json({
    message: "MediRoute AI Backend Running 🚑",
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});