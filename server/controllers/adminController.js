import XLSX from 'xlsx';
import fs from 'fs';
import Admin from "../models/adminModel.js";
import { createJWT } from "../utils/index.js";
import Student from '../models/studentsModel.js'; // Assuming you have a Student model
import Company from '../models/professorModel.js'; // Assuming you have a Company model
import Semester from '../models/semesterModel.js';

export const uploadStudentFile = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Read the uploaded file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Insert data into MongoDB
    await Student.insertMany(data);

    // Remove the uploaded file after processing
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Student data uploaded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading student data.' });
  }
};

// New function for uploading company/professor files
export const uploadCompanyFile = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Read the uploaded file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Insert data into MongoDB
    await Company.insertMany(data);

    // Remove the uploaded file after processing
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Company/Professor data uploaded successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading company/professor data.' });
  }
};


export const register = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    semester,
  } = req.body;

  try {
    // Validate fields
    if (!firstName || !lastName || !email || !password || !semester) {
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
      accountType: "admin",
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
        accountType: newAdmin.accountType,
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
      },
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller to add a new semester
export const addSemester = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Semester name is required.' });
  }

  try {
    // Check if the semester already exists
    const existingSemester = await Semester.findOne({ name });
    if (existingSemester) {
      return res.status(400).json({ success: false, message: 'Semester already exists.' });
    }

    // Create and save the new semester
    const newSemester = new Semester({ name });
    await newSemester.save();

    return res.status(201).json({ success: true, message: 'Semester added successfully.' });
  } catch (error) {
    console.error('Error adding semester:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};