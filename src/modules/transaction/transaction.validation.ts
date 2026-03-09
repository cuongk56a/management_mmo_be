import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import { SOURCE_FOR, TRANSACTION_STATUS, TRANSACTION_TYPE } from './transaction.type';

const createOne = {
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).required(),
    targetOnModel: Joi.string(),
    value: Joi.number(),
    transType: Joi.string().valid(...Object.values(TRANSACTION_TYPE)),
    data: Joi.object().keys({
      userId: Joi.string().custom(customValidations.objectId),
      sourceFor: Joi.string().valid(...Object.values(SOURCE_FOR)),
      shopId: Joi.string().custom(customValidations.objectId),
    }),
    transContent: Joi.string().allow(null,""),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    status: Joi.string().valid(...Object.values(TRANSACTION_STATUS)),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};


const getOne = {
  params: Joi.object().keys({
    transactionId: Joi.string().custom(customValidations.objectId).required(),
  }),
  query: Joi.object().keys({
    hasTarget: Joi.boolean(),
    hasShop: Joi.boolean(),
    hasCreatedBy: Joi.boolean(),
    hasUpdatedBy: Joi.boolean(),
  }),
};

const getList = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    createdById: Joi.string().custom(customValidations.objectId),
    status: Joi.string().valid(...Object.values(TRANSACTION_STATUS)),
    hasTarget: Joi.boolean(),
    hasShop: Joi.boolean(),
    hasCreateBy: Joi.boolean(),
    hasUpdateBy: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    createdById: Joi.string().custom(customValidations.objectId),
    status: Joi.string().valid(...Object.values(TRANSACTION_STATUS)),
    hasTarget: Joi.boolean(),
    hasShop: Joi.boolean(),
    hasCreateBy: Joi.boolean(),
    hasUpdateBy: Joi.boolean(),
  }),
};

export const transactionValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
