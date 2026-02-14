import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  examType: 'ielts' | 'toefl' | 'gre';
  section: 'reading' | 'listening' | 'writing' | 'speaking' | 'verbal' | 'quant' | 'awa';
  questionText: string;
  options?: string[];   // for multiple choice
  correctAnswer?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  tags: string[];
}

const QuestionSchema = new Schema<IQuestion>(
  {
    examType: { type: String, enum: ['ielts', 'toefl', 'gre'], required: true },
    section: { type: String, enum: ['reading', 'listening', 'writing', 'speaking', 'verbal', 'quant', 'awa'], required: true },
    questionText: { type: String, required: true },
    options: [String],
    correctAnswer: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    explanation: String,
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model<IQuestion>('Question', QuestionSchema);