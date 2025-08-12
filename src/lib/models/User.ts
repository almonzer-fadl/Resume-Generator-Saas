import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: false, // Optional since OAuth users won't have passwords
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'pro', 'business'],
    default: 'free',
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'cancelled'],
    default: 'active',
  },
  usage: {
    resumes: { type: Number, default: 0 },
    coverLetters: { type: Number, default: 0 },
    aiGenerations: { type: Number, default: 0 },
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

// Hash password before saving (only if password is modified)
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Update timestamp on save
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false; // OAuth users won't have passwords
  return bcrypt.compare(candidatePassword, this.password);
};

// Add method to check if user has password (for email/password auth)
UserSchema.methods.hasPassword = function(): boolean {
  return !!this.password;
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
