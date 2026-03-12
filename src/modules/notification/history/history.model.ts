import mongoose from 'mongoose';
import { IHistoryDoc } from './history.type';
import { IDocModel } from '../../../utils/types/entityTypes';
import { TABLE_HISTORY } from './history.configs';
import { paginate, toJSON } from '../../../utils/plugins';
import { TABLE_USER } from '../../user/user.configs';
import { TABLE_NOTIFITCATION } from '../notification/notification.configs';
import { createNewQueue } from '../../../redis/queue';

export interface IHistoryModelDoc extends IHistoryDoc { }
interface IHistoryModel extends IDocModel<IHistoryModelDoc> { }

const historySchema = new mongoose.Schema<IHistoryModelDoc>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
      required: true,
    },
    notifiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_NOTIFITCATION,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      required: false,
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
    deletedAt: { type: Date, required: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

historySchema.plugin(toJSON);
historySchema.plugin(paginate);

historySchema.index({ userId: 1, notifiId: 1 }, { unique: true });
historySchema.index({ userId: 1, isRead: 1 });
historySchema.index({ userId: 1, deletedAt: 1 });

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

const populateArr = ({
  hasNotification,
  hasUser,
}: {
  hasNotification: boolean;
  hasUser: boolean;
}) => {
  let pA: any[] = [];
  return pA
    .concat(!!hasNotification ? { path: 'notification' } : [])
    .concat(!!hasUser ? { path: 'user' } : []);
};

function preFind(this: any, next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

historySchema.pre('findOne', preFind);
historySchema.pre('find', preFind);

/**
 * Sau khi tạo History đơn lẻ (qua historyService.createOne — không phải insertMany bulk):
 * Push job vào NotificationQueue để emit socket đến đúng user
 * NOTE: Khi Notification dùng insertMany ở collection level, hook này KHÔNG bị trigger
 * Hook này chỉ chạy khi tạo History bằng HistoryModel.create() / .save()
 */
function afterHistorySave(doc: IHistoryModelDoc, next: any) {
  if (!doc) return next();

  doc
    .populate([{ path: 'notification' }])
    .then(() => {
      const notifiQueue = createNewQueue('NotificationQueue');
      return notifiQueue.add({
        notificationId: doc.notifiId,
        notification: (doc as any).notification,
        userIds: [String(doc.userId)],
      });
    })
    .then(() => next())
    .catch((err: any) => {
      console.error('History:afterSave error', err);
      next();
    });
}

/**
 * Sau khi user đánh dấu đã đọc (PATCH /:historyId):
 * Emit socket COUNT_NOTIFI_NO_READ để cập nhật badge số thông báo chưa đọc
 *
 * Chú ý: `doc` ở đây là document SAU KHI update (new: true)
 * → nếu isRead = true nghĩa là vừa được đánh dấu đã đọc → emit count mới
 */
async function afterHistoryUpdate(doc: IHistoryModelDoc, next: any) {
  if (!doc) return next();

  // Chỉ emit khi doc đã được đánh dấu là đọc rồi (isRead = true sau update)
  if (!doc.isRead) return next();

  try {
    const count = await HistoryModel.countDocuments({
      userId: doc.userId,
      isRead: false,
      deletedAt: { $exists: false },
    });

    const socketQueue = createNewQueue('SocketQueue');
    socketQueue.add({
      socketRoom: 'notifi_' + doc.userId,
      data: { count },
      eventType: 'COUNT_NOTIFI_NO_READ',
    });
  } catch (err) {
    console.error('History:afterUpdate socket error', err);
  }

  next();
}

historySchema.post('save', afterHistorySave);
historySchema.post('findOneAndUpdate', afterHistoryUpdate);

/**
 * @typedef History
 */
export const HistoryModel = mongoose.model<IHistoryModelDoc, IHistoryModel>(
  TABLE_HISTORY,
  historySchema,
);
