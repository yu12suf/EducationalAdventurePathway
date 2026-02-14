import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;           // hashed
  role: 'student' | 'counselor' | 'admin';
  firstName: string;
  lastName: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: Date;
  deletedAt?: Date;           // soft delete
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // exclude by default
    role: { type: String, enum: ['student', 'counselor', 'admin'], required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// ❌ REMOVED: Duplicate index on email (already covered by unique: true)
// ✅ Keep index for faster queries by role
UserSchema.index({ role: 1 });

export default mongoose.model<IUser>('User', UserSchema);