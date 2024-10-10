import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";

// Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required!"],
    },
    email: {
      type: String,
      required: [true, "Email is Required!"],
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minlength: [6, "Password length should be greater than 6 characters"],
      select: true,
    },
    accountType: { 
      type: String, 
      default: "seeker" // Default account type as "seeker"
    },
    studentID: {
      type: String,
      required: [true, "Student Id is Required!"],
      unique: [true, "Student ID already exists"], 
    },
    contact: { type: String },
    location: { type: String },
    profileUrl: { type: String },
    cvUrl: { type: String },
    projectTitle: { type: String },
    about: { type: String },
    verified: { 
      type: Boolean, 
      default: false // Default is false until user verifies email
    },
    verificationToken: {
      type: String, // Token to send in the verification email
    },
    verificationExpires: {
      type: Date, // Token expiration date
    },
  },
  { timestamps: true }
);

// Middleware for hashing password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // Only hash if the password is modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

// Generate JWT token for user login
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

// Generate Email Verification Token
userSchema.methods.createVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.verificationExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

  return token;
};

const Users = mongoose.model("Users", userSchema);

export default Users;