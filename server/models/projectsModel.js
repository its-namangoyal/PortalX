import mongoose, { Schema } from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    company: { type: Schema.Types.ObjectId, ref: "Companies" },
    projectTitle: { type: String, required: [true, "project Title is required"] },
    projectType: { type: String },
    location: { type: String },
    salary: { type: Number, required: [true, "Salary is required"] },
    vacancies: { type: Number },
    experience: { type: Number, default: 0 },
    semester: { type: String }, // New field added
    detail: [{ desc: { type: String }, requirements: { type: String } }],
  },
  { timestamps: true }
);

const Projects = mongoose.model("Projects", projectSchema);  // Changed from "projects" to "Projects"

export default Projects;
