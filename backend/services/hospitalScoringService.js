/**
 * Service handling algorithmic scoring calculations for individual hospital nodes
 */
class HospitalScoringService {
  /**
   * Computes the straight-line Haversine distance between two geospatial coordinates
   * @param {number} lat1 - Patient Latitude
   * @param {number} lon1 - Patient Longitude
   * @param {number} lat2 - Hospital Latitude
   * @param {number} lon2 - Hospital Longitude
   * @returns {number} Distance in kilometers
   */
  calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Generates a composite recommendation matrix score between 0 and 100
   * @param {Object} hospital - The Mongoose Hospital document instance
   * @param {Object} emergencyIncident - The current EmergencyRequest parameters
   * @returns {Object} Metric evaluation mapping containing the absolute score, distance, and XAI reasoning
   */
  evaluateHospitalScore(hospital, emergencyIncident) {
    const [patientLng, patientLat] = emergencyIncident.patientLocation.coordinates;
    const [hospitalLng, hospitalLat] = hospital.location.coordinates;

    // 1. Structural Distance Metrics
    const distanceKm = this.calculateHaversineDistance(patientLat, patientLng, hospitalLat, hospitalLng);
    
    // Estimate transit times assuming standard vehicle routing profiles (40km/h average city speed + overhead)
    const estimatedTravelTimeMinutes = Math.round((distanceKm / 40) * 60) + 5;

    // 2. Extract live hospital capacity indicators
    const currentWaitTime = hospital.emergencyQueue.averageWaitTimeMinutes;
    const availableBeds = hospital.capacity.availableBeds;
    const availableICUBeds = hospital.capacity.availableICUBeds;
    const hospitalRating = hospital.rating || 4.0;

    // 3. Mathematical Composite Matrix Algorithm
    let baseScore = 100;

    // Proximity Penalty Vector (Max -25 points)
    baseScore -= Math.min(distanceKm * 1.5, 25);

    // Operational Delay / Waiting Latency Penalty Vector (Max -25 points)
    baseScore -= Math.min(currentWaitTime * 0.4, 25);

    // Hard Capacity Constraints
    if (emergencyIncident.needsICU && availableICUBeds === 0) {
      baseScore -= 40; // Severe penalty for lack of critical specialized infrastructure
    } else if (!emergencyIncident.needsICU && availableBeds === 0) {
      baseScore -= 30; // Standard bed depletion variance penalty
    }

    // Reputation Bias Adjustments
    baseScore += (hospitalRating - 4.0) * 5;

    // Normalize absolute output boundaries cleanly to [10, 100]
    const finalAIScore = Math.max(10, Math.min(Math.round(baseScore), 100));
    const confidenceScore = parseFloat((0.85 + (finalAIScore / 1000)).toFixed(2));

    // 4. Explainable AI (XAI) Natural Language Formulation Engine
    let reasoningSummary = `Selected because it maintains a premium reliability index of ${finalAIScore}/100. `;
    if (emergencyIncident.needsICU && availableICUBeds > 0) {
      reasoningSummary += `Features critical capability with ${availableICUBeds} dedicated ICU beds open. `;
    }
    reasoningSummary += `Located ${distanceKm.toFixed(1)} km away with an estimated ambulance transit horizon of ${estimatedTravelTimeMinutes} minutes and a nominal queue latency of ${currentWaitTime} minutes.`;

    return {
      hospitalId: hospital._id,
      aiScore: finalAIScore,
      confidenceScore,
      reasoningSummary,
      metricsEvaluated: {
        distanceKm: parseFloat(distanceKm.toFixed(2)),
        estimatedTravelTimeMinutes,
        predictedWaitTimeMinutes: currentWaitTime,
        availableBedsCount: availableBeds,
        availableICUCount: availableICUBeds
      }
    };
  }
}

export default new HospitalScoringService();