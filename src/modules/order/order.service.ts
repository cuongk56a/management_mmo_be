import mongoose, {QueryOptions} from 'mongoose';
import {OrderModel} from './order.model';
import {IOrderDoc, IOrderSummary, ORDER_STATUS} from './order.type';
import {orderDetailFS} from '../flashShipping/flashShipping.util';
import {appConfigs} from '../../config/config';
import moment from 'moment-timezone';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createOne = async (body: any): Promise<IOrderDoc | null> => {
  return OrderModel.create(body);
};

const updateOne = async (filter: any, body: any, options?: QueryOptions): Promise<IOrderDoc | null> => {
  return OrderModel.findOneAndUpdate(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    body,
    {new: true, ...options},
  );
};

const deleteOne = async (filter: any): Promise<IOrderDoc | null> => {
  return OrderModel.findOneAndDelete(filter);
};

const getOne = async (filter: any, options?: any): Promise<IOrderDoc | null> => {
  return OrderModel.findOne(filter, undefined, options);
};

const getList = async (filter: any, options?: any): Promise<IOrderDoc[]> => {
  return OrderModel.paginate(
    {
      ...filter,
      deletedById: {$exists: false},
    },
    {sort: {createdAt: -1}, ...options},
  );
};

const getAll = async (filter: any, options?: any): Promise<IOrderDoc[]> => {
  return OrderModel.find(
    {
      deletedById: {$exists: false},
      ...filter,
    },
    undefined,
    {sort: {createdAt: -1}, ...options},
  );
};

const statusFSCronJob = async () => {
  try {
    const orders = await OrderModel.find(
      {
        CODE: {$exists: true},
        status: {$nin: [ORDER_STATUS.REJECT_REQUESTED, ORDER_STATUS.REJECT, ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED]},
        deletedAt: {$exists: false},
      },
      undefined,
      {hasTarget: true},
    );

    for (const order of orders) {
      try {
        if (!!order?.target?.accessTokenFlashShip && order?.target?.enabledFlashShip) {
          const oDetailFS = await orderDetailFS(order.CODE, order?.target?.accessTokenFlashShip);
          if (oDetailFS?.data?.status == 'REJECT_REQUESTED') {
            await OrderModel.updateOne(
              {_id: order._id},
              {status: ORDER_STATUS.REJECT_REQUESTED, trackingIdFLS: oDetailFS?.data?.trackingNumber},
            );
          }
          if (oDetailFS?.data?.status == 'WAIT_TO_SHIP') {
            await OrderModel.updateOne(
              {_id: order._id},
              {status: ORDER_STATUS.SHIPPING, trackingIdFLS: oDetailFS?.data?.trackingNumber},
            );
          }
          if (oDetailFS?.data?.status == 'HOLD') {
            await OrderModel.updateOne(
              {_id: order._id},
              {status: ORDER_STATUS.HOLD, trackingIdFLS: oDetailFS?.data?.trackingNumber},
            );
          }
          if (oDetailFS?.data?.status == 'COMPLETED') {
            await OrderModel.updateOne(
              {_id: order._id},
              {status: ORDER_STATUS.COMPLETED, trackingIdFLS: oDetailFS?.data?.trackingNumber},
            );
          }
        }
      } catch (orderError) {
        console.error(`Error processing order ${order._id}:`, orderError);
      }
      await delay(1000);
    }
  } catch (error) {
    console.error('Error in statusFSCronJob:', error);
  }
};

const getSummary = async (filter: any, options?: any): Promise<IOrderSummary[] | null> => {
  const {startAt, targetId, shopId} = filter;

  const start = moment(`00:00:00 ${startAt}`, appConfigs.validation.formatDateTime, appConfigs.timeZone).unix();
  return OrderModel.aggregate([
    {
      $match: {
        ...(!!targetId ? {targetId: new mongoose.Types.ObjectId(targetId)} : undefined),
        ...(!!shopId ? {shopId: new mongoose.Types.ObjectId(shopId)} : undefined),
        ...(!!startAt
          ? {
              createdTiktokTimestamp: {
                $gte: start,
              },
            }
          : undefined),
        deletedAt: {$exists: false},
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {format: '%d-%m-%Y', date: '$createdAt'},
        },
        ordersCount: {$sum: 1},
      },
    },
    {
      $sort: {_id: 1}, // sort by date
    },
    {
      $project: {_id: 0, date: '$_id', ordersCount: 1},
    },
  ]);
};

export const orderService = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  statusFSCronJob,
  getSummary,
};
