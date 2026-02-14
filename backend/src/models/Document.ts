import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IDocument extends Document {
  student: IUser['_id'];
  documentType: 'sop' | 'lor' | 'cv' | 'transcript' | 'certificate' | 'other';
  fileName: string;
  fileUrl: string;           // cloud storage URL
  version: number;
  aiFeedback?: {
    grammarScore?: number;
    toneScore?: number;
    coherenceScore?: number;
    suggestions?: string[];
  };
  status: 'draft' | 'under_review' | 'finalized';
  reviewedBy?: IUser['_id']; // counselor
  reviewComments?: string;
  finalizedAt?: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    documentType: {
      type: String,
      enum: ['sop', 'lor', 'cv', 'transcript', 'certificate', 'other'],
      required: true,
    },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    version: { type: Number, default: 1 },
    aiFeedback: {
      grammarScore: Number,
      toneScore: Number,
      coherenceScore: Number,
      suggestions: [String],
    },
    status: { type: String, enum: ['draft', 'under_review', 'finalized'], default: 'draft' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewComments: String,
    finalizedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IDocument>('Document', DocumentSchema);