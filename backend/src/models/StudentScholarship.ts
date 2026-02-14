import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IScholarship } from './Scholarship';

export interface IStudentScholarship extends Document {
  student: IUser['_id'];
  scholarship: IScholarship['_id'];
  aiMatchScore: number;               // 0-100
  trackingStatus: 'saved' | 'preparing' | 'applied' | 'awarded' | 'rejected';
  savedAt: Date;
  appliedDate?: Date;
  userSetDeadline?: Date;              // FR50: user-defined deadline
  reminderLeadTime?: number;            // FR52: days before deadline to remind
  milestones: {                         // FR51: internal task milestones
    title: string;
    targetDate: Date;
    completed: boolean;
    completedAt?: Date;
  }[];
  applicationWorkflow?: {               // auto-generated checklist (from scholarship required docs)
    tasks: { name: string; deadline?: Date; completed: boolean }[];
  };
}

const MilestoneSchema = new Schema(
  {
    title: { type: String, required: true },
    targetDate: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    completedAt: Date,
  },
  { _id: false }
);

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
    userSetDeadline: Date,               // new field
    reminderLeadTime: { type: Number, default: 7 }, // new field, default 7 days
    milestones: [MilestoneSchema],       // new field
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