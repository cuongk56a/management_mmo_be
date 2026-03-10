import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
  currency: 'USD' | 'VND';
}

const walletSchema = new Schema<IWallet>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, enum: ['USD', 'VND'], default: 'USD' }
}, { timestamps: true });

export const WalletModel = mongoose.model<IWallet>('Wallet', walletSchema);
