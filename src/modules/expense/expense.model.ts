import mongoose, { Document, Schema } from 'mongoose';

export interface IExpense extends Document {
  name: string;
  amount: number;
  currency: 'USD' | 'VND';
  source: string;
  createdAt: Date;
}

const expenseSchema = new Schema<IExpense>({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['USD', 'VND'], default: 'USD' },
  source: { type: String, required: true }
}, { timestamps: true });

expenseSchema.index({ createdAt: -1 });

export const ExpenseModel = mongoose.model<IExpense>('Expense', expenseSchema);
