// routes/semesterRoutes.js

import express from 'express';
import { getSemesters } from '../controllers/semesterController.js';

const router = express.Router();

// Get all semesters
router.get('/', getSemesters);

export default router;
