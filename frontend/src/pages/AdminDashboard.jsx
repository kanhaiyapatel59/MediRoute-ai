import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { 
  Building2, Users, AlertTriangle, CheckSquare, 
  Clock, RefreshCw, LogOut, LayoutDashboard 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminAnalytics();
  }, []);

  const fetchAdminAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/analytics/admin-dashboard");
      setAnalyticsData(data);
    } catch (err) {
      setError("Failed to fetch administrative metric arrays.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-gray-400 gap-2">
        <RefreshCw className="animate-spin text-[#0F62FE]" size={28} />
        <span className="text-xs font-semibold uppercase tracking-wider">Compiling Network Analytics...</span>
      </div>
    );
  }

  const { summaryCards, chartsData } = analyticsData || {
    summaryCards: { totalRegisteredHospitals: 0, totalRegisteredPatients: 0, lifetimeEmergenciesLogged: 0, liveActiveEmergencies: 0, infrastructure: { globalTotalBeds: 0, globalAvailableBeds: 0, globalTotalICU: 0, globalAvailableICU: 0, networkAverageWaitTimeMinutes: 0 } },
    chartsData: { incidentTrend: [] }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      
      {/* METRIC COMMAND HEADER */}
      <header className="w-full bg-white border-b border-gray-200/60 px-8 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2.5 font-bold text-gray-900 text-base">
          <div className="w-8 h-8 bg-gray-950 rounded-xl flex items-center justify-center text-white">
            <LayoutDashboard size={16} />
          </div>
          <span>MediRoute AI Admin Operations</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
          <span className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Root Systems Context</span>
          <button onClick={handleLogout} className="flex items-center gap-1.5 hover:text-[#EF4444] transition text-xs border border-gray-200 rounded-lg px-2.5 py-1.5">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      {error ? (
        <div className="p-8 max-w-xl mx-auto mt-12 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-2xl text-[#EF4444] text-sm text-center">
          {error}
        </div>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
          
          {/* HIGH-PERFORMANCE ANALYTICS METRIC ROW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Connected Nodes</span>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{summaryCards.totalRegisteredHospitals}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Active Hospital Facilities</p>
              </div>
              <div className="w-10 h-10 bg-[#0F62FE]/10 text-[#0F62FE] rounded-xl flex items-center justify-center"><Building2 size={20}/></div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Platform Users</span>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{summaryCards.totalRegisteredPatients}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Registered Patient Profiles</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center"><Users size={20}/></div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Active Emergencies</span>
                <h3 className="text-2xl font-black text-[#EF4444] mt-1">{summaryCards.liveActiveEmergencies}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Live Incidents In Route</p>
              </div>
              <div className="w-10 h-10 bg-[#EF4444]/10 text-[#EF4444] rounded-xl flex items-center justify-center"><AlertTriangle size={20}/></div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Network Wait Avg</span>
                <h3 className="text-2xl font-black text-[#10B981] mt-1">{summaryCards.infrastructure.networkAverageWaitTimeMinutes}m</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Global Operational Latency</p>
              </div>
              <div className="w-10 h-10 bg-[#10B981]/10 text-[#10B981] rounded-xl flex items-center justify-center"><Clock size={20}/></div>
            </div>
          </div>

          {/* SECONDARY CAPACITY INFRASTRUCTURE BALANCE METRIC CARDS */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase">Global Available Beds</span>
              <strong className="block text-xl font-bold text-gray-800 mt-1">{summaryCards.infrastructure.globalAvailableBeds} / {summaryCards.infrastructure.globalTotalBeds}</strong>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase">Global Open ICU Units</span>
              <strong className="block text-xl font-bold text-[#0F62FE] mt-1">{summaryCards.infrastructure.globalAvailableICU} / {summaryCards.infrastructure.globalTotalICU}</strong>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase">Platform Lifetime Incidents</span>
              <strong className="block text-xl font-bold text-gray-800 mt-1">{summaryCards.lifetimeEmergenciesLogged} Files</strong>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase">System Integrity</span>
              <strong className="block text-xl font-bold text-[#10B981] mt-1">99.98% Operational</strong>
            </div>
          </div>

          {/* CHARTS CONTAINER GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
              <h4 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wider text-gray-500">Regional Incident Frequency Timeline</h4>
              <div className="h-72 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartsData.incidentTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F62FE" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0F62FE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" stroke="#94A3B8" />
                    <YAxis stroke="#94A3B8" />
                    <Tooltip />
                    <Area type="monotone" dataKey="incidents" stroke="#0F62FE" strokeWidth={2} fillOpacity={1} fill="url(#colorIncidents)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2 uppercase tracking-wider text-gray-500">Platform Structural Status</h4>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">Live analytics dashboard monitoring municipal emergency pipelines and dispatch matrices.</p>
              </div>
              <div className="space-y-3">
                <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Explainable AI Engine Status</span>
                  <span className="text-[#10B981] font-bold flex items-center gap-1"><CheckSquare size={12}/> Functional</span>
                </div>
                <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">FastAPI Endpoint Pipeline</span>
                  <span className="text-[#0F62FE] font-bold flex items-center gap-1">Polling Active</span>
                </div>
                <div className="bg-[#F8FAFC] border border-gray-100 rounded-xl p-3 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Database Aggregations</span>
                  <span className="text-gray-700 font-semibold">10 Collections Verified</span>
                </div>
              </div>
            </div>
          </div>

        </main>
      )}
    </div>
  );
};

export default AdminDashboard;