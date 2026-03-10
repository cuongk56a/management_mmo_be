import Joi from 'joi';

export const depositValidation = {
  body: Joi.object().keys({
    amount: Joi.number().min(1).required(),
    currency: Joi.string().valid('USD', 'VND').default('USD'),
    method: Joi.string().valid('bank', 'admin').required()
  }),
};

export const withdrawValidation = {
  body: Joi.object().keys({
    amount: Joi.number().min(1).required(),
    currency: Joi.string().valid('USD', 'VND').default('USD'),
  }),
};
