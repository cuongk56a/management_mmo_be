import mongoose from 'mongoose';
import {ITransactionDoc, SOURCE_FOR, TRANSACTION_STATUS, TRANSACTION_TYPE} from './transaction.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_TRANSACTION} from './transaction.configs';
import {paginate, toJSON} from '../../utils/plugins'
import { TABLE_USER } from '../user/user.configs';
// import { TABLE_ORGANIZATION } from '../organization/organization.configs';
// import { TABLE_SHOP } from '../shop/shop.configs';
const TABLE_ORGANIZATION = 'organization';
const TABLE_SHOP = 'shop';
import { createNewQueue } from '../../redis/queue';
import { TABLE_ORDER } from '../order/order.configs';

export interface ITransactionModelDoc extends ITransactionDoc {}
interface ITransactionModel extends IDocModel<ITransactionModelDoc> {}

const transactionSchema = new mongoose.Schema<ITransactionModelDoc>(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetOnModel',
      required: true,
    },
    targetOnModel: {
      type: String,
      enum: [TABLE_ORGANIZATION],
      default: TABLE_ORGANIZATION
    },
    value: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: TRANSACTION_STATUS,
      default: TRANSACTION_STATUS.PENDING
    },
    transType: {
      type: String,
      enum: TRANSACTION_TYPE,
    },
    data: {
      sourceFor: {
        type: String,
        enum: SOURCE_FOR
      },
      shopId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
      }
    },
    transContent: {
      type: String,
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
      required: true,
    },
    updatedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedAt: {type: Date, required: false},
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);

transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

transactionSchema.virtual('target', {
  ref: TABLE_ORGANIZATION,
  localField: 'targetId', 
  foreignField: '_id',
  justOne: true,
  // match: {deletedById: {$exists: false}},
});

transactionSchema.virtual('shop', {
  ref: TABLE_SHOP,
  localField: 'data.shopId', 
  foreignField: '_id',
  justOne: true,
  // match: {deletedById: {$exists: false}},
});

transactionSchema.virtual('order', {
  ref: TABLE_ORDER,
  localField: 'data.orderId', 
  foreignField: '_id',
  justOne: true,
  // match: {deletedById: {$exists: false}},
});

transactionSchema.virtual('createdBy', {
  ref: TABLE_USER,
  localField: 'createdById', 
  foreignField: '_id',
  justOne: true,
  // match: {deletedById: {$exists: false}},
});

transactionSchema.virtual('updatedBy', {
  ref: TABLE_USER,
  localField: 'updatedById', 
  foreignField: '_id',
  justOne: true,
  // match: {deletedById: {$exists: false}},
});

const populateArr = ({hasTarget, hasShop, hasOrder, hasCreatedBy, hasUpdatedBy}: {hasTarget: boolean, hasShop: boolean, hasOrder: boolean, hasCreatedBy: boolean, hasUpdatedBy: boolean}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasTarget
        ? {
            path: 'target',
          }
        : [],
    )
    .concat(
      !!hasShop
        ? {
            path: 'shop',
          }
        : [],
    )
    .concat(
      !!hasOrder
        ? {
            path: 'order',
          }
        : [],
    )
    .concat(
      !!hasCreatedBy
        ? {
            path: 'createdBy',
          }
        : [],
    )
    .concat(
      !!hasUpdatedBy
        ? {
            path: 'updatedBy',
          }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr({...this.getOptions()}));
  next();
}

transactionSchema.pre('findOne', preFind);
transactionSchema.pre('find', preFind);

function afterSave(doc: ITransactionModelDoc, next:any) {
  if(!!doc && doc.status ==  TRANSACTION_STATUS.COMPLETED){
    doc
      .populate([
        {
          path: 'target',
        },
        {
          path: 'shop',
        },
        {
          path: 'order',
        },
        {
          path: 'createdBy',
        },
        {
          path: 'updatedBy',
        },
      ])
      .then(() => {
        const transQueue = createNewQueue('TransactionQueue');
        transQueue
          .add({
            trans: doc,
            isNew: !!doc.$locals.wasNew,
          })
          .catch(err => {
            console.error('Model:Order:afterSave Err ', err);
            next();
          })
          .then(() => {
            next();
          });
      })
      .catch((err: any) => {
        console.error('Error populating document:', err);
        next(err);
      });
  }else {
    next();
  }
  next();
}

transactionSchema.post('save', afterSave);
transactionSchema.post('findOneAndUpdate', afterSave);

/**
 * @typedef Transaction
 */
export const TransactionModel = mongoose.model<ITransactionModelDoc, ITransactionModel>(TABLE_TRANSACTION, transactionSchema);
