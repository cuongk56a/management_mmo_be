import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import { CustomerService } from './customer.service';
import { sendCreated, sendNoContent, sendOk } from '../../utils/core/response';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await CustomerService.createCustomer(req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendCreated(res, data, 'Created');
  } catch (error: any) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { customerId } = req.params;
  try {
    const data = await CustomerService.updateCustomerById(customerId, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { customerId } = req.params;
  try {
    const data = await CustomerService.deleteCustomerById(customerId);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendNoContent(res);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { customerId } = req.params;
  try {
    const data = await CustomerService.getCustomerById(customerId);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['staffId', 'leadSourceId']);
  try {
    const data = await CustomerService.getCustomers(filter);
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const customerController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getList,
};
