import { Router } from 'express';
import { createOrder, getOrders } from './order.controller';
import { authMmo } from '../../middlewares/authMmo';
import { checkPermissionMmo } from '../../middlewares/checkPermissionMmo';
import validate from '../../middlewares/validate';
import { createOrderValidation } from './order.validation';

const router = Router();

// Áp dụng middleware kiểm tra Auth cho mọi route
router.use(authMmo());

// STAFF, ADMIN được phép xem list orders 
// Khách hang (USER) xem qua route khách
router.get('/', checkPermissionMmo(['ADMIN', 'STAFF']), getOrders);

// Chỉ STAFF & ADMIN được phép tạo Order
router.post('/', 
  checkPermissionMmo(['ADMIN', 'STAFF']), 
  validate(createOrderValidation), 
  createOrder
);

export default router;
