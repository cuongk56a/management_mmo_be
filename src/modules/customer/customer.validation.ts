import Joi from 'joi';

export const createCustomerValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    staffId: Joi.string(),
    leadSourceId: Joi.string().allow(null, ''),
  }),
};

export const updateCustomerValidation = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    staffId: Joi.string(),
    leadSourceId: Joi.string().allow(null, ''),
  }).min(1),
};
