import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Activity, RefreshCw, Save, ActivitySquare, 
  Users, Layers, Clock, LogOut, CheckCircle, ShieldAlert 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const hospitalName = localStorage.getItem("mediRouteUserName") || "Hospital Node";

  // State configurations matching our MongoDB capacity objects
  const [resources, setResources] = useState({
    totalBeds: 0,
    availableBeds: 0,
    totalICUBeds: 0,
    availableICUBeds: 0,
    activePatients: 0,
    averageWaitTimeMinutes: 15,
    doctorAvailabilityStatus: "Medium"
  });

  const [inboundQueue, setInboundQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // 1. Fetch current profile data streams and active queue arrays on viewport load
  useEffect(() => {
    fetchHospitalData();
  }, []);

  const fetchHospitalData = async () => {
    setLoading(true);
    try {
      // Parallel ingest requests using our Axios connection channel
      const [profileRes, queueRes] = await Promise.all([
        API.get("/hospitals/profile"),
        API.get("/emergency/hospital-queue")
      ]);

      if (profileRes.data) {
        const { capacity, emergencyQueue } = profileRes.data;
        setResources({
          totalBeds: capacity.totalBeds || 0,
          availableBeds: capacity.availableBeds || 0,
          totalICUBeds: capacity.totalICUBeds || 0,
          availableICUBeds: capacity.availableICUBeds || 0,
          activePatients: emergencyQueue.activePatients || 0,
          averageWaitTimeMinutes: emergencyQueue.averageWaitTimeMinutes || 15,
          doctorAvailabilityStatus: emergencyQueue.doctorAvailabilityStatus || "Medium"
        });
      }
      setInboundQueue(queueRes.data || []);
    } catch (err) {
      setMessage({ text: "Error ingesting structural dashboard profiles.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // 2. Resource mutation handler to pass updated inputs back to port 8000
  const handleUpdateResources = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await API.put("/hospitals/resources", resources);
      setMessage({ text: data.message || "Metrics synchronized successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Failed to broadcast changes.", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResources({
      ...resources,
      [name]: name === "doctorAvailabilityStatus" ? value : parseInt(value) || 0
    });
  };

  // 3. Triage workflow dispatcher to cycle status chains (e.g., from Assigned to Admitted)
  const handleStatusChange = async (requestId, nextStatus) => {
    try {
      await API.put(`/emergency/${requestId}/status`, { status: nextStatus });
      // Re-query local pipeline vectors immediately following changes
      const { data } = await API.get("/emergency/hospital-queue");
      setInboundQueue(data || []);
    } catch (err) {
      alert("Status mutation transaction failed.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      
      {/* GLOBAL DESKTOP HEADER */}
      <header className="w-full bg-white border-b border-gray-200/60 px-8 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2.5 font-bold text-gray-900 text-base">
          <div className="w-8 h-8 bg-[#0F62FE] rounded-xl flex items-center justify-center text-white">
            <Activity size={16} />
          </div>
          <span>MediRoute AI Node Control</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
          <span>Facility: <strong className="text-gray-900">{hospitalName}</strong></span>
          <button onClick={handleLogout} className="flex items-center gap-1.5 hover:text-[#EF4444] transition text-xs border border-gray-200 rounded-lg px-2.5 py-1.5">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
          <RefreshCw className="animate-spin text-[#0F62FE]" size={28} />
          <span className="text-xs font-semibold uppercase tracking-wider">Syncing Regional Node Layouts...</span>
        </div>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL COLUMN: DYNAMIC DATA BROADCAST FORM */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ActivitySquare className="text-[#0F62FE]" size={20} />
                <h2 className="font-bold text-gray-900 text-lg">Resource Telemetry</h2>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" title="Connected to routing grid" />
            </div>

            {message.text && (
              <div className={`p-3 text-xs font-medium rounded-xl mb-4 flex items-center gap-2 border ${message.type === "success" ? "bg-[#10B981]/5 border-[#10B981]/20 text-[#10B981]" : "bg-[#EF4444]/5 border-[#EF4444]/20 text-[#EF4444]"}`}>
                <CheckCircle size={14} /> {message.text}
              </div>
            )}

            <form onSubmit={handleUpdateResources} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Available Beds</label>
                  <input type="number" name="availableBeds" value={resources.availableBeds} onChange={handleInputChange} min="0" className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Total Bed Capacity</label>
                  <input type="number" name="totalBeds" value={resources.totalBeds} onChange={handleInputChange} min="0" className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Available ICU Beds</label>
                  <input type="number" name="availableICUBeds" value={resources.availableICUBeds} onChange={handleInputChange} min="0" className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 font-bold text-[#0F62FE]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Total ICU Capacity</label>
                  <input type="number" name="totalICUBeds" value={resources.totalICUBeds} onChange={handleInputChange} min="0" className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800" />
                </div>
              </div>

              <div className="h-px bg-gray-100 my-2" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Active Queue Count</label>
                  <input type="number" name="activePatients" value={resources.activePatients} onChange={handleInputChange} min="0" className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Est. Waiting Mins</label>
                  <input type="number" name="averageWaitTimeMinutes" value={resources.averageWaitTimeMinutes} onChange={handleInputChange} min="0" className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Doctor Availability Index</label>
                <select name="doctorAvailabilityStatus" value={resources.doctorAvailabilityStatus} onChange={handleInputChange} className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm cursor-pointer focus:outline-none focus:border-[#0F62FE]">
                  <option value="High">High Availability</option>
                  <option value="Medium">Medium Density</option>
                  <option value="Low">Low Supply</option>
                  <option value="Critical">Critical Surge Emergency</option>
                </select>
              </div>

              <button type="submit" disabled={updating} className="w-full bg-[#0F62FE] hover:bg-[#0F62FE]/90 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4">
                {updating ? "Syncing Framework Arrays..." : "Broadcast Resource Update"}
                {!updating && <Save size={16} />}
              </button>
            </form>
          </div>

          {/* RIGHT PANEL COLUMN: TRIA-ACTIVE INBOUND EMERGENCY PIPELINES */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider pl-1">Inbound Triage Pipeline Logs</h3>
            
            {inboundQueue.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center text-gray-400 border-dashed flex flex-col items-center justify-center">
                <CheckCircle size={36} className="mb-2.5 text-gray-300" />
                <h4 className="font-bold text-gray-700 text-sm mb-0.5">Grid Clear</h4>
                <p className="text-xs max-w-xs leading-relaxed">No inbound active vectors currently targeted to this facility code.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inboundQueue.map((incident, index) => (
                  <motion.div key={incident._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${incident.severity === "Critical" ? "bg-[#EF4444]/10 text-[#EF4444]" : incident.severity === "High" ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"}`}>
                          {incident.severity}
                        </span>
                        <h4 className="font-bold text-gray-900 text-base">{incident.emergencyType}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-xs text-gray-500">
                        <div>Patient: <strong className="text-gray-700">{incident.patient?.name || "Anonymous"}</strong></div>
                        <div>Arrival: <strong className="text-gray-700">{incident.arrivalMode}</strong></div>
                        <div>Dept: <strong className="text-gray-700">{incident.requiredDepartment}</strong></div>
                        <div>Status: <span className="text-[#0F62FE] font-semibold">{incident.status}</span></div>
                      </div>
                      
                      {/* Critical Device Infrastructure Requirements Flagging */}
                      {(incident.needsICU || incident.needsVentilator) && (
                        <div className="flex gap-2 pt-1">
                          {incident.needsICU && <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"><Layers size={10}/> ICU Mandatory</span>}
                          {incident.needsVentilator && <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"><ShieldAlert size={10}/> Vent Required</span>}
                        </div>
                      )}
                    </div>

                    {/* Operational Action Gateways */}
                    <div className="flex sm:flex-col items-stretch justify-end gap-2 shrink-0">
                      {incident.status === "Assigned" && (
                        <button onClick={() => handleStatusChange(incident._id, "En-Route")} className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 transition">
                          Acknowledge Ingress
                        </button>
                      )}
                      {incident.status === "En-Route" && (
                        <button onClick={() => handleStatusChange(incident._id, "Admitted")} className="bg-[#0F62FE] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#0F62FE]/90 transition">
                          Log Admission
                        </button>
                      )}
                      {incident.status === "Admitted" && (
                        <button onClick={() => handleStatusChange(incident._id, "Resolved")} className="border border-gray-200 text-gray-600 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition">
                          Mark Case Resolved
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </main>
      )}
    </div>
  );
};

export default HospitalDashboard;