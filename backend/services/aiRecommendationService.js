import Hospital from "../models/hospitalModel.js";
import Recommendation from "../models/recommendationModel.js";
import EmergencyRequest from "../models/emergencyModel.js";
import hospitalScoringService from "./hospitalScoringService.js";

/**
 * Orchestrator service running multi-facility matches and managing prediction allocations
 */
class AIRecommendationService {
  /**
   * Processes a live emergency incident file and matches it against the best hospital hub nodes
   * @param {string} emergencyRequestId - The MongoDB target object id for the active request
   * @returns {Object} Fully populated, saved Mongoose Recommendation document structure
   */
  async generateTopRecommendations(emergencyRequestId) {
    // 1. Pull target incident metadata from database context
    const incident = await EmergencyRequest.findById(emergencyRequestId);
    if (!incident) {
      throw new Error("Target emergency incident record could not be located");
    }

    // 2. Fetch all functional emergency hospital nodes currently accepting traffic
    const activeHospitals = await Hospital.find({ isActiveEmergencyHub: true });
    if (!activeHospitals || activeHospitals.length === 0) {
      throw new Error("No active emergency hospital hubs registered in the regional routing grid");
    }

    // 3. Batch process scoring metrics across available nodes
    // NOTE: This array structure is explicitly kept clean so it can be passed natively to an
    // HTTP/FastAPI client link once the predictive ML models are deployed.
    const calculatedScores = activeHospitals.map(hospital => {
      return hospitalScoringService.evaluateHospitalScore(hospital, incident);
    });

    // 4. Sorting logic: Highest algorithmic score ranked first
    calculatedScores.sort((a, b) => b.aiScore - a.aiScore);

    // Take the top 5 optimized target nodes to populate recommendation array
    const topMatches = calculatedScores.slice(0, 5).map(match => ({
      hospital: match.hospitalId,
      aiScore: match.aiScore,
      confidenceScore: match.confidenceScore,
      reasoningSummary: match.reasoningSummary,
      metricsEvaluated: match.metricsEvaluated
    }));

    // 5. Database Commit: Archive recommendation parameters into analytics database
    const recommendationLog = await Recommendation.create({
      emergencyRequest: incident._id,
      patient: incident.patient,
      recommendedHospitals: topMatches
    });

    // 6. State Mutation: Auto-route the incident to the top-scoring hospital node
    incident.assignedHospital = topMatches[0].hospital;
    incident.status = "Assigned";
    await incident.save();

    // Return the results with populated references for controller utility parsing
    return await Recommendation.findById(recommendationLog._id)
      .populate("recommendedHospitals.hospital", "name location contactNumbers capacity rating");
  }
}

export default new AIRecommendationService();