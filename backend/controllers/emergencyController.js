import EmergencyRequest from "../models/emergencyModel.js";
import Hospital from "../models/hospitalModel.js";

/**
 * @desc    File a new initial active emergency incident alert
 * @route   POST /api/emergency/request
 * @access  Private (Patient/User)
 */
export const createEmergencyRequest = async (req, res) => {
  const { emergencyType, severity, requiredDepartment, needsICU, needsVentilator, arrivalMode, longitude, latitude } = req.body;

  try {
    const emergency = await EmergencyRequest.create({
      patient: req.user._id,
      emergencyType,
      severity,
      requiredDepartment,
      needsICU: needsICU || false,
      needsVentilator: needsVentilator || false,
      arrivalMode,
      patientLocation: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    res.status(201).json({
      message: "Emergency request broadcast initiated successfully",
      emergency,
    });
  } catch (error) {
    console.error("❌ Emergency Request Creation Failure:", error);
    res.status(500).json({ message: "Server error logging critical incident parameters", error: error.message });
  }
};

/**
 * @desc    Get historical pipeline lists logged by an individual patient
 * @route   GET /api/emergency/patient-history
 * @access  Private (Patient)
 */
export const getPatientEmergencyHistory = async (req, res) => {
  try {
    const history = await EmergencyRequest.find({ patient: req.user._id })
      .populate("assignedHospital", "name location capacity")
      .sort({ createdAt: -1 });
    
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error querying target patient histories", error: error.message });
  }
};

/**
 * @desc    Fetch triage pipeline of incoming assignments for a specific hospital
 * @route   GET /api/emergency/hospital-queue
 * @access  Private (Hospital Only)
 */
export const getHospitalIncomingQueue = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital profile context missing" });
    }

    const queue = await EmergencyRequest.find({ 
      assignedHospital: hospital._id,
      status: { $in: ["Assigned", "En-Route", "Admitted"] }
    }).populate("patient", "name phoneNumber medicalHistory").sort({ createdAt: 1 });

    res.json(queue);
  } catch (error) {
    res.status(500).json({ message: "Server error parsing hospital operational queue", error: error.message });
  }
};

/**
 * @desc    Update status state adjustments for ongoing emergency tracking
 * @route   PUT /api/emergency/:id/status
 * @access  Private (Hospital/Admin/Patient)
 */
export const updateEmergencyStatus = async (req, res) => {
  const { status, assignedHospitalId } = req.body;

  try {
    const emergency = await EmergencyRequest.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({ message: "Target incident file record not found" });
    }

    if (status) emergency.status = status;
    if (assignedHospitalId) emergency.assignedHospital = assignedHospitalId;

    const updatedEmergency = await emergency.save();
    res.json({
      message: "Incident timeline tracking status modified",
      emergency: updatedEmergency,
    });
  } catch (error) {
    res.status(500).json({ message: "Server routing failure executing update tracking pipeline", error: error.message });
  }
};