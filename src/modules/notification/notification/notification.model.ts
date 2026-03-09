import mongoose from 'mongoose';
import {INotificationDoc} from './notification.type';
import { IDocModel } from '../../../utils/types/entityTypes';
import {TABLE_NOTIFITCATION} from './notification.configs';
import {paginate, toJSON} from '../../../utils/plugins'
import { TABLE_USER } from '../../user/user.configs';
import { UserModel } from '../../user/user.model';
import { HistoryModel } from '../history/history.model';
import { TABLE_HISTORY } from '../history/history.configs';

export interface INotificationModelDoc extends INotificationDoc {}
interface INotificationModel extends IDocModel<INotificationModelDoc> {}

const notificationSchema = new mongoose.Schema<INotificationModelDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
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

notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

notificationSchema.index({title: "text"});

notificationSchema.virtual('history', {
  ref: TABLE_HISTORY,
  localField: '_id',
  foreignField: 'notifiId',
  justOne: false,
});

const populateArr = ({hasHistory}: {hasHistory: boolean}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasHistory
        ? {
            path: 'history',
            options: {hasUser: true}
          }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

notificationSchema.pre('findOne', preFind);
notificationSchema.pre('find', preFind);

async function preSave(doc: INotificationModelDoc, next:any) {
  const userIds = await UserModel.find().select("_id")
  await Promise.all(
    userIds.map((userId: any) => {
      HistoryModel.create({
        userId: userId,
        notifiId: doc._id
      })
    })
  )
  next()
}

notificationSchema.post('save', preSave)

async function preDelete(doc: INotificationModelDoc, next:any){
  if(!doc.deletedById){
    await HistoryModel.updateMany({notifiId: doc._id},{deletedById: doc.deletedById, deletedAt: doc.deletedAt})
  }
  next()
}

notificationSchema.post('findOneAndUpdate', preDelete)

/**
 * @typedef Notification
 */
export const NotificationModel = mongoose.model<INotificationModelDoc, INotificationModel>(TABLE_NOTIFITCATION, notificationSchema);
