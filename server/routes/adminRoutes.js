import express from "express";
import { rateLimit } from "express-rate-limit";
import { register as adminRegister, signIn as adminSignIn } from "../controllers/adminController.js";

// IP rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

// Admin routes
router.post("/register", limiter, adminRegister);
router.post("/login", limiter, adminSignIn);

export default router;