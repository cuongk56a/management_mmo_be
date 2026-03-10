import Joi from 'joi';

export const createExpenseValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    amount: Joi.number().min(1).required(),
    currency: Joi.string().valid('USD', 'VND').default('USD'),
    source: Joi.string().required()
  }),
};
