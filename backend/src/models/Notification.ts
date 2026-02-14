import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface INotification extends Document {
  user: IUser['_id'];
  category: 'scholarship' | 'deadline' | 'payment' | 'booking' | 'community' | 'system';
  title: string;
  message: string;
  referenceId?: mongoose.Types.ObjectId; // e.g., scholarshipId, bookingId
  isRead: boolean;
  readAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, enum: ['scholarship', 'deadline', 'payment', 'booking', 'community', 'system'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    referenceId: Schema.Types.ObjectId,
    isRead: { type: Boolean, default: false },
    readAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);