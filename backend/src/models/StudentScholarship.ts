import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IScholarship } from './Scholarship';

export interface IStudentScholarship extends Document {
  student: IUser['_id'];
  scholarship: IScholarship['_id'];
  aiMatchScore: number;        // 0-100
  trackingStatus: 'saved' | 'preparing' | 'applied' | 'awarded' | 'rejected';
  savedAt: Date;
  appliedDate?: Date;
  applicationWorkflow?: {
    tasks: { name: string; deadline?: Date; completed: boolean }[];
  };
}

const StudentScholarshipSchema = new Schema<IStudentScholarship>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scholarship: { type: Schema.Types.ObjectId, ref: 'Scholarship', required: true },
    aiMatchScore: { type: Number, min: 0, max: 100, default: 0 },
    trackingStatus: {
      type: String,
      enum: ['saved', 'preparing', 'applied', 'awarded', 'rejected'],
      default: 'saved',
    },
    savedAt: { type: Date, default: Date.now },
    appliedDate: Date,
    applicationWorkflow: {
      tasks: [
        {
          name: String,
          deadline: Date,
          completed: { type: Boolean, default: false },
        },
      ],
    },
  },
  { timestamps: true }
);

// Composite unique index: a student can track a scholarship only once
StudentScholarshipSchema.index({ student: 1, scholarship: 1 }, { unique: true });

export default mongoose.model<IStudentScholarship>('StudentScholarship', StudentScholarshipSchema);