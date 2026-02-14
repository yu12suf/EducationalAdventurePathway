import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface ILearningPath extends Document {
  student: IUser['_id'];
  targetSkillLevel: string;           // e.g., 'IELTS 7.5', 'CEFR C1'
  currentProgress: number;           // percentage
  modules: {
    name: string;
    type: 'lesson' | 'quiz' | 'practice' | 'mock';
    resourceIds?: mongoose.Types.ObjectId[]; // references to MockExam, etc.
    completed: boolean;
    completedAt?: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathSchema = new Schema<ILearningPath>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    targetSkillLevel: { type: String, required: true },
    currentProgress: { type: Number, default: 0, min: 0, max: 100 },
    modules: [
      {
        name: { type: String, required: true },
        type: { type: String, enum: ['lesson', 'quiz', 'practice', 'mock'], required: true },
        resourceIds: [Schema.Types.ObjectId],
        completed: { type: Boolean, default: false },
        completedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ILearningPath>('LearningPath', LearningPathSchema);