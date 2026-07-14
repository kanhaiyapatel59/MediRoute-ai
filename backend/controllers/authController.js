import User from "../models/userModel.js";
import Hospital from "../models/hospitalModel.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc    Register a new user (Patient, Admin, or Hospital)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  const { name, email, password, role, phoneNumber, hospitalDetails } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // 2. Create foundational User record
    const user = await User.create({
      name,
      email,
      password, // Will be hashed automatically by userModel pre-save hook
      role: role || "patient",
      phoneNumber,
    });

    // 3. Conditional dynamic instantiation if the registering entity is a Hospital
    if (user.role === "hospital") {
      if (!hospitalDetails) {
        return res.status(400).json({ 
          message: "Hospital account creation requires 'hospitalDetails' payload." 
        });
      }

      // Create linked hospital document mapped to user ID
      await Hospital.create({
        user: user._id,
        name: hospitalDetails.name || name,
        licenseNumber: hospitalDetails.licenseNumber,
        location: {
          type: "Point",
          coordinates: [
            hospitalDetails.longitude, // [lng, lat] format for Geospatial indexing
            hospitalDetails.latitude
          ],
          address: hospitalDetails.address,
          city: hospitalDetails.city,
          state: hospitalDetails.state,
          zipCode: hospitalDetails.zipCode,
        },
        capacity: {
          totalBeds: hospitalDetails.totalBeds || 0,
          availableBeds: hospitalDetails.availableBeds || 0,
          totalICUBeds: hospitalDetails.totalICUBeds || 0,
          availableICUBeds: hospitalDetails.availableICUBeds || 0,
        }
      });
    }

    // 4. Respond with context and JWT authentication token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server Error during registration", error: error.message });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email match
    const user = await User.findOne({ email });

    // Leverage instance schema method to check password match
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server Error during authentication", error: error.message });
  }
};

/**
 * @desc    Get user profile data
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User profile context not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error fetching profile", error: error.message });
  }
};