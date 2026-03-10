import { Router } from 'express';
import { getWallet, createDeposit, getDepositHistory, createWithdraw, getWithdrawHistory } from './wallet.controller';
import { authMmo } from '../../middlewares/authMmo';
import validate from '../../middlewares/validate';
import { depositValidation, withdrawValidation } from './wallet.validation';

const router = Router();

router.use(authMmo());

router.get('/', getWallet);

router.post('/deposit', validate(depositValidation), createDeposit);
router.get('/deposit-history', getDepositHistory);

router.post('/withdraw', validate(withdrawValidation), createWithdraw);
router.get('/withdraw-history', getWithdrawHistory);

export default router;
