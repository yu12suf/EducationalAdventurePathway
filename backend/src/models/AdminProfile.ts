import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

export interface IAdminProfile extends Document {
  user: IUser['_id'];
  department: string;
  permissions: ('manage_users' | 'manage_scholarships' | 'manage_counselors' | 'view_analytics' | 'manage_payments')[];
}

const AdminProfileSchema = new Schema<IAdminProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    department: { type: String, default: 'Administration' },
    permissions: [{ type: String, enum: ['manage_users', 'manage_scholarships', 'manage_counselors', 'view_analytics', 'manage_payments'] }],
  },
  { timestamps: true }
);

export default mongoose.model<IAdminProfile>('AdminProfile', AdminProfileSchema);