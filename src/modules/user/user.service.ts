import { QueryOptions } from 'mongoose';
import {UserModel} from './user.model';
import {IUserDoc} from './user.type';

const createOne = async (body: any): Promise<IUserDoc | null> => {
  return UserModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IUserDoc | null> => {
  return UserModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IUserDoc | null> => {
  return UserModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IUserDoc | null> => {
  return UserModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<IUserDoc[]> => {
  return UserModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<IUserDoc[]> => {
  return UserModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

export const userService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
