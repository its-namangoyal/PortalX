import mongoose from "mongoose";
import Users from "../models/userModel.js";
import crypto from "crypto"; // To handle token generation
import nodemailer from "nodemailer"; // Email service

// Update user profile
export const updateUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    contact,
    location,
    profileUrl,
    cvUrl,
    projectTitle,
    about,
  } = req.body;

  try {
    if (!firstName || !lastName || !email || !contact || !projectTitle || !about) {
      return next("Please provide all required fields");
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No User with id: ${id}`);
    }

    const updateUser = {
      firstName,
      lastName,
      email,
      contact,
      location,
      profileUrl,
      cvUrl,
      projectTitle,
      about,
      _id: id,
    };

    const user = await Users.findByIdAndUpdate(id, updateUser, { new: true });

    const token = user.createJWT();

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// Get user information
export const getUser = async (req, res, next) => {
  try {
    const id = req.body.user.userId;

    const user = await Users.findById({ _id: id });

    if (!user) {
      return res.status(200).send({
        message: "User Not Found",
        success: false,
      });
    }

    user.password = undefined;

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  const { userId, token } = req.params;

  try {
    // Find user by ID
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid user." });
    }

    // Check if token matches and hasn't expired
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    if (user.verificationToken !== hashedToken || user.verificationExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Mark user as verified and remove the token
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error verifying email." });
  }
};

// Check if user is verified before allowing login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Check if the user's email is verified
    if (!user.verified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = user.createJWT();

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error logging in." });
  }
};

// Resend verification email (Optional)
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    // Create new token
    const newToken = user.createVerificationToken();
    await user.save();

    // Send email (email sending logic)
    const verificationUrl = `http://localhost:3000/verify/${user._id}/${newToken}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify Your Email',
      text: `Click the link to verify your email: ${verificationUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification email resent. Please check your inbox." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error resending verification email." });
  }
};