
import express from "express";
import Projects from "../models/projectsModel.js";
import Application from "../models/applicationsModel.js";

const router = express.Router();

// Get all projects with application counts
router.get("/projects", async (req, res) => {
  try {
    const projects = await Projects.find()
      .populate("company", "name")
      .lean();

    // Get application counts for each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const applicationCount = await Application.countDocuments({
          project: project._id,
        });
        return { ...project, applicationCount };
      })
    );

    res.status(200).json(projectsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific project with its applications
router.get("/projects/:projectId", async (req, res) => {
  try {
    const project = await Projects.findById(req.params.projectId)
      .populate("company", "name location");
    
    const applications = await Application.find({ project: req.params.projectId })
      .populate("student", "firstName lastName email");

    res.status(200).json({ project, applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
