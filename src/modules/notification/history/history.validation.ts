import Joi from 'joi';
import { customValidations } from '../../../utils/validations/custom.validation';

const markAsRead = {
  params: Joi.object().keys({
    historyId: Joi.string().custom(customValidations.objectId).required(),
  }),
};

const markAllAsRead = {
  body: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId),
  }),
};

const getOne = {
  params: Joi.object().keys({
    historyId: Joi.string().custom(customValidations.objectId).required(),
  }),
  query: Joi.object().keys({
    hasNotification: Joi.boolean(),
    hasUser: Joi.boolean(),
  }),
};

const getList = {
  query: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId),
    isRead: Joi.boolean(),
    notifiId: Joi.string().custom(customValidations.objectId),
    hasNotification: Joi.boolean(),
    hasUser: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};

const getAll = {
  query: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId),
    isRead: Joi.boolean(),
    notifiId: Joi.string().custom(customValidations.objectId),
    hasNotification: Joi.boolean(),
    hasUser: Joi.boolean(),
  }),
};

const getCountUnread = {
  query: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId),
  }),
};

export const historyValidation = {
  markAsRead,
  markAllAsRead,
  getOne,
  getAll,
  getList,
  getCountUnread,
};
