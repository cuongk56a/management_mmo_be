import Joi from 'joi';
import { customValidations } from '../../utils/validations/custom.validation';

const createOne = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    staffId: Joi.string().custom(customValidations.objectId).empty(''),
    leadSourceId: Joi.string().custom(customValidations.objectId).allow(null, ''),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    staffId: Joi.string().custom(customValidations.objectId).empty(''),
    leadSourceId: Joi.string().custom(customValidations.objectId).allow(null, ''),
    ...customValidations.updateEntityValidation,
  }).min(1),
};

const deleteOne = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};

const getOne = {
  params: Joi.object().keys({
    customerId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const getList = {
  query: Joi.object().keys({
    staffId: Joi.string().custom(customValidations.objectId).empty(''),
    leadSourceId: Joi.string().custom(customValidations.objectId).empty(''),
    ...customValidations.paginateValidation,
  }),
};

export const customerValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getList,
};
