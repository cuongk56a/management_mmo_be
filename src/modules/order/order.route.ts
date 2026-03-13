import express from 'express';
import { auth } from '../../middlewares/auth';
import { addCreatedByIdToBody } from '../../middlewares/addUserToBody';
import { validate } from '../../middlewares/validate';
import { orderController } from './order.controller';
import { orderValidation } from './order.validation';
import { AdminPermission, SellerPermission } from '../../middlewares/checkPermission';

const router = express.Router();

router
  .route('/')
  .post(auth(), SellerPermission(), addCreatedByIdToBody, validate(orderValidation.createOne), orderController.createOne)
  .get(auth(), SellerPermission(), validate(orderValidation.getList), orderController.getList);

export const orderRoute = router;
