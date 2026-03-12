import { EmployeeModel } from './employee.model';
import ApiError from '../../utils/core/ApiError';
import httpStatus from 'http-status';

export class EmployeeService {
  static async createOne(employeeBody: any) {
    if (await EmployeeModel.findOne({ email: employeeBody.email })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email đã được sử dụng');
    }
    const employee = await EmployeeModel.create(employeeBody);
    return employee;
  }

  static async getOne(filter: any, options?: any) {
    return EmployeeModel.findOne(filter);
  }

  static async getList(filter: any, queryOptions?: any) {
    const { limit = 10, page = 1, sort, options } = queryOptions || {};
    const skip = (Number(page) - 1) * Number(limit);

    const query = EmployeeModel.find(filter)
      .skip(skip)
      .limit(Number(limit));

    if (sort) {
      query.sort(sort);
    }

    const [data, total] = await Promise.all([
      query.exec(),
      EmployeeModel.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  static async getAll(filter: any, options?: any) {
    return EmployeeModel.find(filter);
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
