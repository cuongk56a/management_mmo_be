import Joi from 'joi';
import { customValidations } from '../../utils/validations/custom.validation';

const register = {
  body: Joi.object().keys({
    fullName: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().required(),
    confirmPassword: Joi.string().trim().required(),
    code: Joi.string().trim().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().required(),
  })
}

const changePassword = {
  body: Joi.object().keys({
    password: Joi.string().trim().required(),
    newPassword: Joi.string().trim().required(),
    cfNewPassword: Joi.string().trim().required(),
    ...customValidations.updateEntityValidation
  }),
}

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().trim().required(),
    code: Joi.string().trim().required(),
  })
}

const sendMail = {
  body: Joi.object().keys({
    email: Joi.string().email().trim().required(),
  })
}

export const authValidation = {
  register,
  login,
  changePassword,
  forgotPassword,
  sendMail,
};
