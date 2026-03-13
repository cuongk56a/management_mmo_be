import express from 'express';
import { auth } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { expenseController } from './expense.controller';
import { expenseValidation } from './expense.validation';
import { AdminPermission } from '../../middlewares/checkPermission';

const router = express.Router();

router
  .route('/')
  .post(auth(), AdminPermission(), validate(expenseValidation.createOne), expenseController.createOne)
  .get(auth(), AdminPermission(), expenseController.getList);

export const expenseRoute = router;
