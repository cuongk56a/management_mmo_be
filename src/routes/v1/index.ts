import express from 'express';
import { appConfigs } from '../../config/config';
import { userRoute } from '../../modules/user/user.route';
import { organizationRoute } from '../../modules/organization/organization.route';
import { locationRoute } from '../../modules/location/location.route';
import { authRoute } from '../../modules/auth/auth.route';
import { activityLogRoute } from '../../modules/activityLog/activityLog.route';
import { attachmentRoute } from '../../modules/attachment/attachment.route';
import { addressRoute } from '../../modules/address/address.route';
import { shopRoute } from '../../modules/shop/shop.route';
import { transactionRoute } from '../../modules/transaction/transaction.route';
import { orderRoute } from '../../modules/order/order.route';
import { roleRoute } from '../../modules/role/role.route';
import { crawlRoute } from '../../modules/crawl/crawl.route';
import { flashShippingRoute } from '../../modules/flashShipping/flashShipping.route';
import { notificationRoute } from '../../modules/notification/notification/notification.route';
import { historyRoute } from '../../modules/notification/history/history.route';
import { designRoute } from '../../modules/design/design.route';
import { shopifyRoute } from '../../modules/shopify/shopify.route';

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
        path: '/organization',
        route: organizationRoute
    },
    {
        path: '/location',
        route: locationRoute
    },
    {
        path: '/activity-log',
        route: activityLogRoute
    },
    {
        path: '/attachment',
        route: attachmentRoute,
    },
    {
        path: '/address',
        route: addressRoute,
    },
    {
        path: '/shop',
        route: shopRoute,
    },
    {
        path: '/transaction',
        route: transactionRoute,
    },
    {
        path: '/order',
        route: orderRoute,
    },
    {
        path: '/role',
        route: roleRoute,
    },
    {
        path: '/crawl',
        route: crawlRoute,
    },
    {
        path: '/fls',
        route: flashShippingRoute,
    },
    {
        path: '/notification',
        route: notificationRoute,
    },
    {
        path: '/history',
        route: historyRoute,
    },
    {
        path: '/design',
        route: designRoute,
    },
    {
        path: '/shopify',
        route: shopifyRoute,
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