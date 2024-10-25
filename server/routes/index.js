import express from "express";

import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import companyRoute from "./companiesRoutes.js";
import projectRoute from "./projectsRoutes.js";
import adminRoute from "./adminRoutes.js";
import applicationRoute from "./applicationRoutes.js";;
import studentRoutes from './studentRoutes.js'; // Add student routes
import professorRoutes from "./professorRoutes.js"
import uploadedlistRoutes from "./uploadedlistRoutes.js"

const router = express.Router();

const path = "/api-v1/";

router.use(`${path}auth`, authRoute);           // api-v1/auth/
router.use(`${path}users`, userRoute);          // api-v1/users/
router.use(`${path}companies`, companyRoute);   // api-v1/companies/
router.use(`${path}projects`, projectRoute);    // api-v1/projects/
router.use(`${path}admin`, adminRoute);         // api-v1/admin/
router.use(`${path}students`, studentRoutes);   // api-v1/students/ -> Add this line for student routes
router.use(`${path}professors`, professorRoutes); // Prefixing the routes
router.use(`${path}uploadedlist`, uploadedlistRoutes); router.use(`${path}applications`, applicationRoute);


export default router;
