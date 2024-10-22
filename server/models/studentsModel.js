import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentID: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    semester: { type: String, required: true },
  
  },
  { timestamps: true }
);

const Student = mongoose.model("students", studentSchema);

export default Student;
