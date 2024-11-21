import mongoose from 'mongoose';

const { Schema } = mongoose;

const SemesterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Semester', SemesterSchema);
