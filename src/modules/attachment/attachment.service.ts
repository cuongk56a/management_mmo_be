import { QueryOptions } from 'mongoose';
import { AttachmentModel } from './attachment.model';
import { IAttachmentDoc } from './attachment.type';

const createOne = async (body: any): Promise<IAttachmentDoc | null> => {
  return AttachmentModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IAttachmentDoc | null> => {
  return AttachmentModel.findOneAndUpdate(
    {
      deletedById: { $exists: false },
      ...filter,
    },
    body,
    { new: true, ...options },
  ) as any;
};

const deleteOne = async (filter: any): Promise<IAttachmentDoc | null> => {
  return AttachmentModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IAttachmentDoc | null> => {
  return AttachmentModel.findOne(filter, undefined, options) as any;
};

const getList = async (filter: any, options?: any, sortOptions?: any): Promise<IAttachmentDoc[]> => {
  return AttachmentModel.paginate(
    {
      ...filter,
      deletedById: { $exists: false },
    },
    { sort: { ...sortOptions, createdAt: -1 }, ...options },
  ) as any;
};

const getAll = async (filter: any, options?: any, sortOptions?: any): Promise<IAttachmentDoc[]> => {
  return AttachmentModel.find(
    {
      deletedById: { $exists: false },
      ...filter,
    },
    undefined,
    { sort: { ...sortOptions, createdAt: -1 }, ...options },
  ) as any;
};

export const attachmentService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
