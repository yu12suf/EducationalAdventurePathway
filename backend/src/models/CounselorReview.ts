import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IBooking } from './Booking';

export interface ICounselorReview extends Document {
  booking: IBooking['_id'];
  student: IUser['_id'];
  counselor: IUser['_id'];
  rating: number;       // 1-5
  comment?: string;
}

const CounselorReviewSchema = new Schema<ICounselorReview>(
  {
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    counselor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

CounselorReviewSchema.index({ counselor: 1 });
CounselorReviewSchema.index({ student: 1 });

export default mongoose.model<ICounselorReview>('CounselorReview', CounselorReviewSchema);