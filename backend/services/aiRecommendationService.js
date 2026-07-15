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

    // Dev-safety fallback: if no active emergency hubs exist, use all hospitals so the pipeline can proceed.
    const hospitalsForScoring =
      activeHospitals && activeHospitals.length > 0 ? activeHospitals : await Hospital.find({});

    if (!hospitalsForScoring || hospitalsForScoring.length === 0) {
      throw new Error("No hospitals found to generate recommendations");
    }

    // 3. Batch process scoring metrics across available nodes
    const calculatedScores = hospitalsForScoring.map((hospital) => {
      return hospitalScoringService.evaluateHospitalScore(hospital, incident);
    });

    // 4. Sorting logic: Highest algorithmic score ranked first
    calculatedScores.sort((a, b) => b.aiScore - a.aiScore);

    // Take the top 5 optimized target nodes to populate recommendation array
    const topMatches = calculatedScores.slice(0, 5).map((match) => ({
      hospital: match.hospitalId,
      aiScore: match.aiScore,
      confidenceScore: match.confidenceScore,
      reasoningSummary: match.reasoningSummary,
      metricsEvaluated: match.metricsEvaluated,
    }));

    // 5. Database Commit: Archive recommendation parameters into analytics database
    const recommendationLog = await Recommendation.create({
      emergencyRequest: incident._id,
      patient: incident.patient,
      recommendedHospitals: topMatches,
    });

    // 6. State Mutation: Auto-route the incident to the top-scoring hospital node
    incident.assignedHospital = topMatches[0].hospital;
    incident.status = "Assigned";
    await incident.save();

    // Return the results with populated references for controller utility parsing
    return await Recommendation.findById(recommendationLog._id).populate(
      "recommendedHospitals.hospital",
      "name location contactNumbers capacity rating"
    );
  }
}

export default new AIRecommendationService();

