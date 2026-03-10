import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  type: 'external' | 'internal';
  costPrice: number;
  sellPrice: number;
  description?: string;
  supplier?: string;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, index: true },
  type: { type: String, enum: ['external', 'internal'], required: true, index: true },
  costPrice: { type: Number, required: true },
  sellPrice: { type: Number, required: true },
  description: { type: String },
  supplier: { type: String }
}, { timestamps: true });

export const ProductModel = mongoose.model<IProduct>('Product', productSchema);
