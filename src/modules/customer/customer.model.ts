import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  staffId: mongoose.Types.ObjectId;
  leadSourceId?: mongoose.Types.ObjectId;
  walletBalance: number;
  totalSpent: number;
}

const customerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  staffId: { type: Schema.Types.ObjectId, ref: 'Employee', index: true },
  leadSourceId: { type: Schema.Types.ObjectId, ref: 'LeadSource' },
  walletBalance: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0, index: true },
}, { timestamps: true });

export const CustomerModel = mongoose.model<ICustomer>('Customer', customerSchema);
