import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import PatientDashboard from "./pages/PatientDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const UnauthorizedView = () => (
  <div className="p-8 text-red-500 font-sans font-semibold text-center mt-12">
    🚫 Error 403: Access Privileges Insufficient
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Access Viewports */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
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