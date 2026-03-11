import { Router } from 'express';
import { createEmployee, getEmployees, getEmployee, updateEmployee, deleteEmployee } from './employee.controller';
import { authMmo } from '../../middlewares/authMmo';
import { checkPermissionMmo } from '../../middlewares/checkPermissionMmo';
import validate from '../../middlewares/validate';
import { createEmployeeValidation, updateEmployeeValidation } from './employee.validation';

const router = Router();

router.use(authMmo());
router.use(checkPermissionMmo(['ADMIN']));

router.post('/', validate(createEmployeeValidation), createEmployee);
router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.put('/:id', validate(updateEmployeeValidation), updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
