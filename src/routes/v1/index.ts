import express from 'express';
import { appConfigs } from '../../config/config';
import { userRoute } from '../../modules/user/user.route';
import { authRoute } from '../../modules/auth/auth.route';
import { attachmentRoute } from '../../modules/attachment/attachment.route';
import { transactionRoute } from '../../modules/transaction/transaction.route';
// import { orderRoute } from '../../modules/order/order.route';
import { notificationRoute } from '../../modules/notification/notification/notification.route';
import { historyRoute } from '../../modules/notification/history/history.route';

const router = express.Router();

const defaultRoutes: any[] = [
    {
        path: '/user',
        route: userRoute
    },
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/attachment',
        route: attachmentRoute,
    },
    {
        path: '/transaction',
        route: transactionRoute,
    },
    // {
    //     path: '/order',
    //     route: orderRoute,
    // },
    {
        path: '/notification',
        route: notificationRoute,
    },
    {
        path: '/history',
        route: historyRoute,
    },
];

const devRoutes: any[] = [
    // {
    //   path: '/docs',
    //   route: docsRoute,
    // },
];

defaultRoutes.forEach(route => {
    router.use(route.path, route.route);
});

if (appConfigs.env === 'development') {
    devRoutes.forEach(route => {
        router.use(route.path, route.route);
    });
}

export default router;