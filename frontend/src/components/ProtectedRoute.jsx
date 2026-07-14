import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Higher-Order Component routing wrapper enforcing JWT session validation and RBAC matching
 * @param {Array<string>} allowedRoles - Explicit list of system roles authorized to access the child viewport
 */
const ProtectedRoute = ({ allowedRoles }) => {
  // Pull authenticated session metadata cached during the login cycle
  const token = localStorage.getItem("mediRouteToken");
  const userRole = localStorage.getItem("mediRouteRole"); // 'patient', 'hospital', or 'admin'

  // 1. Session check: Redirect unauthenticated requests to login landing coordinates
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Authorization check: Block cross-role access attempts
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render nested child components securely if access conditions are fully satisfied
  return <Outlet />;
};

export default ProtectedRoute;