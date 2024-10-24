import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projects',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index to ensure a student can't apply to the same project multiple times
ApplicationSchema.index({ project: 1, student: 1 }, { unique: true });

const Application = mongoose.model('Application', ApplicationSchema);

export default Application;
