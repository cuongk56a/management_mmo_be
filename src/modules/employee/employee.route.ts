import express from 'express';
import { auth } from '../../middlewares/auth';
import { addCreatedByIdToBody, addDeletedByToBody, addUpdatedByIdToBody } from '../../middlewares/addUserToBody';
import { validate } from '../../middlewares/validate';
import { employeeValidation } from './employee.validation';
import { AdminPermission, Permission, SellerPermission } from '../../middlewares/checkPermission';
import { employeeController } from './employee.controller';

const router = express.Router();

router
    .route('/')
    // .post(auth(), Permission(), addCreatedByIdToBody, validate(employeeValidation.createOne), employeeController.createOne)
    .get(auth(), validate(employeeValidation.getList), employeeController.getList);

router.route('/all').get(auth(), SellerPermission(), validate(employeeValidation.getAll), employeeController.getAll);

router
    .route('/:employeeId')
    .get(auth(), validate(employeeValidation.getOne), employeeController.getOne)
    .patch(auth(), addUpdatedByIdToBody, validate(employeeValidation.updateEmployeeValidation), employeeController.updateOne);
// .delete(auth(), Permission(), addDeletedByToBody, validate(employeeValidation.deleteOne), employeeController.deleteOne);

export const employeeRoute = router;