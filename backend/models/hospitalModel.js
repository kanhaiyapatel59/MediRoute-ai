import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Hospital name is required"],
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: [true, "Medical license number is required"],
      unique: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, "Geospatial coordinates are required"],
      },
      address: String,
      city: String,
      state: String,
      zipCode: String,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    contactNumbers: [String],
    // Infrastructure Metrics (Crucial for the ML Scoring Engine)
    capacity: {
      totalBeds: { type: Number, required: true, default: 0 },
      availableBeds: { type: Number, required: true, default: 0 },
      totalICUBeds: { type: Number, required: true, default: 0 },
      availableICUBeds: { type: Number, required: true, default: 0 },
      ventilatorsTotal: { type: Number, default: 0 },
      ventilatorsAvailable: { type: Number, default: 0 },
    },
    // Emergency Status Live Metrics
    emergencyQueue: {
      activePatients: { type: Number, default: 0 },
      averageWaitTimeMinutes: { type: Number, default: 15 }, // Seed value for AI fallback
      doctorAvailabilityStatus: {
        type: String,
        enum: ["High", "Medium", "Low", "Critical"],
        default: "Medium",
      },
    },
    specialties: [String], // e.g., ["Cardiology", "Trauma", "Pediatrics"]
    isActiveEmergencyHub: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Enable 2dsphere indexing for high-performance geospatial distance calculations
hospitalSchema.index({ location: "2dsphere" });

const Hospital = mongoose.model("Hospital", hospitalSchema);
export default Hospital;