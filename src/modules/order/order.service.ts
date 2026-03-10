import mongoose from 'mongoose';
import { OrderModel } from './order.model';
import { CustomerModel } from '../customer/customer.model';
import { EmployeeModel } from '../employee/employee.model';
import { ProductModel } from '../product/product.model';
import ApiError from '../../utils/core/ApiError';
import httpStatus from 'http-status';

export class OrderService {
  static async createOrder(orderBody: any) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Kiểm tra tồn tại Data
      const product = await ProductModel.findById(orderBody.productId).session(session);
      if (!product) throw new ApiError(httpStatus.NOT_FOUND, 'Sản phẩm không tồn tại');

      const customer = await CustomerModel.findById(orderBody.customerId).session(session);
      if (!customer) throw new ApiError(httpStatus.NOT_FOUND, 'Khách hàng không tồn tại');

      const staff = await EmployeeModel.findById(customer.staffId).session(session);
      if (!staff) throw new ApiError(httpStatus.NOT_FOUND, 'Nhân viên phụ trách không tồn tại');

      // 2. Logic tính hoa hồng (price * commissionRate)
      const commission = orderBody.price * staff.commissionRate;

      // 3. Tạo Order
      const order = await OrderModel.create([{
        customerId: customer._id,
        productId: product._id,
        staffId: staff._id,
        price: orderBody.price,
        currency: orderBody.currency || 'USD',
        commission,
        status: 'completed'
      }], { session });

      // 4. Update thông số tổng của customer: totalSpent
      customer.totalSpent += orderBody.price;
      await customer.save({ session });

      await session.commitTransaction();
      return order[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getOrders(query: any, staffIdFilter?: string) {
    const filter = staffIdFilter ? { staffId: staffIdFilter, ...query } : query;
    return OrderModel.find(filter).populate('customerId').populate('productId');
  }
}
