import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../../utils/core/ApiError';
import { catchAsync } from '../../../utils/core/catchAsync';
import { pick } from '../../../utils/core/pick';
import { historyService } from './history.service';
import { sendCreated, sendNoContent, sendOk } from '../../../utils/core/response';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await historyService.createOne(req.body);
    if (!data) throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    return sendCreated(res, data, 'Created');
  } catch (error: any) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
  }
});

/**
 * PATCH /:historyId
 * Đánh dấu thông báo đã đọc
 * - Chỉ set isRead + readAt nếu chưa đọc (readAt chưa tồn tại)
 * - Sau khi update, hook afterHistoryUpdate sẽ tự emit socket COUNT_NOTIFI_NO_READ
 */
const markAsRead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { historyId } = req.params;
  try {
    const history = await historyService.getOne({ _id: historyId });
    if (!history) throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');

    // Nếu đã đọc rồi thì trả về luôn, không update lại
    if (history.readAt) {
      return sendOk(res, history, 'OK');
    }

    const updated = await historyService.updateOne(
      { _id: historyId },
      {
        isRead: true,
        readAt: new Date(),
      },
    );

    return sendOk(res, updated, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
  }
});

/**
 * PATCH /read-all
 * Đánh dấu TẤT CẢ thông báo của user là đã đọc
 * Body: { userId }
 */
const markAllAsRead = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?._id || req.body.userId;
    if (!userId) throw new ApiError(httpStatus.BAD_REQUEST, 'userId is required');

    const now = new Date();
    await historyService.updateMany(
      { userId, isRead: false, deletedAt: { $exists: false } },
      { isRead: true, readAt: now },
    );

    return sendOk(res, undefined, 'Đã đánh dấu tất cả thông báo là đã đọc');
  } catch (error: any) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { historyId } = req.params;
  try {
    const data = await historyService.updateOne({ _id: historyId }, req.body);
    if (!data) throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    return sendNoContent(res);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { historyId } = req.params;
  const options = pick(req.query, ['hasNotification', 'hasUser']);
  try {
    const data = await historyService.getOne({ _id: historyId }, options);
    if (!data) throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['userId', 'isRead', 'notifiId']);
  const queryOptions = pick(req.query, ['limit', 'page', 'sortBy']);
  const populateOptions = pick(req.query, ['hasNotification', 'hasUser']);
  try {
    const data = await historyService.getList(filter, { ...queryOptions, ...populateOptions });
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['userId', 'isRead', 'notifiId']);
  const options = pick(req.query, ['hasNotification', 'hasUser']);
  try {
    const data = await historyService.getAll(filter, options);
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
  }
});

/**
 * GET /count?userId=xxx
 * Trả về số thông báo CHƯA ĐỌC của user
 */
const getCountUnread = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?._id || req.query.userId;
  try {
    if (!userId) throw new ApiError(httpStatus.BAD_REQUEST, 'userId is required');
    const count = await historyService.getCountUnread(String(userId));
    return sendOk(res, { count }, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
  }
});

export const historyController = {
  createOne,
  markAsRead,
  markAllAsRead,
  deleteOne,
  getOne,
  getAll,
  getList,
  getCountUnread,
};
