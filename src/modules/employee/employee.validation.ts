import Joi from 'joi';

export const createEmployeeValidation = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('ADMIN', 'STAFF').required(),
    commissionRate: Joi.number().min(0).max(1).default(0),
  }),
};

export const updateEmployeeValidation = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string().valid('ADMIN', 'STAFF'),
    commissionRate: Joi.number().min(0).max(1),
  }).min(1),
};
