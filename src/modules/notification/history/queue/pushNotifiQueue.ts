import AbstractQueueProcessor, {createNewQueue} from '../../../../redis/queue';
import { HistoryModel } from '../history.model';
import {IHistoryDoc} from '../history.type';

export class NotificationQueue extends AbstractQueueProcessor {
  processQueue = async (
    job: {
      data: {
        notifi: IHistoryDoc;
        isNews: Boolean;
      };
    },
    done: any,
  ) => {
    const {notifi} = job.data;
    const {userId} = notifi;
    const socketQueue = createNewQueue('SocketQueue');
    try {
      await Promise.all([
        socketQueue.add({
          socketRoom: "notifi_" + userId,
          data: notifi,
          eventType: 'NOTIFICATION',
        }),

        HistoryModel.find({ userId: userId, readAt: { $exists: false }, deletedAt: { $exists: false } }).countDocuments().then(count => {
          socketQueue.add({
            socketRoom: "notifi_" + userId,
            data: { count },
            eventType: 'COUNT_NOTIFI_NO_READ',
          });
        })
      ]);
    } catch (error) {
      console.error("Error processing notification queue:", error);
    } finally {
      done();
    }
  };
}
