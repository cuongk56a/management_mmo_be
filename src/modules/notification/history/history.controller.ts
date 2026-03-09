import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../utils/core/ApiError';
import {catchAsync} from '../../../utils/core/catchAsync';
import {pick} from '../../../utils/core/pick';
import {historyService} from './history.service';
import { IHistoryDoc } from './history.type';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await historyService.createOne(req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {historyId} = req.params;
  const {isRead, readAt, ...body} = req.body;
  try {
    let history = await historyService.getOne({_id: historyId});
    if(!history){
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    if(!history.readAt){
      history = await historyService.updateOne({_id: historyId}, req.body);
    }
    res.send(history)
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {historyId} = req.params;
  try {
    const data = await historyService.updateOne({_id: historyId},req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {historyId} = req.params;
  const options = pick(req.query, ['hasNotification']);
  try {
    const data = await historyService.getOne({_id: historyId}, options);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['userId', 'isRead']);
  const queryOptions = pick(req.query, ['limit', 'page']);
  const options = pick(req.query, ['hasNotification']);
  try {
    const data = await historyService.getList(filter, {...queryOptions, options});
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['userId', 'isRead']);
  const options = pick(req.query, ['hasNotification']);
  try {
    const data = await historyService.getAll(filter, options);
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getCountNoRead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['userId', 'isRead']);
  try {
    const data = await historyService.getCount(filter);
    res.send({count: data});
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});


export const historyController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  getCountNoRead,
};
