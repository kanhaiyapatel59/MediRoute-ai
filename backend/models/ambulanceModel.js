import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number plate is required"],
      unique: true,
      trim: true,
    },
    providerType: {
      type: String,
      enum: ["Hospital-Owned", "Private-Service", "Government-Emergency"],
      required: true,
    },
    associatedHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: null, // Can be null if third-party private/govt fleet
    },
    driverName: {
      type: String,
      required: true,
    },
    driverPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Available", "Dispatched", "En-Route-To-Hospital", "Maintenance"],
      default: "Available",
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

ambulanceSchema.index({ currentLocation: "2dsphere" });

const Ambulance = mongoose.model("Ambulance", ambulanceSchema);
export default Ambulance;