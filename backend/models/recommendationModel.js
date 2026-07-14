import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    emergencyRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmergencyRequest",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recommendedHospitals: [
      {
        hospital: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hospital",
          required: true,
        },
        aiScore: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        metricsEvaluated: {
          distanceKm: Number,
          estimatedTravelTimeMinutes: Number,
          predictedWaitTimeMinutes: Number,
          availableBedsCount: Number,
          availableICUCount: Number,
        },
        confidenceScore: {
          type: Number,
          required: true, // e.g., 0.94 (94%)
        },
        reasoningSummary: {
          type: String,
          required: true, // Detailed "Why this hospital was selected" string
        },
      }
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recommendation = mongoose.model("Recommendation", recommendationSchema);
export default Recommendation;