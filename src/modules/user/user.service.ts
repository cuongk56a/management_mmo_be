import { QueryOptions } from 'mongoose';
import { UserModel } from './user.model';
import { IUserDoc } from './user.type';

const createOne = async (body: any): Promise<IUserDoc | null> => {
  const user = await UserModel.create(body);
  return user;
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IUserDoc | null> => {
  return UserModel.findOneAndUpdate(
    {
      deletedById: { $exists: false },
      ...filter,
    },
    body,
    { new: true, ...options },
  ) as any;
};

const deleteOne = async (filter: any): Promise<IUserDoc | null> => {
  return UserModel.findOneAndDelete(filter);
};

const softDelete = async (filter: any): Promise<IUserDoc | null> => {
  return UserModel.findOneAndUpdate(filter, { deletedById: filter._id }, { new: true }) as any;
};

const getOne = async (filter: any, options?: any): Promise<IUserDoc | null> => {
  return UserModel.findOne(filter, undefined, options) as any;
};

const getList = async (filter: any, options?: any): Promise<IUserDoc[]> => {
  return UserModel.paginate(
    {
      ...filter,
      deletedById: { $exists: false },
    },
    { sort: { createdAt: -1 }, ...options },
  ) as any;
};

const getAll = async (filter: any, options?: any): Promise<IUserDoc[]> => {
  return UserModel.find(
    {
      deletedById: { $exists: false },
      ...filter,
    },
    undefined,
    { sort: { createdAt: -1 }, ...options },
  ) as any;
};

export const userService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  softDelete,
};
