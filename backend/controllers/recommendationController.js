import aiRecommendationService from "../services/aiRecommendationService.js";

/**
 * @desc    Generate optimized hospital recommendations via structural business services
 * @route   POST /api/recommendation/process
 * @access  Private (Patient/Emergency Dispatch)
 */
export const processHospitalRecommendation = async (req, res) => {
  const { emergencyRequestId } = req.body;

  // Structural edge check for inbound parameters
  if (!emergencyRequestId) {
    return res.status(400).json({ 
      message: "Processing failure: 'emergencyRequestId' parameter is required in request payload." 
    });
  }

  try {
    // Delegate all algorithmic processing and database modifications to the service layer
    const recommendationResult = await aiRecommendationService.generateTopRecommendations(emergencyRequestId);
    
    // Respond cleanly to HTTP client with calculated options
    return res.status(200).json(recommendationResult);
  } catch (error) {
    console.error("❌ Recommendation Controller Error:", error);
    
    // Catch-all response mapping exceptions caught by the internal execution framework
    return res.status(500).json({ 
      message: error.message || "Critical internal routing exception processed inside recommendation module",
      error: error.message 
    });
  }
};