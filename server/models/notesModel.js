import mongoose from 'mongoose';

const { Schema } = mongoose;

const NotesSchema = new Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Companies',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true, // if every note needs to be linked to a semester
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Notes model
export default mongoose.model('Notes', NotesSchema);
