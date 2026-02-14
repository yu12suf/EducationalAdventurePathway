import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IAuditLog extends Document {
  admin: IUser['_id'];
  targetUser?: IUser['_id'];
  action: string;            // e.g., 'DELETE_USER', 'APPROVE_COUNSELOR'
  details?: any;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetUser: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    details: Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);