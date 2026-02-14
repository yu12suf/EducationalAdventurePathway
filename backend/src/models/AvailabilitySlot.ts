import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IAvailabilitySlot extends Document {
  counselor: IUser['_id'];
  startTime: Date;
  endTime: Date;
  reservedBy?: IUser['_id'];   // student who reserved (null = available)
  status: 'available' | 'booked' | 'cancelled';
}

const AvailabilitySlotSchema = new Schema<IAvailabilitySlot>(
  {
    counselor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    reservedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['available', 'booked', 'cancelled'], default: 'available' },
  },
  { timestamps: true }
);

// Ensure no overlapping slots for the same counselor (application-level, but can add unique compound index if needed)
AvailabilitySlotSchema.index({ counselor: 1, startTime: 1, endTime: 1 }, { unique: true });

export default mongoose.model<IAvailabilitySlot>('AvailabilitySlot', AvailabilitySlotSchema);