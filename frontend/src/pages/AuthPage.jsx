import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, Activity, Mail, Lock, User, Phone } from "lucide-react";
import API from "../api/axiosInstance";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "patient"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const { data } = await API.post(endpoint, payload);

      // Store identity contexts inside local runtime storage
      localStorage.setItem("mediRouteToken", data.token);
      localStorage.setItem("mediRouteRole", data.role);
      localStorage.setItem("mediRouteUserName", data.name);

      // Execute dynamic role-based redirect routes
      if (data.role === "patient") navigate("/patient/dashboard");
      else if (data.role === "hospital") navigate("/hospital/dashboard");
      else if (data.role === "admin") navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication processing failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Ambient Background Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#0F62FE]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#00B4D8]/10 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/75 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(15,98,254,0.06)] z-10"
      >
        {/* Brand Core Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-[#0F62FE] rounded-2xl flex items-center justify-center text-white shadow-[0_4px_20px_rgba(15,98,254,0.3)] mb-3">
            <Activity size={24} className="animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">MediRoute AI</h1>
          <p className="text-sm text-gray-500 mt-1">Smart Emergency Hospital Recommendation System</p>
        </div>

        {/* Form Toggle Switch */}
        <div className="flex bg-gray-100/80 p-1 rounded-xl mb-6 border border-gray-200/50">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isLogin ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => { setIsLogin(true); setError(""); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isLogin ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
            onClick={() => { setIsLogin(false); setError(""); }}
          >
            Create Account
          </button>
        </div>

        {/* Form Pipeline Display */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F62FE] transition"
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F62FE] transition"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Account System Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-3 bg-white/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F62FE] transition appearance-none cursor-pointer"
                  >
                    <option value="patient">Patient / Emergency User</option>
                    <option value="hospital">Hospital Node Provider</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F62FE] transition"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0F62FE] transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-xs font-medium text-[#EF4444] bg-[#EF4444]/5 border border-[#EF4444]/10 rounded-xl p-3 flex items-center gap-2">
              <ShieldCheck size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F62FE] hover:bg-[#0F62FE]/90 text-white font-medium text-sm py-3 px-4 rounded-xl shadow-[0_4px_16px_rgba(15,98,254,0.2)] transition flex items-center justify-center gap-2 disabled:opacity-50 group mt-2"
          >
            {loading ? "Processing Secure Crypt..." : isLogin ? "Access Platform" : "Register Security Token"}
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthPage;