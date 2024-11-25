import mongoose, { Schema } from "mongoose";
import Application from "./applicationsModel.js";

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

// Middleware to delete related applications when a project is deleted
projectSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  try {
    await Application.deleteMany({ project: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

const Projects = mongoose.model("Projects", projectSchema);  // Changed from "projects" to "Projects"

export default Projects;
