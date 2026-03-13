import express from 'express';
import { auth } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { walletController } from './wallet.controller';
import { walletValidation } from './wallet.validation';

const router = express.Router();

router.route('/').get(auth(), walletController.getWallet);

router.route('/deposit').post(auth(), validate(walletValidation.createDeposit), walletController.createDeposit);
router.route('/deposit-history').get(auth(), walletController.getDepositHistory);

router.route('/withdraw').post(auth(), validate(walletValidation.createWithdraw), walletController.createWithdraw);
router.route('/withdraw-history').get(auth(), walletController.getWithdrawHistory);

export const walletRoute = router;
