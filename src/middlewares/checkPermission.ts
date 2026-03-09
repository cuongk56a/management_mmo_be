import { Request, Response, NextFunction } from 'express';
import { roleService } from "../modules/role/role.service";
import httpStatus from 'http-status';
import { UserModel } from '../modules/user/user.model';

export const AdminPermission = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const [role, user] = await Promise.all([
                roleService.getOne({_id: req.roleId}),
                UserModel.findOne({_id: req.userId})
            ]) 
            req.isAdmin = user?.isAdmin || false
            if ((!!role && role.isAdmin) || user?.isAdmin === true) {
                next();
            } else {
                return res.status(httpStatus.UNAUTHORIZED).send('Not Have Authorized!');
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    };
}

export const SellerPermission = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const [role, user] = await Promise.all([
                roleService.getOne({_id: req.roleId}),
                UserModel.findOne({_id: req.userId})
            ]) 
            req.isAdmin = user?.isAdmin || false
            if ((!!role && (role.isSeller || role.isAdmin)) || user?.isAdmin === true) {
                next();
            } else {
                return res.status(httpStatus.UNAUTHORIZED).send('Not Have Authorized!');
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    };
}

export const DesignPermission = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const [role, user] = await Promise.all([
                roleService.getOne({_id: req.roleId}),
                UserModel.findOne({_id: req.userId})
            ]) 
            req.isAdmin = user?.isAdmin || false
            if ((!!role && (role.isSeller || role.isAdmin || role.isDesign)) || user?.isAdmin === true) {
                next();
            } else {
                return res.status(httpStatus.UNAUTHORIZED).send('Not Have Authorized!');
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    };
}

export const Permission = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await UserModel.findOne({_id: req.userId})
            if (user?.isAdmin === true) {
                req.isAdmin = user?.isAdmin
                next();
            } else {
                return res.status(httpStatus.UNAUTHORIZED).send('Not Have Authorized!');
            }
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    };
}