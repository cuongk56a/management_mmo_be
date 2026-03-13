import Joi from 'joi';
import { customValidations } from '../../utils/validations/custom.validation';
import { UserGender } from './user.type';

const createOne = {
  body: Joi.object().keys({
    phone: Joi.string().required(),
    fullName: Joi.string().required(),
    email: Joi.string().required(),
    avatar: Joi.string().empty(''),
    birthday: Joi.string().empty(''),
    gender: Joi.string().valid(...Object.values(UserGender)).default(UserGender.OTHER),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    fullName: Joi.string(),
    avatar: Joi.string().empty(''),
    birthday: Joi.string(),
    gender: Joi.string().valid(...Object.values(UserGender)),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
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

export const userValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
