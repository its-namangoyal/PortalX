// routes/adminRoutes.js
import express from 'express';
import { uploadStudentFile } from '../controllers/adminController.js';
import multer from 'multer';

const router = express.Router();

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('studentFile'), uploadStudentFile);

export default router;
