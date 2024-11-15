import express from 'express';
import { getUserApplications, checkApplication, getApplicationById, updateApplicationStatus, getAllApplications, updateAdminApproval } from '../controllers/applicationController.js';

const router = express.Router();

// Route to get user applications
router.get('/user/:id', getUserApplications);
router.get('/check/:projectId', checkApplication);
router.get("/:id", getApplicationById);
router.post("/:id/update-status", updateApplicationStatus);
router.get('/', getAllApplications);
router.post("/:applicationId/update-admin-approval", updateAdminApproval);

export default router;
