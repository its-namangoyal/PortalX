import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Company Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least"],
      select: true,
    },
    accountType: { 
      type: String, 
      default: "company" // Default account type as "company"
    },
    contact: { type: String },
    location: { type: String },
    about: { type: String },
    profileUrl: { type: String },
    documentUrl: { type: String },
    semester: { type: String, required: true },
    projectPosts: [{ type: Schema.Types.ObjectId, ref: "Projects" }],
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// middelwares
companySchema.pre("save", async function () {
  if (!this.isModified) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//compare password
companySchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

//JSON WEBTOKEN
companySchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

const Companies = mongoose.model("Companies", companySchema);

export default Companies;
