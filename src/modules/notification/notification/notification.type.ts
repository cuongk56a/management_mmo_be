import mongoose from 'mongoose';
import {IDoc} from '../../../utils/types/entityTypes';

export interface INotificationDoc extends IDoc {
  title: string;
  message: string;
  isActive: boolean;
}
