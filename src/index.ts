import mongoose from 'mongoose';
import app from './app';
import logger from './config/logger';
import { appConfigs } from './config/config';
import { fakeData } from './fakeData/fake';
import { onConnetCallback } from './redis';
import http from 'http';
import { Socket } from 'socket.io';
import cron from 'node-cron';
import { TransactionQueue } from './modules/transaction/queue/TransactionQueue';
import { PushOrderQueue } from './modules/flashShipping/queue/pushOrderQueue';
import { loginCronJob } from './modules/flashShipping/flashShipping.util';
import { orderService } from './modules/order/order.service';
import SocketQueue from './socket/queue/SocketQueue';
import { NotificationQueue } from './modules/notification/history/queue/pushNotifiQueue';

declare global {
  let __basedir: string;
  namespace Express {
    interface Request {
      userId: any;
      roleId: any;
      isAdmin: boolean;
    }
  }
}

const server = http.createServer(app);

onConnetCallback(() => {
  console.log('Redis Connect Success!');
  mongoose
    .connect(appConfigs.mongoose.url)
    .then(async () => {
      logger.info('Connected to MongoDB');

      if (appConfigs.env == 'development') {
        // Handle development-specific tasks here
      }

      server.listen(appConfigs.port, async () => {
        logger.info(`Listening to port ${appConfigs.port}`);

        // await loginCronJob();

        // cron.schedule('0 */4 * * *', async () => {
        //   try {
        //     await loginCronJob();
        //     console.log('Login Cron-job Successfully!');
        //   } catch (error) {
        //     console.error('Error updating product quantities:', error);
        //   }
        // }, {
        //   scheduled: true,
        //   timezone: 'Asia/Ho_Chi_Minh'
        // });

        // cron.schedule('*/30 * * * *', async () => {
        //   try {
        //     await orderService.statusFSCronJob();
        //     console.log('Update Order Cron-job Successfully!');
        //   } catch (error) {
        //     console.error('Error updating product quantities:', error);
        //   }
        // }, {
        //   scheduled: true,
        //   timezone: 'Asia/Ho_Chi_Minh'
        // });

        const {startSocketModule} = require('../src/socket/index');
        startSocketModule(undefined, server, (socket: Socket, next: any) => next(), undefined);

        const onTransQUE = new TransactionQueue('TransactionQueue');
        onTransQUE.initQueue();

        const onPushOrderQUE = new PushOrderQueue('PushOrderQueue');
        onPushOrderQUE.initQueue();

        const onNotifiQUE = new NotificationQueue('NotificationQueue');
        onNotifiQUE.initQueue();

        // fakeData();
      });
    })
    .catch((error) => {
      logger.error('Error connecting to MongoDB:', error);
      process.exit(1);
    });
});

const exitHandler = () => {
  server.close(() => {
    logger.info('Server closed');
    process.exit(1);
  });
};

const unexpectedErrorHandler = (error: any) => {
  logger.error('Unexpected error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  server.close();
});