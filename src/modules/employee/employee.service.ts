import { EmployeeModel } from './employee.model';
import ApiError from '../../utils/core/ApiError';
import httpStatus from 'http-status';
import { IEmployeeDoc } from './employee.type';
import { QueryOptions } from 'mongoose';
import { UserModel } from '../user/user.model';

export class EmployeeService {
  static async createOne(employeeBody: any) {
    if (await EmployeeModel.findOne({ userId: employeeBody.userId })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User đã được sử dụng');
    }
    const employee = await EmployeeModel.create(employeeBody);
    return employee;
  }

  static async getOne(filter: any, options?: QueryOptions) {
    return EmployeeModel.findOne(filter);
  }

  static async getList(filter: any, options?: QueryOptions) {

    const query: any = {
      deletedById: { $exists: false },
    };

    if (filter.role) query.role = filter.role;
    if (filter.isActive !== undefined) query.isActive = filter.isActive;

    if (filter['$text']?.$search) {
      const keyword = filter['$text'].$search;

      const users = await UserModel.find({
        $text: { $search: keyword }
      }).select('_id');

      query.userId = { $in: users.map(u => u._id) };
    }

    return EmployeeModel.paginate(query, {
      sort: { createdAt: -1 },
      ...options
    });
  }

  static async getAll(filter: any, options?: QueryOptions) {
    return EmployeeModel.find({
      deletedById: { $exists: false },
      ...filter,
    },
      undefined,
      { sort: { createdAt: -1 }, ...options });
  }

  static async updateOne(filter: any, updateBody: any) {
    const employee = await EmployeeModel.findOne(filter);
    if (!employee) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nhân viên');
    }
    if (
      updateBody.email &&
      (await EmployeeModel.findOne({ email: updateBody.email, _id: { $ne: employee._id } }))
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email đã được sử dụng');
    }
    Object.assign(employee, updateBody);
    await employee.save();
    return employee;
  }

  static async deleteOne(filter: any) {
    const employee = await EmployeeModel.findOne(filter);
    if (!employee) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nhân viên');
    }
    await employee.deleteOne();
    return employee;
  }
}
