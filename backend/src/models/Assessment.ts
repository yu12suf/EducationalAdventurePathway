import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IAssessment extends Document {
  student: IUser['_id'];
  assessmentType: 'english_diagnostic' | 'ielts_mock' | 'toefl_mock' | 'gre_mock' | 'speaking_mock';
  completionDate: Date;
  score: {
    overall: number;
    sections: Record<string, number>; // e.g., { reading: 7.5, listening: 8.0 }
  };
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  feedback: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  rawResponses?: any; // could store selected answers, but may be large – consider referencing
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assessmentType: {
      type: String,
      enum: ['english_diagnostic', 'ielts_mock', 'toefl_mock', 'gre_mock', 'speaking_mock'],
      required: true,
    },
    completionDate: { type: Date, default: Date.now },
    score: {
      overall: { type: Number, required: true },
      sections: { type: Schema.Types.Mixed, default: {} },
    },
    cefrLevel: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    feedback: {
      strengths: [String],
      weaknesses: [String],
      recommendations: [String],
    },
    rawResponses: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model<IAssessment>('Assessment', AssessmentSchema);