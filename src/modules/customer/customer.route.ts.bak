import { Router } from 'express';
import { createCustomer, getCustomers, getCustomer, updateCustomer, deleteCustomer } from './customer.controller';
import { authMmo } from '../../middlewares/authMmo';
import { checkPermissionMmo } from '../../middlewares/checkPermissionMmo';
import validate from '../../middlewares/validate';
import { createCustomerValidation, updateCustomerValidation } from './customer.validation';

const router = Router();

router.use(authMmo());

router.post('/', checkPermissionMmo(['ADMIN', 'STAFF']), validate(createCustomerValidation), createCustomer);
router.get('/', checkPermissionMmo(['ADMIN', 'STAFF']), getCustomers);
router.get('/:id', checkPermissionMmo(['ADMIN', 'STAFF']), getCustomer);
router.put('/:id', checkPermissionMmo(['ADMIN', 'STAFF']), validate(updateCustomerValidation), updateCustomer);
router.delete('/:id', checkPermissionMmo(['ADMIN']), deleteCustomer);

export default router;
