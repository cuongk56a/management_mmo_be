import express from 'express';
import { auth } from '../../middlewares/auth';
import { addCreatedByIdToBody, addDeletedByToBody, addUpdatedByIdToBody } from '../../middlewares/addUserToBody';
import { validate } from '../../middlewares/validate';
import { userController } from './user.controller';
import { userValidation } from './user.validation';
import { AdminPermission, Permission, SellerPermission } from '../../middlewares/checkPermission';

const router = express.Router();

router
  .route('/')
  // .post(auth(), Permission(), addCreatedByIdToBody, validate(userValidation.createOne), userController.createOne)
  .get(auth(), validate(userValidation.getList), userController.getList);

router.route('/all').get(auth(), SellerPermission(), validate(userValidation.getAll), userController.getAll);

router
  .route('/:userId')
  .get(auth(), validate(userValidation.getOne), userController.getOne)
  .patch(auth(), addUpdatedByIdToBody, validate(userValidation.updateOne), userController.updateOne);
// .delete(auth(), Permission(), addDeletedByToBody, validate(userValidation.deleteOne), userController.deleteOne);

export const userRoute = router;