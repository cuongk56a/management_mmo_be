import mongoose from 'mongoose';
import { INotificationDoc, NotificationRefType, NotificationScope } from './notification.type';
import { IDocModel } from '../../../utils/types/entityTypes';
import { TABLE_NOTIFITCATION } from './notification.configs';
import { paginate, toJSON } from '../../../utils/plugins';
import { TABLE_USER } from '../../user/user.configs';
import { UserModel } from '../../user/user.model';
import { HistoryModel } from '../history/history.model';
import { TABLE_HISTORY } from '../history/history.configs';
import { createNewQueue } from '../../../redis/queue';

export interface INotificationModelDoc extends INotificationDoc { }
interface INotificationModel extends IDocModel<INotificationModelDoc> { }

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
    scope: {
      type: String,
      enum: ['all', 'specific'] satisfies NotificationScope[],
      default: 'all',
      required: true,
    },
    targetUserIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: TABLE_USER,
      default: undefined,
      required: false,
    },

    refType: {
      type: String,
      enum: ['order', 'transaction', 'product', 'user', 'other'] satisfies NotificationRefType[],
      required: false,
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    actionUrl: {
      type: String,
      required: false,
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
    deletedAt: { type: Date, required: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

notificationSchema.index({ title: 'text' });
notificationSchema.index({ scope: 1 });
notificationSchema.index({ isActive: 1 });

notificationSchema.virtual('history', {
  ref: TABLE_HISTORY,
  localField: '_id',
  foreignField: 'notifiId',
  justOne: false,
});

const populateArr = ({ hasHistory }: { hasHistory: boolean }) => {
  let pA: any[] = [];
  return pA.concat(
    !!hasHistory ? { path: 'history', options: { hasUser: true } } : [],
  );
};

function preFind(this: any, next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

notificationSchema.pre('findOne', preFind);
notificationSchema.pre('find', preFind);

async function afterSave(doc: INotificationModelDoc, next: any) {
  try {
    let userIds: mongoose.Types.ObjectId[] = [];

    if (doc.scope === 'all') {
      const users = await UserModel.find({ deletedAt: { $exists: false } }).select('_id').lean();
      userIds = users.map((u: any) => u._id);
    } else if (doc.scope === 'specific') {
      userIds = (doc.targetUserIds ?? []) as unknown as mongoose.Types.ObjectId[];
    }

    if (userIds.length === 0) return next();

    await HistoryModel.collection.insertMany(
      userIds.map((userId) => ({
        userId,
        notifiId: doc._id,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      { ordered: false },
    );

    const notifiQueue = createNewQueue('NotificationQueue');
    await notifiQueue.add({
      notificationId: doc._id,
      notification: doc.toObject(),
      userIds: userIds.map(String),
    });

    next();
  } catch (err: any) {
    if (err?.code === 11000) return next();
    console.error('Notification:afterSave error', err);
    next(err);
  }
}

notificationSchema.post('save', afterSave);

async function afterSoftDelete(doc: INotificationModelDoc, next: any) {
  if (doc?.deletedById) {
    await HistoryModel.updateMany(
      { notifiId: doc._id, deletedAt: { $exists: false } },
      { deletedById: doc.deletedById, deletedAt: doc.deletedAt },
    ).catch((err) => console.error('Notification:afterSoftDelete error', err));
  }
  next();
}

notificationSchema.post('findOneAndUpdate', afterSoftDelete);

/**
 * @typedef Notification
 */
export const NotificationModel = mongoose.model<INotificationModelDoc, INotificationModel>(
  TABLE_NOTIFITCATION,
  notificationSchema,
);
