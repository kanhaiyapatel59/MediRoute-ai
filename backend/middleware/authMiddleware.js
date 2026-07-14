import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * Protects routes requiring valid JWT authentication
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from Bearer scheme
      token = req.headers.authorization.split(" ")[1];

      // Verify token signatures
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user data context without exposing hashed passwords
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error("❌ JWT Verification Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

/**
 * Restricts route access to specific permitted roles
 * @param {...string} roles - Permitted roles (e.g., 'admin', 'hospital')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user?.role || "Guest"}) is not authorized to access this resource`,
      });
    }
    next();
  };
};