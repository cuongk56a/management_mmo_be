import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../utils/core/ApiError';
import {catchAsync} from '../../../utils/core/catchAsync';
import {pick} from '../../../utils/core/pick';
import {notificationService} from './notification.service';
import { sendCreated, sendNoContent, sendOk } from '../../../utils/core/response';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await notificationService.createOne(req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendCreated(res, data, 'Created');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {notificationId} = req.params;
  try {
    const data = await notificationService.updateOne({_id: notificationId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {notificationId} = req.params;
  try {
    const data = await notificationService.updateOne({_id: notificationId},req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendNoContent(res);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {notificationId} = req.params;
  const options = pick(req.query, ['hasHistory']);
  try {
    const data = await notificationService.getOne({_id: notificationId}, options);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['search', 'isActive']);
  const queryOptions = pick(req.query, ['limit', 'page']);
  try {
    const data = await notificationService.getList(filter, {...queryOptions});
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['search', 'isActive']);
  try {
    const data = await notificationService.getAll(filter);
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const notificationController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
