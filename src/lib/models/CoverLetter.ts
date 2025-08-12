import mongoose from 'mongoose';

const CoverLetterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  jobDescription: String,
  content: {
    type: String,
    required: true,
  },
  template: {
    type: String,
    default: 'modern',
  },
  customizations: {
    tone: String,
    length: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const CoverLetter = mongoose.models.CoverLetter || mongoose.model('CoverLetter', CoverLetterSchema);
