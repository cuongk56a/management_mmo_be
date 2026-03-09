import { QueryOptions } from 'mongoose';
import {TransactionModel} from './transaction.model';
import {ITransactionDoc} from './transaction.type';

const createOne = async (body: any): Promise<ITransactionDoc | null> => {
  return TransactionModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<ITransactionDoc | null> => {
  return TransactionModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<ITransactionDoc | null> => {
  return TransactionModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<ITransactionDoc | null> => {
  return TransactionModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<ITransactionDoc[]> => {
  return TransactionModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<ITransactionDoc[]> => {
  return TransactionModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

export const transactionService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
