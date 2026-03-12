import { QueryOptions } from 'mongoose';
import { HistoryModel } from './history.model';
import { IHistoryDoc } from './history.type';

const createOne = async (body: any): Promise<IHistoryDoc | null> => {
  return HistoryModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IHistoryDoc | null> => {
  return HistoryModel.findOneAndUpdate(
    {
      deletedAt: { $exists: false },
      ...filter,
    },
    body,
    { new: true, ...options },
  ) as any;
};

/**
 * Cập nhật nhiều History cùng lúc (dùng cho markAllAsRead)
 */
const updateMany = async (filter: any, body: any): Promise<any> => {
  return HistoryModel.updateMany(
    { deletedAt: { $exists: false }, ...filter },
    body,
  );
};

const deleteOne = async (filter: any): Promise<IHistoryDoc | null> => {
  return HistoryModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IHistoryDoc | null> => {
  return HistoryModel.findOne(filter, undefined, options) as any;
};

const getList = async (filter: any, options?: any): Promise<IHistoryDoc[]> => {
  return HistoryModel.paginate(
    {
      deletedAt: { $exists: false },
      ...filter,
    },
    { sort: { createdAt: -1 }, ...options },
  ) as any;
};

const getAll = async (filter: any, options?: any): Promise<IHistoryDoc[]> => {
  return HistoryModel.find(
    {
      deletedAt: { $exists: false },
      ...filter,
    },
    undefined,
    { sort: { createdAt: -1 }, ...options },
  ) as any;
};

/**
 * Đếm số thông báo CHƯA ĐỌC của một user cụ thể
 */
const getCountUnread = async (userId: string): Promise<number> => {
  return HistoryModel.countDocuments({
    userId,
    isRead: false,
    deletedAt: { $exists: false },
  });
};

export const historyService = {
  createOne,
  updateOne,
  updateMany,
  deleteOne,
  getOne,
  getAll,
  getList,
  getCountUnread,
};
