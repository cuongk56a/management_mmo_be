import Joi from 'joi';
import { customValidations } from '../../utils/validations/custom.validation';
import { ROLETYPE } from './employee.type';

const createEmployeeValidation = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    role: Joi.string().valid(...Object.values(ROLETYPE)).required(),
    commissionRate: Joi.number().min(0).max(100).default(0),
    isActive: Joi.boolean().default(true),
    ...customValidations.createEntityValidation,
  }),
};

const updateEmployeeValidation = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    role: Joi.string().valid(...Object.values(ROLETYPE)),
    commissionRate: Joi.number().min(0).max(100),
    isActive: Joi.boolean(),
    ...customValidations.updateEntityValidation,
  }).min(1),
};

const getOne = {
  params: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
  }),
  query: Joi.object().keys({
    hasUser: Joi.boolean(),
  }),
};

const getList = {
  query: Joi.object().keys({
    search: Joi.string().empty(''),
    isActive: Joi.boolean(),
    role: Joi.string().valid(...Object.values(ROLETYPE)),
    hasUser: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    search: Joi.string().empty(''),
    isActive: Joi.boolean(),
    role: Joi.string().valid(...Object.values(ROLETYPE)),
    hasUser: Joi.boolean(),
  }),
};

export const employeeValidation = {
  createEmployeeValidation,
  updateEmployeeValidation,
  getOne,
  getAll,
  getList,
};
