import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage"; 
import PatientDashboard from "./pages/PatientDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const LandingPage = () => <div className="p-8 text-xl font-bold">🚑 MediRoute AI Landing Page Platform Hub</div>;
const PatientDashboard = () => <div className="p-8 text-emerald-600 font-bold">👤 Secure Patient Console Workspace</div>;
const HospitalDashboard = () => <div className="p-8 text-blue-600 font-bold">🏥 Real-Time Hospital Resource Management Panel</div>;
const AdminDashboard = () => <div className="p-8 text-rose-600 font-bold">🛠 Global Platform Administrative Command Core</div>;
const UnauthorizedView = () => <div className="p-8 text-red-500">🚫 Error 403: Access Privileges Insufficient</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Access Viewports */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} /> {/* Bound to the modern UI */}
        <Route path="/unauthorized" element={<UnauthorizedView />} />

        {/* Protected Patient Workspace Core */}
        <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
        </Route>

        {/* Protected Real-Time Hospital Workspace Core */}
        <Route element={<ProtectedRoute allowedRoles={["hospital"]} />}>
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        </Route>

        {/* Protected Global Administrative Command Core */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Fallback Boundary Rule */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;