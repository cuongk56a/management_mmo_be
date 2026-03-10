import mongoose, { Document, Schema } from 'mongoose';

export interface ILeadSource extends Document {
  name: string;
  description?: string;
}

const leadSourceSchema = new Schema<ILeadSource>({
  name: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

export const LeadSourceModel = mongoose.model<ILeadSource>('LeadSource', leadSourceSchema);
