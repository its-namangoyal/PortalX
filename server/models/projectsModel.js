import mongoose, { Schema } from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectID: { 
      type: String, 
      required: true, 
      unique: true, // Project ID (e.g., FA2401), serves as the primary key
    },
    company: { 
      type: Schema.Types.ObjectId, 
      ref: "Companies" 
    },
    projectTitle: { 
      type: String, 
      required: [true, "project Title is required"] 
    },
    projectType: { 
      type: String 
    },
    location: { 
      type: String 
    },
    salary: { 
      type: Number, 
      required: [true, "Salary is required"] 
    },
    vacancies: { 
      type: Number 
    },
    experience: { 
      type: Number, 
      default: 0 
    },
    detail: [{ 
      desc: { 
        type: String 
      }, 
      requirements: { 
        type: String 
      } 
    }],
    application: [{ 
      type: Schema.Types.ObjectId, 
      ref: "Users" 
    }],
    semester: { 
      type: String, 
      required: true, 
      enum: ["FA", "SU", "WI"] // Fall, Summer, Winter 
    },
    year: { 
      type: Number, 
      required: true 
    },
    projectIndex: { 
      type: Number, 
      required: true // Incremental index for each semester/year 
    },
  },
  { timestamps: true }
);

const projects = mongoose.model("projects", projectSchema);

export default projects;