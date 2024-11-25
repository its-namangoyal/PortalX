import express from "express";
import { rateLimit } from "express-rate-limit";
import { register, signIn } from "../controllers/authController.js";
import sendEmail from "../utils/sendEmail.js"; // Add this import

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

// Test email route
router.post("/test-email", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.endsWith('@uwindsor.ca')) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid @uwindsor.ca email"
      });
    }

    const testHtml = `
      <div style="background-color: #f6f6f6; padding: 20px;">
        <div style="background-color: white; padding: 20px; border-radius: 10px;">
          <h2>Test Email from UWindsor Internship Portal</h2>
          <p>This is a test email sent at: ${new Date().toLocaleString()}</p>
          <p>If you receive this, the email service is working correctly.</p>
        </div>
      </div>
    `;

    await sendEmail(
      email,
      "Test Email - UWindsor Internship Portal",
      testHtml
    );

    res.json({
      success: true,
      message: "Test email sent successfully"
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message
    });
  }
});

// Existing routes
router.post("/register", limiter, register);
router.post("/login", signIn);

export default router;