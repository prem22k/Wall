import mongoose from 'mongoose';

/**
 * Note Schema - Represents a thought on the wall
 * 
 * Each note is a paper artifact with:
 * - A message (the thought itself)
 * - An author name (optional, defaults to Anonymous)
 * - A timestamp
 */
const noteSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'A note must have a message'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters'],
  },
  name: {
    type: String,
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
    default: 'Anonymous',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for formatted ID (to match frontend expectations)
noteSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtuals are included in JSON output
noteSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
