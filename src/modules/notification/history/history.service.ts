import { QueryOptions } from 'mongoose';
import {HistoryModel} from './history.model';
import {IHistoryDoc} from './history.type';

const createOne = async (body: any): Promise<IHistoryDoc | null> => {
  return HistoryModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IHistoryDoc | null> => {
  return HistoryModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  ) as any;
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
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  ) as any;
};

const getAll = async (filter: any, options?: any): Promise<IHistoryDoc[]> => {
  return HistoryModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  ) as any;
};

const getCount = async (filter: any, options?: any): Promise<Number> => {
  return HistoryModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  ).countDocuments();
};

export const historyService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  getCount,
};
