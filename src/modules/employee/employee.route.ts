import express from 'express';
import { auth } from '../../middlewares/auth';
import { addCreatedByIdToBody, addDeletedByToBody, addUpdatedByIdToBody } from '../../middlewares/addUserToBody';
import { validate } from '../../middlewares/validate';
import { employeeValidation } from './employee.validation';
import { Permission } from '../../middlewares/checkPermission';
import { employeeController } from './employee.controller';

const router = express.Router();

router
    .route('/')
    // .post(auth(), Permission(), addCreatedByIdToBody, validate(employeeValidation.createOne), employeeController.createOne)
    .get(auth(), validate(employeeValidation.getList), employeeController.getList);

router.route('/all').get(auth(), Permission.EmployeePermission(), validate(employeeValidation.getAll), employeeController.getAll);

router
    .route('/:employeeId')
    .get(auth(), validate(employeeValidation.getOne), employeeController.getOne)
    .patch(auth(), Permission.AdminPermission(), addUpdatedByIdToBody, validate(employeeValidation.updateEmployeeValidation), employeeController.updateOne);
// .delete(auth(), Permission.AdminPermission(), addDeletedByToBody, validate(employeeValidation.deleteOne), employeeController.deleteOne);

export const employeeRoute = router;