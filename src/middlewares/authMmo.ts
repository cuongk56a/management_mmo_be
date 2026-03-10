import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { appConfigs } from '../config/config';
import { UserModel } from '../modules/user/user.model';
import { EmployeeModel } from '../modules/employee/employee.model';
import { RedisService } from '../redis/RedisService';
import ApiError from '../utils/core/ApiError';

export const authMmo = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, 'Xin vui lòng đăng nhập');

    // 1. Check token trong Redis Blacklist
    const isBlacklisted = await RedisService.isTokenBlacklisted(token);
    if (isBlacklisted) throw new ApiError(httpStatus.UNAUTHORIZED, 'Token đã hết hạn hoặc bị từ chối');

    // 2. Decode Token
    const decoded = jwt.verify(token, appConfigs.jwt.secret) as any;

    // 3. Tìm DB User liên kết vào req 
    const user = await UserModel.findById(decoded.sub);
    if (!user || user.deletedAt) throw new ApiError(httpStatus.UNAUTHORIZED, 'Tài khoản không tồn tại / đã bị khóa');

    // 4. Nếu là nhân viên, load staffInfo của họ vào request cho dễ làm việc
    let employeeId = null;
    let role = user.isAdmin ? 'ADMIN' : 'USER'; // Default mapped from older schema type. Adjust based on how auth provides it
    
    // Check in new Employee table to get accurate ADMIN/STAFF
    const emp = await EmployeeModel.findOne({ userId: user._id });
    if (emp) {
        employeeId = emp._id;
        role = emp.role;
    }

    (req as any).user = { 
        id: user._id, 
        role: role, 
        employeeId 
    };

    next();
  } catch (error) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Token không hợp lệ'));
  }
};
