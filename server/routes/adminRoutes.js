import express from 'express';
import { uploadStudentFile, uploadCompanyFile } from '../controllers/adminController.js';
import { register as adminRegister, signIn as adminSignIn, addSemester } from "../controllers/adminController.js";
import limiter from "../middleware/limiter.js";
import multer from 'multer';
import Users from "../models/userModel.js";
import Projects from "../models/projectsModel.js";
import Companies from "../models/companiesModel.js";

const router = express.Router();

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to fetch stats, including number of students per semester
router.get("/stats", async (req, res) => {
    try {
      const totalStudents = await Users.countDocuments({ accountType: "seeker" });
      const totalProjects = await Projects.countDocuments();
      const totalCompanies = await Companies.countDocuments({ accountType: "company" });
  
      // Aggregate students by semester
      const studentsBySemester = await Users.aggregate([
        { $match: { accountType: "seeker" } },
        { $group: { _id: "$semester", count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]);
  
      // Add this new aggregation for projects by semester
      const projectsBySemester = await Projects.aggregate([
        { 
          $group: { 
            _id: "$semester", 
            projectCount: { $sum: 1 } 
          } 
        },
        { 
          $project: {
            _id: 0,
            semester: "$_id",
            projectCount: 1
          }
        },
        { $sort: { semester: 1 } }
      ]);
  
      res.status(200).json({
        success: true,
        data: {
          totalStudents,
          totalProjects,
          totalCompanies,
          studentsBySemester,
          projectsBySemester  // Include the projects by semester data
        },
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ success: false, message: "Error fetching stats", error });
    }
  });

// Route for uploading student files
router.post('/upload/student', upload.single('studentFile'), uploadStudentFile);

// Route for uploading company/professor files
router.post('/upload/company', upload.single('companyFile'), uploadCompanyFile);

// Route for registering a new admin
router.post("/register", limiter, adminRegister);

// Route for admin login
router.post("/login", limiter, adminSignIn);

// Route to add a new semester
router.post('/semesters', addSemester);

export default router;
