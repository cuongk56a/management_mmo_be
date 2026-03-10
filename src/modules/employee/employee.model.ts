import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
  commissionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'STAFF'], required: true },
  commissionRate: { type: Number, default: 0 },
}, { timestamps: true });

export const EmployeeModel = mongoose.model<IEmployee>('Employee', employeeSchema);
