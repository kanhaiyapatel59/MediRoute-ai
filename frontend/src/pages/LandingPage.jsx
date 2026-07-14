import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Activity, ArrowRight, Shield, Clock, HardDrive, 
  Layers, Compass, Star, ChevronRight, HelpCircle, FileText
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  // Animation constants for modular stagger groups
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  const features = [
    { icon: <Clock className="text-[#0F62FE]" size={22} />, title: "Predict Waiting Time", desc: "Machine learning crowd algorithms predict triage wait durations before ambulance arrival." },
    { icon: <HardDrive className="text-[#00B4D8]" size={22} />, title: "Bed Availability Forecast", desc: "Live structural occupancy sensors track active intensive care matrices automatically." },
    { icon: <Shield className="text-[#10B981]" size={22} />, title: "AI Hospital Recommendation", desc: "Multi-factor utility optimizations evaluate geospatial distance against capacity constraints." },
    { icon: <Layers className="text-[#EF4444]" size={22} />, title: "Severity Analysis", desc: "Explainable AI pipeline categorizes diagnostic severity strings instantly." },
    { icon: <Compass className="text-[#0F62FE]" size={22} />, title: "Distance Optimization", desc: "Real-time routing engines isolate fastest route matrices rather than basic geometric radius loops." },
    { icon: <Star className="text-[#00B4D8]" size={22} />, title: "Hospital Live Telemetry", desc: "Provides high-performance dashboards tracking system utilization, staff counts, and fleet logs." }
  ];

  const steps = [
    { num: "01", label: "Patient Telemetry", desc: "User logs triage factors or symptom parameters." },
    { num: "02", label: "Severity Prediction", desc: "AI computes conditions and extracts infrastructure needs." },
    { num: "03", label: "Predictive Wait Matrix", desc: "Real-time query checks regional resource workloads." },
    { num: "04", label: "Explainable AI Match", desc: "Generates optimal destination matching with explicit data points." }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#0F62FE]/20 selection:text-[#0F62FE] text-gray-800">
      
      {/* 1. STICKY GLASSMORPHIC NAVIGATION BAR */}
      <nav className="sticky top-0 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50 z-50 px-8 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-2.5 font-bold text-gray-900 text-lg">
          <div className="w-9 h-9 bg-[#0F62FE] rounded-xl flex items-center justify-center text-white shadow-[0_4px_12px_rgba(15,98,254,0.25)]">
            <Activity size={18} />
          </div>
          <span>MediRoute AI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-[#0F62FE] transition">Features</a>
          <a href="#workflow" className="hover:text-[#0F62FE] transition">How It Works</a>
          <Link to="/login" className="hover:text-[#0F62FE] transition">Dashboard Console</Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition px-4 py-2"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate("/login")}
            className="bg-[#0F62FE] hover:bg-[#0F62FE]/90 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-[0_4px_12px_rgba(15,98,254,0.15)] transition"
          >
            Launch Core Platform
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION WITH FLOATING KINETIC MATRIX CARD PANELS */}
      <section className="relative px-8 pt-20 pb-24 overflow-hidden max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00B4D8]/5 blur-[100px] rounded-full -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 max-w-2xl text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 bg-[#0F62FE]/5 border border-[#0F62FE]/10 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#0F62FE] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Enterprise Strategic Health Intelligence v2.0
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
            AI-Powered Emergency <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F62FE] to-[#00B4D8]">
              Hospital Recommendation
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
            A secure cloud ecosystem optimized for municipal dispatch matrices, response fleets, and healthcare operators. Computes emergency wait times and hospital bed availability in real time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button 
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto bg-[#0F62FE] hover:bg-[#0F62FE]/90 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-[0_6px_20px_rgba(15,98,254,0.2)] transition flex items-center justify-center gap-2 group"
            >
              Initialize Emergency Search
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
            </button>
            <button 
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-semibold text-sm px-6 py-3.5 rounded-xl transition"
            >
              View System Architecture
            </button>
          </div>
        </motion.div>

        {/* Floating Interactive Live Canvas Cards */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 relative w-full max-w-md lg:max-w-none flex justify-center"
        >
          <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-[0_20px_50px_rgba(15,98,254,0.05)] overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#10B981]/10 text-[#10B981] rounded-xl flex items-center justify-center font-bold text-sm">94%</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">City General Hospital</h4>
                  <p className="text-xs text-gray-400">Primary Network Match Node</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Calculated Proximity</span>
                <span className="font-semibold text-gray-700">3.4 km Away</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Predicted Queue Delay</span>
                <span className="font-semibold text-[#10B981]">~12 Minutes</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Critical ICU Capacity</span>
                <span className="font-semibold text-gray-700">8 Units Open</span>
              </div>
            </div>

            {/* Sub-Floating Element */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute bottom-4 right-4 bg-gray-900 text-white rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2 text-[10px] font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
              Live Routing Updates Active
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 3. ENTERPRISE CAPABILITY MATRIX CARDS */}
      <section id="features" className="bg-white border-y border-gray-200/50 py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4">
              Designed for Mission-Critical Environments
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              MediRoute AI eliminates single-factor search blind spots by processing live regional telemetry profiles simultaneously.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feat, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="bg-[#F8FAFC] border border-gray-200/60 rounded-2xl p-6 hover:shadow-[0_12px_30px_rgba(15,98,254,0.04)] hover:border-[#0F62FE]/30 hover:bg-white transition-all duration-300"
              >
                <div className="w-10 h-10 bg-white border border-gray-200/80 shadow-sm rounded-xl flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{feat.title}</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. INTERACTIVE EXPLAINABLE AI PIPELINE MAP */}
      <section id="workflow" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-4">
            The Recommendation Protocol Engine
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            How the architectural scoring logic maps decisions securely from ingest arrays down to point-of-care destination routing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm z-10 relative h-full">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#0F62FE]/30 to-[#0F62FE]/5 mb-3">
                  {step.num}
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1.5">{step.label}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
              {idx < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gray-300 z-0 transform -translate-y-1/2 group-hover:bg-[#0F62FE] transition" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. METRIC FOOTER CORE */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Activity className="text-[#0F62FE]" size={16} />
            <span>MediRoute AI Platform</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition flex items-center gap-1"><FileText size={12}/> Documentation</a>
            <a href="#" className="hover:text-white transition flex items-center gap-1"><HelpCircle size={12}/> Support Core</a>
          </div>
          <div>
            &copy; 2026 MediRoute AI Ecosystem. Production Ready Systems Architecture.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;