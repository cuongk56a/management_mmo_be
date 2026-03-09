import mongoose from 'mongoose';
import {IDoc} from '../../../utils/types/entityTypes';
import { INotificationDoc } from '../notification/notification.type';

export interface IHistoryDoc extends IDoc {
  userId: mongoose.Schema.Types.ObjectId;
  notifiId: mongoose.Schema.Types.ObjectId;
  isRead: boolean;
  readAt: Date;
  notification: INotificationDoc;
}
