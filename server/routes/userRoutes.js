import express from "express";
import path from "path";
import userAuth from "../middlewares/authMiddleware.js";
import {
  getUser,
  updateUser,
  verifyEmail,
  resendVerificationEmail, // New controller for resending verification email
} from "../controllers/userController.js";

const router = express.Router();

const __dirname = path.resolve(path.dirname(""));

// Verify user email
router.get("/verify/:userId/:token", verifyEmail);

// Resend verification email (optional)
router.post("/resend-verification", resendVerificationEmail);

// GET user
router.post("/get-user", userAuth, getUser);

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUser);

export default router;