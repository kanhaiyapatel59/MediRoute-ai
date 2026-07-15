import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js";
import Hospital from "./models/hospitalModel.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not set in environment");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    // 1) Ensure admin exists
    const adminExists = await User.findOne({ email: "admin@mediroute.ai" });
    if (!adminExists) {
      await User.create({
        name: "System Administrator",
        email: "admin@mediroute.ai",
        password: "AdminSecurePassword2026", // will be hashed
        role: "admin",
        phoneNumber: "+15550199",
        isVerified: true,
      });
      console.log("🚀 Admin account created successfully!");
    } else {
      console.log("ℹ️ Admin already exists!");
    }

    // 2) Ensure at least one hospital hub exists (for dev recommendation flow)
    const anyHospitalExists = (await Hospital.findOne({}));
    if (!anyHospitalExists) {
      const hospitalUser = await User.create({
        name: "Sample Hospital Hub",
        email: "hub@mediroute.ai",
        password: "HubSecurePassword2026",
        role: "hospital",
        phoneNumber: "+15550100",
        isVerified: true,
      });

      await Hospital.create({
        user: hospitalUser._id,
        name: "Sample Hospital Hub",
        licenseNumber: "HUB-0001",
        location: {
          type: "Point",
          coordinates: [-73.985664, 40.748514], // lng, lat
          address: "1 Sample Street",
          city: "Sample City",
          state: "NY",
          zipCode: "10001",
        },
        rating: 4.5,
        contactNumbers: ["+15550100"],
        capacity: {
          totalBeds: 200,
          availableBeds: 120,
          totalICUBeds: 50,
          availableICUBeds: 20,
          ventilatorsTotal: 30,
          ventilatorsAvailable: 12,
        },
        emergencyQueue: {
          activePatients: 10,
          averageWaitTimeMinutes: 12,
          doctorAvailabilityStatus: "High",
        },
        specialties: ["Cardiology", "Trauma"],
        isActiveEmergencyHub: true,
      });

      console.log("🚑 Sample hospital hub seeded successfully!");
    } else {
      console.log("ℹ️ Hospitals already exist, skipping hospital seed.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();

