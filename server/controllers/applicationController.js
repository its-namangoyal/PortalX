import Application from "../models/applicationsModel.js";
import User from "../models/userModel.js"; // Implied import for User model
import Projects from "../models/projectsModel.js"; // Add this import

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
        select: "firstName lastName email cvUrl", // Select only the required fields
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