import Hospital from "../models/hospitalModel.js";
import EmergencyRequest from "../models/emergencyModel.js";
import Recommendation from "../models/recommendationModel.js";
import User from "../models/userModel.js";

/**
 * @desc    Compile high-level system analytics for the platform Admin Portal
 * @route   GET /api/analytics/admin-dashboard
 * @access  Private (Admin Only)
 */
export const getAdminAnalytics = async (req, res) => {
  try {
    // 1. Fetch total counts across core entities
    const absoluteHospitalsCount = await Hospital.countDocuments({});
    const absolutePatientsCount = await User.countDocuments({ role: "patient" });
    const absoluteTotalEmergencies = await EmergencyRequest.countDocuments({});
    
    // 2. Fetch specific live incident tracking statuses
    const activeEmergencies = await EmergencyRequest.countDocuments({
      status: { $in: ["Pending", "Assigned", "En-Route"] }
    });

    // 3. Compute aggregate infrastructural availability balances across all connected nodes
    const totalCapacityMetrics = await Hospital.aggregate([
      {
        $group: {
          _id: null,
          totalBeds: { $sum: "$capacity.totalBeds" },
          availableBeds: { $sum: "$capacity.availableBeds" },
          totalICUBeds: { $sum: "$capacity.totalICUBeds" },
          availableICUBeds: { $sum: "$capacity.availableICUBeds" },
          globalAvgWaitTime: { $avg: "$emergencyQueue.averageWaitTimeMinutes" }
        }
      }
    ]);

    const aggregateMetrics = totalCapacityMetrics[0] || {
      totalBeds: 0, availableBeds: 0, totalICUBeds: 0, availableICUBeds: 0, globalAvgWaitTime: 0
    };

    // 4. Generate data arrays tailored to build Recharts charts on the frontend
    const monthlyIncidentTrend = await EmergencyRequest.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Format months natively for readable charts (e.g., [ { month: "Jan", incidents: 120 } ])
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedIncidentTrend = monthlyIncidentTrend.map(item => ({
      name: monthNames[item._id] || `Month ${item._id}`,
      incidents: item.count
    }));

    res.status(200).json({
      summaryCards: {
        totalRegisteredHospitals: absoluteHospitalsCount,
        totalRegisteredPatients: absolutePatientsCount,
        lifetimeEmergenciesLogged: absoluteTotalEmergencies,
        liveActiveEmergencies: activeEmergencies,
        infrastructure: {
          globalTotalBeds: aggregateMetrics.totalBeds,
          globalAvailableBeds: aggregateMetrics.availableBeds,
          globalTotalICU: aggregateMetrics.totalICUBeds,
          globalAvailableICU: aggregateMetrics.availableICUBeds,
          networkAverageWaitTimeMinutes: Math.round(aggregateMetrics.globalAvgWaitTime)
        }
      },
      chartsData: {
        incidentTrend: formattedIncidentTrend
      }
    });

  } catch (error) {
    console.error("❌ Admin Analytics Compilation Error:", error);
    res.status(500).json({ message: "Internal server error gathering aggregate monitoring statistics", error: error.message });
  }
};

/**
 * @desc    Compile dedicated operational intelligence metrics for a distinct Hospital Panel
 * @route   GET /api/analytics/hospital-dashboard
 * @access  Private (Hospital Only)
 */
export const getHospitalAnalytics = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({ user: req.user._id });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital execution context missing" });
    }

    // 1. Gather historical incident insights unique to this hospital node
    const absoluteTotalAssignments = await EmergencyRequest.countDocuments({ assignedHospital: hospital._id });
    const admissionsResolved = await EmergencyRequest.countDocuments({ assignedHospital: hospital._id, status: "Resolved" });
    
    // 2. Fetch data arrays to map the current structural queue state
    const severityDistribution = await EmergencyRequest.aggregate([
      { $match: { assignedHospital: hospital._id, status: { $in: ["Assigned", "En-Route", "Admitted"] } } },
      { $group: { _id: "$severity", count: { $sum: 1 } } }
    ]);

    const formattedSeverity = severityDistribution.map(item => ({
      name: item._id,
      value: item.count
    }));

    res.status(200).json({
      liveMetrics: {
        availableBeds: hospital.capacity.availableBeds,
        totalBeds: hospital.capacity.totalBeds,
        availableICUBeds: hospital.capacity.availableICUBeds,
        totalICUBeds: hospital.capacity.totalICUBeds,
        currentActiveQueueCount: hospital.emergencyQueue.activePatients,
        currentWaitTimeMinutes: hospital.emergencyQueue.averageWaitTimeMinutes
      },
      historicalSummary: {
        lifetimeAssignments: absoluteTotalAssignments,
        totalResolvedCases: admissionsResolved
      },
      chartsData: {
        severityMix: formattedSeverity // Feeds directly into a Recharts PieChart component
      }
    });

  } catch (error) {
    console.error("❌ Hospital Analytics Compilation Error:", error);
    res.status(500).json({ message: "Internal server error assembling hospital system metrics", error: error.message });
  }
};