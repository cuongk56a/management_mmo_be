import Joi from 'joi';
import { customValidations } from '../../utils/validations/custom.validation';

const createEmployeeValidation = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('ADMIN', 'STAFF').required(),
    commissionRate: Joi.number().min(0).max(1).default(0),
  }),
};

const updateEmployeeValidation = {
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

const getOne = {
  params: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
  }),
  query: Joi.object().keys({
    hasAddress: Joi.boolean(),
    hasRole: Joi.boolean(),
  }),
};

const getList = {
  query: Joi.object().keys({
    phone: Joi.string().empty(''),
    email: Joi.string().empty(''),
    search: Joi.string().empty(''),
    hasAddress: Joi.boolean(),
    hasRole: Joi.boolean(),
    isAdmin: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    phone: Joi.string().empty(''),
    email: Joi.string().empty(''),
    search: Joi.string().empty(''),
    hasAddress: Joi.boolean(),
    hasRole: Joi.boolean(),
    isAdmin: Joi.boolean(),
  }),
};

export const employeeValidation = {
  createEmployeeValidation,
  updateEmployeeValidation,
  getOne,
  getAll,
  getList,
};
