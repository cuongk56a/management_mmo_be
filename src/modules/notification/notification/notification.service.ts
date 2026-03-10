import { QueryOptions } from 'mongoose';
import {NotificationModel} from './notification.model';
import {INotificationDoc} from './notification.type';

const createOne = async (body: any): Promise<INotificationDoc | null> => {
  return NotificationModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<INotificationDoc | null> => {
  return NotificationModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  ) as any;
};

const deleteOne = async (filter: any): Promise<INotificationDoc | null> => {
  return NotificationModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<INotificationDoc | null> => {
  return NotificationModel.findOne(filter, undefined, options) as any;
};

const getList = async (filter: any, options?: any): Promise<INotificationDoc[]> => {
  return NotificationModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  ) as any;
};

const getAll = async (filter: any, options?: any): Promise<INotificationDoc[]> => {
  return NotificationModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  ) as any;
};

export const notificationService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
