import mongoose from "mongoose";

const emergencyRequestSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    emergencyType: {
      type: String,
      required: [true, "Emergency condition or category is required"],
      trim: true, // e.g., "Cardiac Arrest", "Trauma/Accident", "Respiratory Distress"
    },
    severity: {
      type: String,
      enum: ["Critical", "High", "Medium", "Low"],
      required: true,
    },
    requiredDepartment: {
      type: String,
      required: true, // e.g., "Cardiology", "Trauma", "Pediatrics"
    },
    needsICU: {
      type: Boolean,
      default: false,
    },
    needsVentilator: {
      type: Boolean,
      default: false,
    },
    arrivalMode: {
      type: String,
      enum: ["Ambulance", "Private Vehicle", "Walking"],
      required: true,
    },
    patientLocation: {
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
    assignedHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: null, // Assigned after recommendation logic runs
    },
    status: {
      type: String,
      enum: ["Pending", "Assigned", "En-Route", "Admitted", "Resolved", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Indexing location for proximity optimization calculations
emergencyRequestSchema.index({ patientLocation: "2dsphere" });

const EmergencyRequest = mongoose.model("EmergencyRequest", emergencyRequestSchema);
export default EmergencyRequest;