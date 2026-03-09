import Joi from 'joi';
import {customValidations} from '../../../utils/validations/custom.validation';
import { TABLE_ORGANIZATION } from '../../organization/organization.configs';

const createOne = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    message: Joi.string().allow("",null),
    isActive: Joi.boolean().default(true),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    message: Joi.string().allow("",null),
    isActive: Joi.boolean(),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(customValidations.objectId).required(),
  }),
  query: Joi.object().keys({
    hasHistory: Joi.boolean(),
  })
};

const getList = {
  query: Joi.object().keys({
    search: Joi.string().empty(),
    isActive: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    search: Joi.string().empty(),
    isActive: Joi.boolean(),
  }),
};

export const notificationValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
