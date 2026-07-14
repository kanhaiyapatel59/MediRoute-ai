import jwt from "jsonwebtoken";

/**
 * Generates a signed JWT payload containing the user ID and role
 * @param {string} id - The MongoDB User Object ID 
 * @param {string} role - The explicit RBAC role
 * @returns {string} Signed JWT token valid for 30 days
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;