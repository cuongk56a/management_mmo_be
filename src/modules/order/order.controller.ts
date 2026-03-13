import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import { OrderService } from './order.service';
import { sendCreated, sendOk } from '../../utils/core/response';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await OrderService.createOrder(req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendCreated(res, data, 'Created');
  } catch (error: any) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['status', 'staffId']);
  try {
    const data = await OrderService.getOrders(filter);
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const orderController = {
  createOne,
  getList,
};
