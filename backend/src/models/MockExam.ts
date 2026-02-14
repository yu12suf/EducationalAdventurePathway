import mongoose, { Schema, Document } from 'mongoose';

export interface IMockExam extends Document {
  examType: 'ielts' | 'toefl' | 'gre';
  title: string;
  description?: string;
  duration: number;           // in minutes
  totalQuestions: number;
  questions: mongoose.Types.ObjectId[]; // ref 'Question'
  difficulty: 'easy' | 'medium' | 'hard';
  isPublished: boolean;
}

const MockExamSchema = new Schema<IMockExam>(
  {
    examType: { type: String, enum: ['ielts', 'toefl', 'gre'], required: true },
    title: { type: String, required: true },
    description: String,
    duration: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IMockExam>('MockExam', MockExamSchema);