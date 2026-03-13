import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import {catchAsync} from '../../utils/core/catchAsync';
import {pick} from '../../utils/core/pick';
import {transactionService} from './transaction.service';
import { sendCreated, sendNoContent, sendOk } from '../../utils/core/response';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await transactionService.createOne(req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendCreated(res, data, 'Created');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {transactionId} = req.params;
  try {
    const data = await transactionService.updateOne({_id: transactionId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {transactionId} = req.params;
  try {
    const data = await transactionService.updateOne({_id: transactionId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendNoContent(res);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {transactionId} = req.params;
  const options = pick(req.query, ['hasTarget','hasShop',  'hasCreatedBy',  'hasUpdatedBy']);
  try {
    const data = await transactionService.getOne({_id: transactionId}, options);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['targetId', 'createById', 'status']);
  const queryOptions = pick(req.query, ['limit', 'page']);
  const options = pick(req.query, ['hasTarget','hasShop',  'hasCreatedBy',  'hasUpdatedBy']);
  try {
    const data = await transactionService.getList(filter, {...queryOptions, options});
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['targetId', 'createById', 'status']);
  const options = pick(req.query, ['hasTarget','hasShop',  'hasCreatedBy',  'hasUpdatedBy']);
  try {
    const data = await transactionService.getAll(filter, options);
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const transactionController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
