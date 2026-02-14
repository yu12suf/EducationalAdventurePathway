import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IScholarship } from './Scholarship';

export interface ITrackedScholarship extends Document {
  student: IUser['_id'];
  scholarship: IScholarship['_id'];
  userSetDeadline: Date;            // user-defined deadline
  reminderLeadTime: number;        // e.g., 3 (days before)
  applicationStatus: 'not_started' | 'documenting' | 'submitted' | 'awarded' | 'rejected';
  milestones: {
    title: string;
    targetDate: Date;
    completed: boolean;
    completedAt?: Date;
  }[];
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

const TrackedScholarshipSchema = new Schema<ITrackedScholarship>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    scholarship: { type: Schema.Types.ObjectId, ref: 'Scholarship', required: true },
    userSetDeadline: { type: Date, required: true },
    reminderLeadTime: { type: Number, default: 7, min: 0 },
    applicationStatus: {
      type: String,
      enum: ['not_started', 'documenting', 'submitted', 'awarded', 'rejected'],
      default: 'not_started',
    },
    milestones: [MilestoneSchema],
  },
  { timestamps: true }
);

TrackedScholarshipSchema.index({ student: 1, scholarship: 1 }, { unique: true });

export default mongoose.model<ITrackedScholarship>('TrackedScholarship', TrackedScholarshipSchema);