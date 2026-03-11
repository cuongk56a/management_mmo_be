import { Router } from 'express';
import { getMonthlyReport, getMonthlyReports } from './report.controller';
import { authMmo } from '../../middlewares/authMmo';
import { checkPermissionMmo } from '../../middlewares/checkPermissionMmo';

const router = Router();

router.use(authMmo());
router.use(checkPermissionMmo(['ADMIN']));

router.get('/monthly', getMonthlyReport);
router.get('/', getMonthlyReports);

export default router;
