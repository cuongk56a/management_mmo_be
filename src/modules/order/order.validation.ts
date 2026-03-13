import Joi from 'joi';
import { customValidations } from '../../utils/validations/custom.validation';

const createOne = {
  body: Joi.object().keys({
    customerId: Joi.string().custom(customValidations.objectId).required(),
    productId: Joi.string().custom(customValidations.objectId).required(),
    price: Joi.number().required(),
    currency: Joi.string().valid('USD', 'VND').default('USD'),
  }),
};

const getList = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'completed', 'cancelled').empty(''),
    staffId: Joi.string().custom(customValidations.objectId).empty(''),
  }),
};

export const orderValidation = {
  createOne,
  getList,
};
