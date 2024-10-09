import Admin from "../models/adminModel.js";
import { createJWT } from "../utils/index.js"; // Assume you have a utility function for creating JWTs

export const register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    semester,
    year,
  } = req.body;

  try {
    // Validate fields
    if (!firstName || !lastName || !email || !password || !semester || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the email already exists
    const adminExist = await Admin.findOne({ email });
    if (adminExist) {
      return res.status(400).json({ message: "Email Address already exists" });
    }

    // Create new admin
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password, // Assuming the model handles password hashing
      semester,
      year,
    });

    await newAdmin.save();

    // Generate JWT
    const token = createJWT(newAdmin._id);

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      user: {
        _id: newAdmin._id,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        email: newAdmin.email,
        accountType: "admin",
        semester: newAdmin.semester,
        year: newAdmin.year,
      },
      token,
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createJWT(admin._id);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      user: {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        accountType: "admin",
        semester: admin.semester,
        year: admin.year,
      },
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};