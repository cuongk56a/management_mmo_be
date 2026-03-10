import Joi from 'joi';

export const createProductValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().valid('external', 'internal').required(),
    costPrice: Joi.number().required(),
    sellPrice: Joi.number().required(),
    description: Joi.string().allow(''),
    supplier: Joi.string().allow(''),
  }),
};

export const updateProductValidation = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    type: Joi.string().valid('external', 'internal'),
    costPrice: Joi.number(),
    sellPrice: Joi.number(),
    description: Joi.string().allow(''),
    supplier: Joi.string().allow(''),
  }).min(1),
};
