import express from 'express';
import { auth } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { productController } from './product.controller';
import { productValidation } from './product.validation';
import { AdminPermission } from '../../middlewares/checkPermission';

const router = express.Router();

router
  .route('/')
  .post(auth(), AdminPermission(), validate(productValidation.createOne), productController.createOne)
  .get(auth(), validate(productValidation.getList), productController.getList);

router
  .route('/:productId')
  .get(auth(), validate(productValidation.getOne), productController.getOne)
  .put(auth(), AdminPermission(), validate(productValidation.updateOne), productController.updateOne)
  .delete(auth(), AdminPermission(), validate(productValidation.deleteOne), productController.deleteOne);

export const productRoute = router;
