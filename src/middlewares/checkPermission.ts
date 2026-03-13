import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { userService } from '../modules/user/user.service';
import { EmployeeService } from '../modules/employee/employee.service';
import { ROLETYPE } from '../modules/employee/employee.type';
import { sendError } from '../utils/core/response';

export const AdminPermission = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const [employee, user] = await Promise.all([
                EmployeeService.getOne({ _id: req.roleId }),
                userService.getOne({ _id: req.userId })
            ])
            req.isAdmin = user?.isAdmin || false
            if ((!!employee && employee.role === ROLETYPE.MANAGER && employee.isActive === true) || user?.isAdmin === true) {
                next();
            } else {
                return sendError(res, httpStatus.FORBIDDEN, 'Not Have Authorized!');
            }
        } catch (error) {
            return sendError(res, httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
    };
}

export const EmployeePermission = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const [employee, user] = await Promise.all([
                EmployeeService.getOne({ _id: req.roleId }),
                userService.getOne({ _id: req.userId })
            ])
            req.isAdmin = user?.isAdmin || false
            if ((!!employee && employee.isActive === true) || user?.isAdmin === true) {
                next();
            } else {
                return sendError(res, httpStatus.FORBIDDEN, 'Not Have Authorized!');
            }
        } catch (error) {
            return sendError(res, httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
    };
}

/**
 * "Seller" hiện tại tương đương "Employee" (STAFF/MANAGER active) hoặc admin.
 * Giữ export này để tương thích với các route đang import `SellerPermission`.
 */
export const SellerPermission = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const [employee, user] = await Promise.all([
                EmployeeService.getOne({ _id: req.roleId }),
                userService.getOne({ _id: req.userId })
            ])
            req.isAdmin = user?.isAdmin || false
            if ((!!employee && employee.isActive === true) || user?.isAdmin === true) {
                next();
            } else {
                return sendError(res, httpStatus.FORBIDDEN, 'Not Have Authorized!');
            }
        } catch (error) {
            return sendError(res, httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
        }
    };
}

export const Permission = {
    AdminPermission,
    EmployeePermission,
    SellerPermission,
}
