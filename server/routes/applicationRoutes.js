import express from 'express';
import { getUserApplications, checkApplication, getApplicationById, updateApplicationStatus } from '../controllers/applicationController.js';

const router = express.Router();

// Route to get user applications
router.get('/user/:id', getUserApplications);
router.get('/check/:projectId', checkApplication);
router.get("/:id", getApplicationById);
router.post("/:id/update-status", updateApplicationStatus);

export default router;
