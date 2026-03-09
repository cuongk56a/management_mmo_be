import Bull from 'bull';
import SocketQueue from './queue/SocketQueue';
const SocketIO = require('socket.io');
import {Socket} from 'socket.io';
// import {notificationService} from '../modules/notification/notification.service';
import {IHistoryDoc} from '../modules/notification/history/history.type';
import ApiError from '../utils/core/ApiError';
import httpStatus from 'http-status';
import {HistoryModel} from '../modules/notification/history/history.model';
import mongoose from 'mongoose';

export const startSocketModule = (
  opts: Bull.QueueOptions,
  server: any,
  authSocketMid?: (socket: Socket, next: any) => void,
  listeners?: (socket: Socket) => void,
) => {
  const io = SocketIO(server, {
    cors: {
      origin: '*',
    },
  });
  if (!!authSocketMid) {
    io.use(authSocketMid);
  }

  const pushSocketQueue = new SocketQueue('SocketQueue');
  pushSocketQueue.initQueue(io, opts);

  io.on('connect_error', (err: Error) => {
    console.log(err instanceof Error); // true
    console.log('Socket:connect_error: ', err.message);
  });

  io.on('connection', (socket: Socket) => {
    console.log(`SocketId: ${socket.id}. User Connected`);

    socket.on('JOIN_ROOM', async (data: {roomId: string}) => {
      if (!!data && !!data.roomId) {
        socket.join(data.roomId);
        console.log(`User joined room ${data.roomId}`);
      }
    });

    socket.on('LEAVE_ROOM', (data: {roomId: string}) => {
      if (!!data && !!data.roomId) {
        socket.leave(data.roomId);
        socket.emit('appToClientLeaved', data);
      }
    });

    //server gửi
    // socket.on('sendNotification', async (data: {roomId: string; newNotfi: IHistoryDoc}) => {
    //   if (!!data && !!data.roomId && data.newNotfi) {
    //     // console.log(data)
    //     //client nhận
    //     io.to(data.roomId).emit('NOTIFICATION', data.newNotfi);
    //   }
    // });

    // socket.on('userRead', async (data: {roomId: string; notifiId: string}) => {
    //   if (!!data && !!data.roomId && data.notifiId) {
    //     io.to(data.roomId).emit('UPDATE_NOTIFICATION', data);
    //   }
    // });

    //Client gửi sử kiện UPDATE_NOTIFICATION khi đọc lên và server nhận và xử lí
    socket.on('UPDATE_NOTIFICATION', async (data: {roomId: string; notifiId: string}) => {
      if (!!data && !!data.roomId && data.notifiId) {
        try {
          const [history, countHistory] = await Promise.all([
            HistoryModel.findOne({
              _id: new mongoose.Schema.ObjectId(data.notifiId),
              readAt: {$exists: false},
              deletedAt: { $exists: false }
            }),
            HistoryModel.findOne({
              _id: new mongoose.Schema.ObjectId(data.notifiId),
              readAt: {$exists: false},
              deletedAt: { $exists: false }
            }).countDocuments(),
          ]);
          if (!history) {
            await HistoryModel.updateOne(
              {_id: new mongoose.Schema.ObjectId(data.notifiId)},
              {isRead: true, readAt: new Date()},
            );
            socket.to(data.roomId).emit('COUNT_NOTIFI_NO_READ', {count: countHistory-1})
          }else{
            socket.to(data.roomId).emit('COUNT_NOTIFI_NO_READ', {count: countHistory})
          }
        } catch (error: any) {
          throw new ApiError(httpStatus.BAD_REQUEST, error.message);
        }
      }
    });

    socket.on('disconnect', function () {
      console.log(`SocketId: ${socket.id}. User disconnect`);
    });

    !!listeners && listeners(socket);

    socket.onAny((eventName, data) => {
      console.log('socket_onAny', {
        eventName,
        data,
      });
    });
  });

  return io;
};
