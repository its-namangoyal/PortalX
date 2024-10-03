import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

// Schema
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required!"],
    },
    email: {
      type: String,
      required: [true, "Email is Required!"],
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: "Please provide a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minlength: [6, "Password length should be greater than 6 characters"],
      select: true,
    },
    semester: {
      type: String,
      required: [true, "Semester is required!"], // Example: "Fall 2024"
      enum: ["Fall 2024", "Winter 2025", "Summer 2025"], // Optional: Restrict to specific semesters
    },
    accountType: { 
        type: String, 
        default: "seeker" // Default account type as "seeker"
      }// To distinguish admin accounts
  },
  { timestamps: true }
);

// Middleware to hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

// Method to create JWT
adminSchema.methods.createJWT = function () {
  return JWT.sign({ adminId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
