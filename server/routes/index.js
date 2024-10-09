import express from "express";

import authRoute from "./authRoutes.js";
import userRoute from "./userRoutes.js";
import companyRoute from "./companiesRoutes.js";
import projectRoute from "./projectsRoutes.js";
import adminRoute from "./adminRoutes.js"
const router = express.Router();

const path = "/api-v1/";

router.use(`${path}auth`, authRoute); //api-v1/auth/
router.use(`${path}users`, userRoute);
router.use(`${path}companies`, companyRoute);
router.use(`${path}projects`, projectRoute);
router.use(`${path}admin`, adminRoute);


export default router;
