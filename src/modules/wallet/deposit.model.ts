import mongoose, { Document, Schema } from 'mongoose';

export interface IDeposit extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: 'USD' | 'VND';
  method: 'bank' | 'admin';
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
}

const depositSchema = new Schema<IDeposit>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['USD', 'VND'], default: 'USD' },
  method: { type: String, enum: ['bank', 'admin'], required: true },
  note: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true }
}, { timestamps: true });

export const DepositModel = mongoose.model<IDeposit>('Deposit', depositSchema);
