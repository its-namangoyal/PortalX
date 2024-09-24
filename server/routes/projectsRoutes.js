import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import {
  createProject,
  deleteProjectPost,
  getProjectById,
  getProjectPosts,
  updateProject,
} from "../controllers/projectController.js";


// Added
import { applyForProject, getProjectApplications, getUserApplications } from '../controllers/projectController.js'; // Adjust path as per your folder structure


const router = express.Router();

// POST project
router.post("/upload-project", userAuth, createProject);

// UPDATE project
router.put("/update-project/:projectId", userAuth, updateProject);

// GET project POST
router.get("/find-projects", getProjectPosts);
router.get("/get-project-detail/:id", getProjectById);

// DELETE project POST
router.delete("/delete-project/:id", userAuth, deleteProjectPost);


// Added
router.post('/apply/:projectId', userAuth, applyForProject);
router.get('/applications/:userId', getUserApplications);
router.get('/:projectId/applications', userAuth, getProjectApplications);


export default router;
