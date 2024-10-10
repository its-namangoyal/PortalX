import express from "express";
import { createProject, getPreviousProjects } from "../controllers/projectController.js";

const router = express.Router();

// Route to create a new project
router.post("/projects/create", createProject);

// Route to fetch previous projects
router.get("/projects/previous", getPreviousProjects);

export default router;