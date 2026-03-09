import Bull from 'bull';
import AbstractQueueProcessor from '../../redis/queue';

export default class SocketQueue extends AbstractQueueProcessor {
  socketIO: any;

  initQueue(socketIO: any, opts?: Bull.QueueOptions) {
    this.socketIO = socketIO;
    super.initQueue(opts);
  }

  processQueue = (job: any, done: any) => {
    // console.log(`___Processor___ processQueue: ${this.queueName}`, job.data);
    const {socketRoom, data, eventType} = job.data;

    // console.log('socket room: ', !!this.socketIO, socketRoom);
    
    this.socketIO?.to(socketRoom).emit(eventType, data);

    done();
  };
}
