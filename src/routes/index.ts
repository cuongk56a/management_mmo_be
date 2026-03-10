import { Router } from 'express';
import { userRoute } from '../modules/user/user.route';
import { authRoute } from '../modules/auth/auth.route';
// Import các module mới tạo của MMO
import employeeRoute from '../modules/employee/employee.route';
import customerRoute from '../modules/customer/customer.route';
import productRoute from '../modules/product/product.route';
import orderRoute from '../modules/order/order.route';
import walletRoute from '../modules/wallet/wallet.route';
import expenseRoute from '../modules/expense/expense.route';
import reportRoute from '../modules/report/report.route';

const router = Router();

interface IRoute {
  path: string;
  route: Router;
}

const defaultRoutes: IRoute[] = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  // Các route MMO
  {
    path: '/employees',
    route: employeeRoute,
  },
  {
    path: '/customers',
    route: customerRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/wallet',
    route: walletRoute,
  },
  {
    path: '/expenses',
    route: expenseRoute,
  },
  {
    path: '/reports',
    route: reportRoute,
  },
];

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
