import Joi from 'joi';
import {customValidations} from '../../../utils/validations/custom.validation';

const updateOne = {
  params: Joi.object().keys({
    historyId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    isRead: Joi.boolean(),
    readAt: Joi.date(),
    ...customValidations.updateEntityValidation,
  }),
};

const getOne = {
  params: Joi.object().keys({
    historyId: Joi.string().custom(customValidations.objectId).required(),
  }),
  query: Joi.object().keys({
    hasNotification: Joi.boolean(),
  })
};

const getList = {
  query: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId),
    isRead: Joi.boolean(),
    hasNotification: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};


const getAll = {
  query: Joi.object().keys({
    userId: Joi.string().custom(customValidations.objectId),
    isRead: Joi.boolean(),
    hasNotification: Joi.boolean(),
  }),
};

const getCountNoRead = {

}

export const historyValidation = {
  updateOne,
  getOne,
  getAll,
  getList,
  getCountNoRead,
};
