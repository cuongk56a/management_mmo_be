import * as express from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { appConfigs } from '../config/config';
import { UserModel } from '../modules/user/user.model';
import { EmployeeModel } from '../modules/employee/employee.model';
import { RedisService } from '../redis/RedisService';
import ApiError from '../utils/core/ApiError';

export async function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    if (securityName === 'jwt') {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Xin vui lòng đăng nhập');
        }

        const isBlacklisted = await RedisService.isTokenBlacklisted(token);
        if (isBlacklisted) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Token đã hết hạn hoặc bị từ chối');
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, appConfigs.jwt.secret);
        } catch (e) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Token không hợp lệ');
        }

        const user = await UserModel.findById(decoded.sub);
        if (!user || user.deletedAt) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Tài khoản không tồn tại / đã bị khóa');
        }

        let employeeId = null;
        let role = user.isAdmin ? 'ADMIN' : 'USER';
        const emp = await EmployeeModel.findOne({ userId: user._id });
        if (emp) {
            employeeId = emp._id;
            role = emp.role;
        }

        const userInfo = {
            id: user._id,
            role: role,
            employeeId
        };

        if (scopes && scopes.length > 0) {
            if (!scopes.includes(userInfo.role)) {
                throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không đủ quyền hạn truy cập');
            }
        }

        return userInfo;
    }
}
