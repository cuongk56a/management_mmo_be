import mongoose from 'mongoose';
import {IDoc} from '../../utils/types/entityTypes';
type IOrganizationDoc = any;

export enum ORDER_STATUS{
  PENDING = 'PENDING',
  // REVIEW = 'REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECT_REQUESTED = 'REJECT_REQUESTED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  REFUND = 'REFUND',
  REJECT = 'REJECT',
  CANCELLED = 'CANCELLED',
  DRAFT = 'DRAFT',
  HOLD = 'HOLD'
}

export enum DESIGN_STATUS{
  DESIGN_PENDING = 'DESIGN_PENDING',
  NEED_DESIGN = 'NEED_DESIGN',
  DESIGN_AGAIN = 'DESIGN_AGAIN',
  DESIGNED = 'DESIGNED',
  DESIGN_COMPLETED = 'DESIGN_COMPLETED',
}


export enum VARIATION_ID{
  PENDING = 'PENDING',
  REVIEW = 'REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECT_REVIEW = 'REJECT_REVIEW',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  REFUND = 'REFUND',
  REJECT = 'REJECT',
  CANCELLED = 'CANCELLED',
  DRAFT = 'DRAFT',
}

export enum SHIPMENT_TYPE{
  'FirstClass' = 1,
  'Priority' = 2,
  'RushProduction' = 3,
}

export type Item = {
  _id: mongoose.Schema.Types.ObjectId;
  productName: string;
  variationName: string;
  productCategories: string;
  designFrontUrl: string;
  designBackUrl: string;
  mockupFrontUrl: string;
  mockupBackUrl: string;
  quantity: number;
  note: string;
  designStatus: DESIGN_STATUS;
}

export interface IOrderDoc extends IDoc {
  targetId: mongoose.Schema.Types.ObjectId;
  targetOnModel: string;
  CODE: string;
  shopId: mongoose.Schema.Types.ObjectId;
  orderTiktokId: string;
  createTimeOrderTT: string;
  buyerUser: string;
  receiveUser: string;
  phone: string;
  addressLine: string;
  country: string;
  state: string;
  city: string;
  zipCode: number;
  paymentMethod: string;
  sellerNote: string;
  productCategories: string;
  products: Item[];
  shippingFee: number;
  amount: number;
  isDesign: boolean;
  status: ORDER_STATUS;
  systemNote: string;
  flashShipFee: number;
  trackingIdFLS: string;
  linkLabel: string;
  createdTiktokTimestamp: number;
  target: IOrganizationDoc;
  typeShipment: string;
}

export type IOrderSummary = {
  date: string;
  ordersCount: number;
}
