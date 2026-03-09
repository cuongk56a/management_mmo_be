import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';

export enum TRANSACTION_STATUS {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export enum TRANSACTION_TYPE {
  CREATED_TRANSACTION = 'CREATED_TRANSACTION',
  DEDUCTION_ORDER = 'DEDUCTION_ORDER',
  ADDTION_MONEY = 'ADDTION_MONEY',
  REJECT_ORDER = 'REJECT_ORDER'
}

export enum SOURCE_FOR {
  FLASHSHIP = 'FLASHSHIP',
}

export interface ITransactionDoc extends IDoc {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  value: number;
  status: TRANSACTION_STATUS;
  transType: TRANSACTION_TYPE;
  data: {
    sourceFor?: SOURCE_FOR,
    shopId?: mongoose.Schema.Types.ObjectId,
    orderId?: mongoose.Schema.Types.ObjectId,
  }
  transContent: string;
}
