import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  price: number;
  currency: 'USD' | 'VND';
  commission: number;
  status: 'pending' | 'completed' | 'cancelled';
}

const orderSchema = new Schema<IOrder>({
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  staffId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  price: { type: Number, required: true },
  currency: { type: String, enum: ['USD', 'VND'], default: 'USD' },
  commission: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed', index: true }
}, { timestamps: true });

orderSchema.index({ staffId: 1, createdAt: -1 }); 
orderSchema.index({ customerId: 1, createdAt: -1 }); 

export const OrderModel = mongoose.model<IOrder>('Order', orderSchema);
