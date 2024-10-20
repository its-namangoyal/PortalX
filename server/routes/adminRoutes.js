// routes/adminRoutes.js
import express from 'express';
import { uploadStudentFile } from '../controllers/adminController.js';
import { register as adminRegister, signIn as adminSignIn } from "../controllers/adminController.js";
import limiter from "../middleware/limiter.js";
import multer from 'multer';

const router = express.Router();

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('studentFile'), uploadStudentFile);

router.post("/register", limiter, adminRegister);
router.post("/login", limiter, adminSignIn);

export default router;
