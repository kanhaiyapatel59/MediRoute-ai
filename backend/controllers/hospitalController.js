import Hospital from "../models/hospitalModel.js";

/**
 * @desc    Update live hospital resource metrics (Beds, ICU, Ventilators, Queue)
 * @route   PUT /api/hospitals/resources
 * @access  Private (Hospital Only)
 */
export const updateHospitalResources = async (req, res) => {
  const { totalBeds, availableBeds, totalICUBeds, availableICUBeds, ventilatorsTotal, ventilatorsAvailable, activePatients, averageWaitTimeMinutes, doctorAvailabilityStatus } = req.body;

  try {
    // Locate the hospital record bound to the authenticated User context
    const hospital = await Hospital.findOne({ user: req.user._id });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital profile context not found for this account" });
    }

    // Dynamic field updating with strict typing fallback assertions
    if (totalBeds !== undefined) hospital.capacity.totalBeds = totalBeds;
    if (availableBeds !== undefined) hospital.capacity.availableBeds = availableBeds;
    if (totalICUBeds !== undefined) hospital.capacity.totalICUBeds = totalICUBeds;
    if (availableICUBeds !== undefined) hospital.capacity.availableICUBeds = availableICUBeds;
    if (ventilatorsTotal !== undefined) hospital.capacity.ventilatorsTotal = ventilatorsTotal;
    if (ventilatorsAvailable !== undefined) hospital.capacity.ventilatorsAvailable = ventilatorsAvailable;
    
    if (activePatients !== undefined) hospital.emergencyQueue.activePatients = activePatients;
    if (averageWaitTimeMinutes !== undefined) hospital.emergencyQueue.averageWaitTimeMinutes = averageWaitTimeMinutes;
    if (doctorAvailabilityStatus !== undefined) hospital.emergencyQueue.doctorAvailabilityStatus = doctorAvailabilityStatus;

    const updatedHospital = await hospital.save();
    res.json({
      message: "Hospital real-time metrics updated successfully",
      capacity: updatedHospital.capacity,
      emergencyQueue: updatedHospital.emergencyQueue,
    });
  } catch (error) {
    console.error("❌ Resource Update Error:", error);
    res.status(500).json({ message: "Server error during resource validation update", error: error.message });
  }
};

/**
 * @desc    Get current authenticated hospital profile data
 * @route   GET /api/hospitals/profile
 * @access  Private (Hospital Only)
 */
export const getMyHospitalProfile = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital profile details not found" });
    }
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching hospital dashboard data", error: error.message });
  }
};

/**
 * @desc    Get all hospitals tracking stream (For open metrics visibility)
 * @route   GET /api/hospitals
 * @access  Public
 */
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isActiveEmergencyHub: true }).populate("user", "name email phoneNumber");
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching active database hub lists", error: error.message });
  }
};