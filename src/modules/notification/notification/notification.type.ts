import mongoose from 'mongoose';
import { IDoc } from '../../../utils/types/entityTypes';

export type NotificationRefType = 'order' | 'transaction' | 'product' | 'user' | 'other';

/**
 * 'all'      → Thông báo toàn bộ: tạo History cho TẤT CẢ user
 * 'specific' → Thông báo đơn lẻ: chỉ tạo History cho các user trong targetUserIds
 */
export type NotificationScope = 'all' | 'specific';

export interface INotificationDoc extends IDoc {
  title: string;
  message: string;
  isActive: boolean;

  /** Phạm vi gửi: 'all' = toàn bộ user | 'specific' = user cụ thể */
  scope: NotificationScope;

  /**
   * Danh sách userId nhận thông báo — bắt buộc khi scope = 'specific'
   * Bỏ trống khi scope = 'all'
   */
  targetUserIds?: mongoose.Schema.Types.ObjectId[];

  /** Loại entity liên quan: order, transaction, product... */
  refType?: NotificationRefType;

  /** ObjectId của entity liên quan */
  refId?: mongoose.Schema.Types.ObjectId;

  /** URL để frontend navigate khi bấm vào thông báo */
  actionUrl?: string;
}
