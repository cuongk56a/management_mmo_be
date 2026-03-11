import { Router } from 'express';
import { createExpense, getExpenses } from './expense.controller';
import { authMmo } from '../../middlewares/authMmo';
import { checkPermissionMmo } from '../../middlewares/checkPermissionMmo';
import validate from '../../middlewares/validate';
import { createExpenseValidation } from './expense.validation';

const router = Router();

router.use(authMmo());
router.use(checkPermissionMmo(['ADMIN']));

router.post('/', validate(createExpenseValidation), createExpense);
router.get('/', getExpenses);

export default router;
