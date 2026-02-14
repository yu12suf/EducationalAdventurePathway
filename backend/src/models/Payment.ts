import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IBooking } from './Booking';

export interface IPayment extends Document {
  student: IUser['_id'];
  booking: IBooking['_id'];
  amount: number;
  currency: string;           // 'ETB', 'USD'
  paymentMethod: 'telebirr' | 'cbe_birr' | 'card' | 'other';
  transactionRef: string;     // from gateway
  escrowStatus: 'held' | 'released' | 'refunded' | 'failed';
  adminCommission?: number;   // platform fee
  handledBy?: IUser['_id'];   // admin who intervened
  releasedAt?: Date;
  refundedAt?: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'ETB' },
    paymentMethod: { type: String, enum: ['telebirr', 'cbe_birr', 'card', 'other'], required: true },
    transactionRef: { type: String, required: true, unique: true },
    escrowStatus: { type: String, enum: ['held', 'released', 'refunded', 'failed'], default: 'held' },
    adminCommission: { type: Number, min: 0 },
    handledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    releasedAt: Date,
    refundedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);