import express from 'express';
import { uploadStudentFile, uploadCompanyFile } from '../controllers/adminController.js';
import { register as adminRegister, signIn as adminSignIn } from "../controllers/adminController.js";
import limiter from "../middleware/limiter.js";
import multer from 'multer';

const router = express.Router();

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route for uploading student files
router.post('/upload/student', upload.single('studentFile'), uploadStudentFile);

// Route for uploading company/professor files
router.post('/upload/company', upload.single('companyFile'), uploadCompanyFile);

router.post("/register", limiter, adminRegister);
router.post("/login", limiter, adminSignIn);

export default router;
