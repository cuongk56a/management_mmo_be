import Joi from 'joi';

export const createOrderValidation = {
  body: Joi.object().keys({
    customerId: Joi.string().required(),
    productId: Joi.string().required(),
    price: Joi.number().required(),
    currency: Joi.string().valid('USD', 'VND').default('USD'),
  }),
};
