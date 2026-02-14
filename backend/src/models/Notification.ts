import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface INotification extends Document {
  user: IUser['_id'];
  category: 'scholarship' | 'deadline' | 'payment' | 'booking' | 'community' | 'system';
  title: string;
  message: string;
  referenceId?: mongoose.Types.ObjectId; // e.g., scholarshipId, bookingId
  metadata?: any; // flexible field for extra data (deadline, daysLeft, etc.)
  isRead: boolean;
  readAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: {
      type: String,
      enum: ['scholarship', 'deadline', 'payment', 'booking', 'community', 'system'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    referenceId: { type: Schema.Types.ObjectId },
    metadata: { type: Schema.Types.Mixed }, // ✅ added to store deadline, daysLeft, scholarshipId
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);