import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import { EmployeeService } from './employee.service';
import { getNewToken } from '../../config/passport';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const data = await EmployeeService.createOne(req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        return res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { employeeId } = req.params;
        const data = await EmployeeService.updateOne({ _id: employeeId }, req.body);
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        return res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { employeeId } = req.params;
    try {
        const data = await EmployeeService.deleteOne({ _id: employeeId });
        if (!data) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        }
        res.status(httpStatus.NO_CONTENT).send();
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { employeeId } = req.params;
    // console.log("🚀 ~ getOne ~ employeeId:", getNewToken({employeeId: employeeId}))
    const options = pick(req.query, ['hasAddress', 'hasRole', 'hasOrganization']);
    try {
        // const [data, employee] = await Promise.all([
        //     EmployeeService.getOne({ _id: employeeId }, options),
        //     EmployeeService.getOne({ _id: req.employeeId })
        // ]);
        // if (employeeId != req.employeeId || !employee?.isAdmin) {
        //     throw new ApiError(httpStatus.UNAUTHORIZED, 'Not Have Authorized!');
        // }
        // if (!data) {
        //     throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
        // }
        // res.send(data);
        res.send("ok");
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['search', 'phone', 'email', 'isAdmin']);
    const options = pick(req.query, ['hasAddress', 'hasOrganization', 'hasRole']);
    const queryOptions = pick(req.query, ['sort', 'limit', 'page']);
    try {
        const data = await EmployeeService.getList(filter, { ...queryOptions, options });
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const filter = pick(req.query, ['organizationIds', 'search', 'phone', 'email', 'isAdmin']);
    const options = pick(req.query, ['hasAddress', 'hasOrganization', 'hasRole']);
    try {
        const data = await EmployeeService.getAll(filter, options);
        res.send(data);
    } catch (error: any) {
        return next(new ApiError(httpStatus.NOT_FOUND, error.message));
    }
});

export const employeeController = {
    createOne,
    updateOne,
    deleteOne,
    getOne,
    getAll,
    getList,
};
