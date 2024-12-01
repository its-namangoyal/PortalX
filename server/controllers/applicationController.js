import Application from "../models/applicationsModel.js";
import User from "../models/userModel.js"; // Implied import for User model
import Projects from "../models/projectsModel.js"; // Add this import
import mongoose from "mongoose";

export const getUserApplications = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Simplified query - removed separate user check since we can handle missing data in one go
    const applications = await Application.find({ student: id })
      .populate({
        path: "project",
        populate: {
          path: "company", // Populate company inside project
          select: "name profileUrl location", // Fetch only necessary fields
        },
      })
      .sort({ createdAt: -1 });

    if (!applications.length) {
      return res
        .status(404)
        .json({ message: "No applications found for this user" });
    }

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Error in getUserApplications:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const checkApplication = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const existingApplication = await Application.findOne({
      project: projectId,
      student: userId,
    });

    return res.status(200).json({
      success: true,
      exists: !!existingApplication,
      status: existingApplication?.status || null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

// Get application details by ID
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate({
        path: "student",
        model: User, // Reference the User model (not Users, change this line)
        select: "firstName lastName email cvUrl profileUrl", // Select only the required fields
      })
      .populate({
        path: "project",
        model: Projects, // Reference the Projects model
        select: "projectTitle desc semester", // Select only the required fields
      });

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    return res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error("Error in getApplicationById:", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    return res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error("Error in updateApplicationStatus:", error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Controller to get all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('project', 'projectTitle') // populate project details
      .populate('student', 'firstName lastName email'); // populate student details

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// Controller to update admin approval
export const updateAdminApproval = async (req, res) => {
  const { applicationId } = req.params;
  const { adminApproval } = req.body; // Expected to be a boolean

  try {
    // Find application by ID
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Update the adminApproval field
    application.adminApproval = adminApproval;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Admin approval updated to ${adminApproval ? "Accepted" : "Rejected"}`,
      data: application,
    });
  } catch (error) {
    console.error("Error in updateAdminApproval:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating admin approval",
      error: error.message,
    });
  }
};

// Get applications by project ID
export const getApplicationsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Convert the projectId from string to ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",  // Return a 400 error if the projectId is invalid
      });
    }

    // Use ObjectId to query the Application model
    const applications = await Application.find({ project: new mongoose.Types.ObjectId(projectId) })
      .populate({
        path: "student",
        select: "firstName lastName email profileUrl cvUrl",  // Fetch only necessary student fields
      })
      .sort({ createdAt: -1 });  // Sort applications by newest first

    if (!applications.length) {
      return res.status(404).json({
        success: false,
        message: "No applications found for this project",
      });
    }

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Error in getApplicationsByProject:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};