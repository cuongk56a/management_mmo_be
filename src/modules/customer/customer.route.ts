import express from 'express';
import { auth } from '../../middlewares/auth';
import { addCreatedByIdToBody, addDeletedByToBody, addUpdatedByIdToBody } from '../../middlewares/addUserToBody';
import { validate } from '../../middlewares/validate';
import { customerController } from './customer.controller';
import { customerValidation } from './customer.validation';
import { AdminPermission, Permission, SellerPermission } from '../../middlewares/checkPermission';

const router = express.Router();

router
  .route('/')
  .post(auth(), addCreatedByIdToBody, validate(customerValidation.createOne), customerController.createOne)
  .get(auth(), validate(customerValidation.getList), customerController.getList);

router
  .route('/:customerId')
  .get(auth(), validate(customerValidation.getOne), customerController.getOne)
  .put(auth(), addUpdatedByIdToBody, validate(customerValidation.updateOne), customerController.updateOne)
  .delete(auth(), AdminPermission(), addDeletedByToBody, validate(customerValidation.deleteOne), customerController.deleteOne);

export const customerRoute = router;
