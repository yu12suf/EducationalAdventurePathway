import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IScholarship extends Document {
  title: string;
  provider: string;                // organization name
  description: string;
  eligibilityCriteria: {
    nationality?: string[];
    gpa?: { min: number; max?: number };
    fieldOfStudy?: string[];
    degreeLevel: ('undergraduate' | 'master' | 'phd' | 'postdoc')[];
    age?: { min?: number; max?: number };
    englishTest?: {
      ielts?: number;
      toefl?: number;
    };
    other?: string;
  };
  deadline: Date;
  fundingType: 'full' | 'partial' | 'other';
  awardValue?: string;           // e.g., "$20,000 per year"
  applicationFee?: number;
  requiredDocuments: string[];   // e.g., ["Transcript", "SOP", "LOR"]
  officialUrl: string;          // link to original announcement
  country: string;             // host country
  university?: string;        // if specific university
  createdBy: IUser['_id'];    // admin who added
  trustScore: number;         // 0-100, calculated automatically
  isVerified: boolean;        // manually verified by admin
  tags: string[];            // e.g., ["Merit-based", "Women in STEM"]
  views: number;             // tracking
  applications: number;      // number of users who applied via system (approx)
}

const ScholarshipSchema = new Schema<IScholarship>(
  {
    title: { type: String, required: true, trim: true },
    provider: { type: String, required: true },
    description: { type: String, required: true },
    eligibilityCriteria: {
      nationality: [String],
      gpa: {
        min: { type: Number, min: 0, max: 4.0 },
        max: { type: Number, min: 0, max: 4.0 },
      },
      fieldOfStudy: [String],
      degreeLevel: [{ type: String, enum: ['undergraduate', 'master', 'phd', 'postdoc'], required: true }],
      age: {
        min: Number,
        max: Number,
      },
      englishTest: {
        ielts: Number,
        toefl: Number,
      },
      other: String,
    },
    deadline: { type: Date, required: true, index: true },
    fundingType: { type: String, enum: ['full', 'partial', 'other'], required: true },
    awardValue: String,
    applicationFee: Number,
    requiredDocuments: [String],
    officialUrl: { type: String, required: true },
    country: { type: String, required: true, index: true },
    university: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trustScore: { type: Number, default: 0, min: 0, max: 100 },
    isVerified: { type: Boolean, default: false },
    tags: [String],
    views: { type: Number, default: 0 },
    applications: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ScholarshipSchema.index({ title: 'text', description: 'text', provider: 'text' });
ScholarshipSchema.index({ deadline: 1 });
ScholarshipSchema.index({ 'eligibilityCriteria.degreeLevel': 1 });
ScholarshipSchema.index({ country: 1 });

export default mongoose.model<IScholarship>('Scholarship', ScholarshipSchema);