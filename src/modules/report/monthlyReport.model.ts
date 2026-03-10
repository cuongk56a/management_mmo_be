import mongoose, { Document, Schema } from 'mongoose';

export interface IMonthlyReport extends Document {
  month: string;
  totalRevenue: number;
  totalExpense: number;
  totalCommission: number;
  profit: number;
}

const monthlyReportSchema = new Schema<IMonthlyReport>({
  month: { type: String, required: true, unique: true }, // Format: "YYYY-MM"
  totalRevenue: { type: Number, default: 0 },
  totalExpense: { type: Number, default: 0 },
  totalCommission: { type: Number, default: 0 },
  profit: { type: Number, default: 0 }
}, { timestamps: true });

export const MonthlyReportModel = mongoose.model<IMonthlyReport>('MonthlyReport', monthlyReportSchema);
