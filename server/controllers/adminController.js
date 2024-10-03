import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";

// Register Admin
export const register = async (req, res, next) => {
  const { name, email, password, semester, accountType } = req.body;

  // Validate required fields
  if (!name || !email || !password || !semester || !accountType) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    // Check if the admin email already exists
    const adminExist = await Admin.findOne({ email });
    if (adminExist) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Create new admin
    const admin = await Admin.create({
      name,
      email,
      password,
      semester,
      accountType,
    });

    // Generate JWT token for admin
    const token = admin.createJWT();

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        semester: admin.semester,
        accountType: admin.accountType,
      },
      token,
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Sign In Admin
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required!" });
  }

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Check if password matches
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // Generate JWT token
    const token = admin.createJWT();

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        semester: admin.semester,
        accountType: admin.accountType,
      },
      token,
    });
  } catch (error) {
    console.error("Error signing in admin:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
