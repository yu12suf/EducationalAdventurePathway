import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface ICounselorProfile extends Document {
  user: IUser['_id'];
  bio: string;
  areasOfExpertise: string[];          // e.g., ['STEM', 'Medical', 'Visa Guidance']
  university: string;                  // alma mater (or current affiliation)
  degree: string;                       // e.g., 'PhD in Computer Science'
  yearsOfExperience: number;
  languages: string[];                  // e.g., ['English', 'Amharic']
  consultationModes: ('chat' | 'audio' | 'video')[];
  hourlyRate?: number;                  // in ETB or USD – will be used for payment
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verifiedBy?: IUser['_id'];             // admin who verified
  verificationDate?: Date;
  isVisible: boolean;                    // visible to students
}

const CounselorProfileSchema = new Schema<ICounselorProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, default: '' },                           // ✅ made optional with default
    areasOfExpertise: { type: [String], default: [] },            // ✅ default empty array
    university: { type: String, default: '' },                    // ✅ optional
    degree: { type: String, default: '' },                        // ✅ optional
    yearsOfExperience: { type: Number, default: 0, min: 0 },      // ✅ optional with default
    languages: { type: [String], default: [] },                   // ✅ optional
    consultationModes: {
      type: [String],
      enum: ['chat', 'audio', 'video'],
      default: [],                                                 // ✅ optional
    },
    hourlyRate: { type: Number, min: 0 },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verificationDate: Date,
    isVisible: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ----- Indexes -----
// ❌ Removed duplicate index on user (already from unique: true)
CounselorProfileSchema.index({ verificationStatus: 1 });
CounselorProfileSchema.index({ areasOfExpertise: 1 });

export default mongoose.model<ICounselorProfile>('CounselorProfile', CounselorProfileSchema);