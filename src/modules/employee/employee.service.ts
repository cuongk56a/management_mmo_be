import { EmployeeModel } from './employee.model';
import ApiError from '../../utils/core/ApiError';
import httpStatus from 'http-status';

export class EmployeeService {
  static async createEmployee(employeeBody: any) {
    if (await EmployeeModel.findOne({ email: employeeBody.email })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email đã được sử dụng');
    }
    const employee = await EmployeeModel.create(employeeBody);
    return employee;
  }

  static async getEmployees(query: any) {
    return EmployeeModel.find(query);
  }

  static async getEmployeeById(id: string) {
    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nhân viên');
    }
    return employee;
  }

  static async updateEmployeeById(id: string, updateBody: any) {
    const employee = await this.getEmployeeById(id);
    if (updateBody.email && (await EmployeeModel.findOne({ email: updateBody.email, _id: { $ne: id } }))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email đã được sử dụng');
    }
    Object.assign(employee, updateBody);
    await employee.save();
    return employee;
  }

  static async deleteEmployeeById(id: string) {
    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nhân viên');
    }
    await employee.deleteOne();
    return employee;
  }
}
