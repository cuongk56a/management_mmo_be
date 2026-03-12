import AbstractQueueProcessor, { createNewQueue } from '../../../../redis/queue';
import { HistoryModel } from '../history.model';

/**
 * NotificationQueue
 * ─────────────────
 * Job payload:
 *   - notificationId : string        — _id của Notification
 *   - notification   : object        — toàn bộ object notification (đã populate)
 *   - userIds        : string[]      — danh sách userId nhận thông báo
 *
 * Luồng xử lý:
 *   Với mỗi userId trong userIds:
 *     1. Emit socket event NOTIFICATION  → hiển thị popup/toast thông báo mới
 *     2. Query đếm số thông báo chưa đọc của user đó
 *     3. Emit socket event COUNT_NOTIFI_NO_READ → cập nhật badge số
 */
export class NotificationQueue extends AbstractQueueProcessor {
  processQueue = async (
    job: {
      data: {
        notificationId: string;
        notification: object;
        userIds: string[];
      };
    },
    done: any,
  ) => {
    const { notification, userIds } = job.data;

    if (!userIds || userIds.length === 0) return done();

    const socketQueue = createNewQueue('SocketQueue');

    try {
      await Promise.all(
        userIds.map(async (userId) => {
          // 1. Thông báo mới xuất hiện
          await socketQueue.add({
            socketRoom: 'notifi_' + userId,
            data: notification,
            eventType: 'NEW_NOTIFICATION',
          });

          // 2. Đếm số thông báo CHƯA ĐỌC của user
          const count = await HistoryModel.countDocuments({
            userId,
            isRead: false,
            deletedAt: { $exists: false },
          });

          // 3. Cập nhật badge số chưa đọc
          await socketQueue.add({
            socketRoom: 'notifi_' + userId,
            data: { count },
            eventType: 'COUNT_NOTIFI_NO_READ',
          });
        }),
      );
    } catch (error) {
      console.error('NotificationQueue: processQueue error', error);
    } finally {
      done();
    }
  };
}
