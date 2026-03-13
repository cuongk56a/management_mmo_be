import Joi from 'joi';

const createDeposit = {
  body: Joi.object().keys({
    amount: Joi.number().min(1).required(),
    currency: Joi.string().valid('USD', 'VND').default('USD'),
    method: Joi.string().valid('bank', 'admin').required(),
  }),
};

const createWithdraw = {
  body: Joi.object().keys({
    amount: Joi.number().min(1).required(),
    currency: Joi.string().valid('USD', 'VND').default('USD'),
  }),
};

export const walletValidation = {
  createDeposit,
  createWithdraw,
};
