import mongoose from 'mongoose';
import {IHistoryDoc} from './history.type';
import { IDocModel } from '../../../utils/types/entityTypes';
import {TABLE_HISTORY} from './history.configs';
import {paginate, toJSON} from '../../../utils/plugins'
import { TABLE_USER } from '../../user/user.configs';
import { TABLE_NOTIFITCATION } from '../notification/notification.configs';
import { createNewQueue } from '../../../redis/queue';

export interface IHistoryModelDoc extends IHistoryDoc {}
interface IHistoryModel extends IDocModel<IHistoryModelDoc> {}

const historySchema = new mongoose.Schema<IHistoryModelDoc>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    notifiId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    isRead: {
      type:Boolean,
      default: false
    },
    readAt: {
      type: Date, required: false,
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
      required: false,
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

historySchema.plugin(toJSON);
historySchema.plugin(paginate);

historySchema.virtual('notification', {
  ref: TABLE_NOTIFITCATION,
  localField: 'notifiId',
  foreignField: '_id',
  justOne: true,
});

historySchema.virtual('user', {
  ref: TABLE_USER,
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

const populateArr = ({hasNotification, hasUser}: {hasNotification: boolean, hasUser: boolean}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasNotification
        ? {
            path: 'notification',
          }
        : [],
    )
    .concat(
      !!hasUser
        ? {
            path: 'user',
          }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

historySchema.pre('findOne', preFind);
historySchema.pre('find', preFind);

function afterSave(doc: IHistoryModelDoc, next:any) {
  if(!!doc){
    doc
      .populate([
        {
          path: 'notification',
        },
      ])
      .then(() => {
        const newNofiQue = createNewQueue('NotificationQueue');
        newNofiQue
          .add({
            notifi: doc,
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
  }
  next();
}

async function afterUpdate(doc: IHistoryModelDoc, next:any) {
  if(!!doc && doc.isRead == false){
    const count = await HistoryModel.find({userId: doc.userId, deletedAt: {$exists: false}, readAt: {$exists: false}}).countDocuments();
    const socketQueue = createNewQueue('SocketQueue');
    socketQueue.add({
      socketRoom: "notifi_" + doc.userId,
      data: { count },
      eventType: 'COUNT_NOTIFI_NO_READ',
    });
    next();
  }
  next();
}

historySchema.post('save', afterSave);
historySchema.post('findOneAndUpdate', afterUpdate);

/**
 * @typedef History
 */
export const HistoryModel = mongoose.model<IHistoryModelDoc, IHistoryModel>(TABLE_HISTORY, historySchema);
