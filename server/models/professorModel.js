import mongoose from "mongoose";

const professorSchema = new mongoose.Schema(
  {
    professorID: {
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

const Professor = mongoose.model("professors", professorSchema);

export default Professor;
