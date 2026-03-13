import Joi from 'joi';
import { customValidations } from '../../utils/validations/custom.validation';

const createOne = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().valid('external', 'internal').required(),
    costPrice: Joi.number().required(),
    sellPrice: Joi.number().required(),
    description: Joi.string().allow('').empty(''),
    supplier: Joi.string().allow('').empty(''),
  }),
};

const updateOne = {
  params: Joi.object().keys({
    productId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    type: Joi.string().valid('external', 'internal'),
    costPrice: Joi.number(),
    sellPrice: Joi.number(),
    description: Joi.string().allow('').empty(''),
    supplier: Joi.string().allow('').empty(''),
  }).min(1),
};

const deleteOne = {
  params: Joi.object().keys({
    productId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getOne = {
  params: Joi.object().keys({
    productId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    type: Joi.string().valid('external', 'internal').empty(''),
    supplier: Joi.string().empty(''),
  }),
};

export const productValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getList,
};
