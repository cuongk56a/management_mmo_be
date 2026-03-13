import express from 'express';
import { auth } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { reportController } from './report.controller';
import { reportValidation } from './report.validation';
import { AdminPermission } from '../../middlewares/checkPermission';

const router = express.Router();

router.route('/monthly').get(auth(), AdminPermission(), validate(reportValidation.getMonthlyReport), reportController.getMonthlyReport);
router.route('/').get(auth(), AdminPermission(), reportController.getList);

export const reportRoute = router;
