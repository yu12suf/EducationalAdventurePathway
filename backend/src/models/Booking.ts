import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IAvailabilitySlot } from './AvailabilitySlot';
import { IPayment } from './Payment';

export interface IBooking extends Document {
  student: IUser['_id'];
  counselor: IUser['_id'];
  slot: IAvailabilitySlot['_id'];
  payment: IPayment['_id'];
  status: 'upcoming' | 'completed' | 'cancelled' | 'disputed';
  meetingLink?: string;        // generated after payment
  completedAt?: Date;
  studentNotes?: string;
  counselorNotes?: string;
}

const BookingSchema = new Schema<IBooking>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    counselor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    slot: { type: Schema.Types.ObjectId, ref: 'AvailabilitySlot', required: true, unique: true },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment', required: true, unique: true },
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled', 'disputed'], default: 'upcoming' },
    meetingLink: String,
    completedAt: Date,
    studentNotes: String,
    counselorNotes: String,
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);