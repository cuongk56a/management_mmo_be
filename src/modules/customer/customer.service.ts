import mongoose from 'mongoose';
import { CustomerModel } from './customer.model';
import ApiError from '../../utils/core/ApiError';
import httpStatus from 'http-status';

export class CustomerService {
  static async createCustomer(customerBody: any) {
    if (await CustomerModel.findOne({ email: customerBody.email })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email đã được sử dụng');
    }
    const customer = await CustomerModel.create(customerBody);
    return customer;
  }

  static async getCustomers(query: any, staffIdFilter?: string) {
    const filter = staffIdFilter ? { staffId: staffIdFilter, ...query } : query;
    return CustomerModel.find(filter).populate('staffId').populate('leadSourceId');
  }

  static async getCustomerById(id: string, staffIdFilter?: string) {
    const customer = await CustomerModel.findById(id).populate('staffId').populate('leadSourceId');
    if (!customer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy khách hàng');
    }
    if (staffIdFilter && customer.staffId.toString() !== staffIdFilter) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền xem thông tin khách hàng này');
    }
    return customer;
  }

  static async updateCustomerById(id: string, updateBody: any, staffIdFilter?: string) {
    const customer = await this.getCustomerById(id, staffIdFilter);
    if (updateBody.email && (await CustomerModel.findOne({ email: updateBody.email, _id: { $ne: id } }))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email đã được sử dụng');
    }
    Object.assign(customer, updateBody);
    await customer.save();
    return customer;
  }

  static async deleteCustomerById(id: string) {
    const customer = await CustomerModel.findById(id);
    if (!customer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy khách hàng');
    }
    await customer.deleteOne();
    return customer;
  }
}
