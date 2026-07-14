import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Search, ShieldAlert, Navigation, 
  Clock, HardDrive, CheckCircle, HelpCircle, LogOut 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("mediRouteUserName") || "Emergency User";

  // Form states tracking dynamic triage variables
  const [formData, setFormData] = useState({
    emergencyType: "",
    severity: "Medium",
    requiredDepartment: "General",
    needsICU: false,
    needsVentilator: false,
    arrivalMode: "Ambulance",
    longitude: -73.935242, // Seed defaults (New York geo baseline, replace dynamically)
    latitude: 40.730610
  });

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Triggers geolocation acquisition from browser API
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          alert("📍 Geospatial coordinates successfully localized!");
        },
        () => alert("Unable to automatically capture location. Using standard default anchors.")
      );
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRecommendations(null);

    try {
      // 1. Instatiate the primary incident log pipeline item
      const incidentResponse = await API.post("/emergency/request", formData);
      const emergencyRequestId = incidentResponse.data.emergency._id;

      // 2. Pass incident item context to the scoring logic engine 
      const { data } = await API.post("/recommendation/process", { emergencyRequestId });
      setRecommendations(data.recommendedHospitals);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process AI routing recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      
      {/* 1. TOP SECURE WORKSPACE HUB HEADER */}
      <header className="w-full bg-white border-b border-gray-200/60 px-8 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2.5 font-bold text-gray-900 text-base">
          <div className="w-8 h-8 bg-[#0F62FE] rounded-xl flex items-center justify-center text-white">
            <Activity size={16} />
          </div>
          <span>MediRoute AI Console</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
          <span>Welcome, <strong className="text-gray-900">{userName}</strong></span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 hover:text-[#EF4444] transition text-xs border border-gray-200 rounded-lg px-2.5 py-1.5"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      {/* 2. CORE DASHBOARD CONTENT GRID LAYOUT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPONENT COLUMN: INCIDENT FORM PARAMETERS */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <ShieldAlert className="text-[#0F62FE]" size={20} />
            <h2 className="font-bold text-gray-900 text-lg">Triage Dispatch Query</h2>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Emergency Category / Condition</label>
              <input
                type="text"
                name="emergencyType"
                value={formData.emergencyType}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F62FE] transition"
                placeholder="e.g., Acute Chest Pain, Major Trauma"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Triage Severity</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F62FE] transition cursor-pointer"
                >
                  <option value="Critical">Critical (Immediate)</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Transport Mode</label>
                <select
                  name="arrivalMode"
                  value={formData.arrivalMode}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F62FE] transition cursor-pointer"
                >
                  <option value="Ambulance">Ambulance Fleet</option>
                  <option value="Private Vehicle">Private Transit</option>
                  <option value="Walking">Ambulatory / Walking</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Required Specialty Department</label>
              <select
                name="requiredDepartment"
                value={formData.requiredDepartment}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F62FE] transition cursor-pointer"
              >
                <option value="General">General Emergency Trauma</option>
                <option value="Cardiology">Cardiology Core</option>
                <option value="Neurology">Neurology / Stroke Care</option>
                <option value="Pediatrics">Pediatrics Care</option>
              </select>
            </div>

            <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Critical Unit Direct Routing Rules</span>
              <div className="flex gap-6 mt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" name="needsICU" checked={formData.needsICU} onChange={handleInputChange} className="rounded border-gray-300 accent-[#0F62FE] w-4 h-4" />
                  Isolate ICU Open Nodes
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                  <input type="checkbox" name="needsVentilator" checked={formData.needsVentilator} onChange={handleInputChange} className="rounded border-gray-300 accent-[#0F62FE] w-4 h-4" />
                  Require Open Ventilator
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={getUserLocation}
              className="w-full border border-dashed border-gray-300 hover:border-[#0F62FE] text-gray-600 hover:text-[#0F62FE] py-2 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <Navigation size={14} /> Sync Live Geolocation Anchors
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F62FE] hover:bg-[#0F62FE]/90 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? "Calculating Matrix Routing Vectors..." : "Execute AI Analysis Pipeline"}
              {!loading && <Search size={16} />}
            </button>
          </form>
        </div>

        {/* RIGHT COMPONENT COLUMN: INTERACTIVE RECOMMENDATION FEEDBACK CARDS */}
        <div className="lg:col-span-7 space-y-4">
          <AnimatePresence mode="wait">
            {error && (
              <div className="p-4 text-sm text-[#EF4444] bg-[#EF4444]/5 border border-[#EF4444]/10 rounded-2xl">
                {error}
              </div>
            )}

            {!recommendations && !loading && (
              <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center text-gray-400 border-dashed flex flex-col items-center justify-center">
                <HelpCircle size={40} className="mb-3 text-gray-300" />
                <h3 className="font-bold text-gray-700 text-base mb-1">Awaiting Telemetry Stream Ingest</h3>
                <p className="text-xs max-w-sm leading-relaxed">Fill in the triage forms parameters to initialize the high-performance Explainable AI network optimization matches.</p>
              </div>
            )}

            {loading && (
              <div className="space-y-4">
                {[1, 2].map((n) => (
                  <div key={n} className="bg-white border border-gray-200 rounded-3xl p-6 animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded-md w-1/3" />
                    <div className="h-4 bg-gray-200 rounded-md w-2/3" />
                    <div className="h-12 bg-gray-100 rounded-xl w-full" />
                  </div>
                ))}
              </div>
            )}

            {recommendations && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-4"
              >
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider pl-1">Top Matching Optimization Vectors</h3>
                {recommendations.map((item, index) => (
                  <motion.div
                    key={item._id || index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white border rounded-3xl p-6 shadow-sm relative overflow-hidden transition-all duration-300 ${index === 0 ? "border-[#10B981]/50 shadow-[0_4px_20px_rgba(16,185,129,0.06)]" : "border-gray-200"}`}
                  >
                    {index === 0 && (
                      <div className="absolute top-0 right-0 bg-[#10B981] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                        Optimized Target Alpha
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg tracking-tight">{item.hospital.name}</h4>
                        <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 mt-0.5">
                          <span className="flex items-center gap-1"><Navigation size={12}/>{item.metricsEvaluated.distanceKm} km</span>
                          <span className="flex items-center gap-1"><Clock size={12}/>{item.metricsEvaluated.estimatedTravelTimeMinutes} Mins Transit</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-gray-900">{item.aiScore}<span className="text-xs text-gray-400 font-normal">/100</span></div>
                        <span className="text-[10px] uppercase font-bold text-gray-400">Match Factor</span>
                      </div>
                    </div>

                    {/* Explainable AI (XAI) Block */}
                    <div className="bg-[#F8FAFC] border border-gray-100 rounded-2xl p-4 mb-4 text-xs text-gray-600 leading-relaxed flex gap-2.5 items-start">
                      <CheckCircle size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-900 block font-bold mb-0.5">Decision Telemetry Matrix Reasoning:</strong>
                        {item.reasoningSummary}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                        <span className="block font-medium text-gray-400 mb-0.5">Queue Delay</span>
                        <strong className="font-bold text-gray-800">{item.metricsEvaluated.predictedWaitTimeMinutes} Min</strong>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                        <span className="block font-medium text-gray-400 mb-0.5">Beds Open</span>
                        <strong className="font-bold text-gray-800">{item.metricsEvaluated.availableBedsCount} Units</strong>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                        <span className="block font-medium text-gray-400 mb-0.5">ICU Open</span>
                        <strong className="font-bold text-gray-800">{item.metricsEvaluated.availableICUCount} Units</strong>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
};

export default PatientDashboard;