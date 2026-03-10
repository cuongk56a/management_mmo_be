import mongoose, { Document, Schema } from 'mongoose';

export interface IWithdraw extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: 'USD' | 'VND';
  status: 'pending' | 'approved' | 'rejected';
}

const withdrawSchema = new Schema<IWithdraw>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['USD', 'VND'], default: 'USD' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true }
}, { timestamps: true });

export const WithdrawModel = mongoose.model<IWithdraw>('Withdraw', withdrawSchema);
