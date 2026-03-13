import express from 'express';
import { auth } from '../../middlewares/auth';
import {
    addCreatedByIdToBody,
    addDeletedByToBody,
    addUpdatedByIdToBody,
} from '../../middlewares/addUserToBody'
import { validate } from '../../middlewares/validate';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';

const router = express.Router()

router.route('/me').get(auth(), authController.me);
router.route('/register').post(validate(authValidation.register), authController.register);
router.route('/login').post(validate(authValidation.login), authController.login);
router.route('/refresh').post(authController.refresh);
router.route('/change-password').patch(auth(), addUpdatedByIdToBody, validate(authValidation.changePassword), authController.changePassword);
router.route('/forgot-password').post(validate(authValidation.forgotPassword), authController.forgotPassword);
router.route('/send-mail').post(validate(authValidation.sendMail), authController.sendMail);

// Google OAuth
router.get('/google', authController.loginGoogle);
router.get('/google/callback', authController.loginGoogleCallback);

export const authRoute = router;
