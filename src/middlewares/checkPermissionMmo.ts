import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/core/ApiError';
import httpStatus from 'http-status';

export const checkPermissionMmo = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user được inject từ middleware authMmo đứng ngay trước nó
    const user = (req as any).user;
    if (!user || !requiredRoles.includes(user.role)) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Bạn không đủ quyền hạn truy cập'));
    }
    next();
  };
};
