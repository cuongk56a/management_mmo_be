import Joi from 'joi';
import {customValidations} from '../../utils/validations/custom.validation';
import {TABLE_ORGANIZATION} from '../organization/organization.configs';
import {DESIGN_STATUS, ORDER_STATUS} from './order.type';

const createOne = {
  body: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).required(),
    targetOnModel: Joi.string().valid(TABLE_ORGANIZATION).default(TABLE_ORGANIZATION),
    shopId: Joi.string().custom(customValidations.objectId),
    orderTiktokId: Joi.string().required(),
    createTimeOrderTT: Joi.string(),
    buyerUser: Joi.string(),
    receiveUser: Joi.string(),
    phone: Joi.string(),
    addressLine: Joi.string(),
    country: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    zipCode: Joi.number(),
    paymentMethod: Joi.string(),
    sellerNote: Joi.string().empty(''),
    shippingFee: Joi.number(),
    amount: Joi.number(),
    isDesign: Joi.boolean().default(false),
    products: Joi.array().items(
      Joi.object().keys({
        productName: Joi.string(),
        variationName: Joi.string(),
        productCategories: Joi.string(),
        designFrontUrl: Joi.string(),
        designBackUrl: Joi.string(),
        mockupFrontUrl: Joi.string(),
        mockupBackUrl: Joi.string(),
        quantity: Joi.number(),
        note: Joi.string().empty(''),
        isDesign: Joi.boolean(),
      }),
    ),
    status: Joi.string().valid(...Object.values(ORDER_STATUS)),
    ...customValidations.createEntityValidation,
  }),
};

const updateOne = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    sellerNote: Joi.string().allow('',null),
    linkLabel: Joi.string().allow('',null),
    ...customValidations.updateEntityValidation,
  }),
};

const deleteOne = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    ...customValidations.deleteEntityValidation,
  }),
};

const getOne = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(customValidations.objectId).required(),
  }),
  query: Joi.object().keys({
    hasTarget: Joi.boolean(),
    hasShop: Joi.boolean(),
    hasCreatedBy: Joi.boolean(),
  }),
};

const getList = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).empty(''),
    shopIds: Joi.string().empty(''),
    orderTiktokId: Joi.string().empty(''),
    CODE: Joi.string().empty(''),
    buyerUser: Joi.string().empty(''),
    receiveUser: Joi.string().empty(''),
    phone: Joi.string().empty(''),
    status: Joi.string().valid(...Object.values(ORDER_STATUS)).empty(''),
    startAt: Joi.string().custom(customValidations.validateDate).empty(''),
    endAt: Joi.string().custom(customValidations.validateDate).empty(''),
    designStatus: Joi.string().valid(...Object.values(DESIGN_STATUS)).empty(''),
    searchNameProduct: Joi.string().empty(''),
    hasTarget: Joi.boolean(),
    hasShop: Joi.boolean(),
    hasCreatedBy: Joi.boolean(),
    ...customValidations.paginateValidation,
  }),
};

const getAll = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId),
    shopIds: Joi.string().empty(''),
    orderTiktokId: Joi.string().empty(''),
    CODE: Joi.string().empty(''),
    buyerUser: Joi.string().empty(''),
    receiveUser: Joi.string().empty(''),
    phone: Joi.string().empty(''),
    status: Joi.string().valid(...Object.values(ORDER_STATUS)),
    startAt: Joi.string().custom(customValidations.validateDate).empty(''),
    endAt: Joi.string().custom(customValidations.validateDate).empty(''),
    hasTarget: Joi.boolean(),
    hasShop: Joi.boolean(),
    hasCreatedBy: Joi.boolean(),
  }),
};

const updateItem = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(customValidations.objectId).required(),
    itemId: Joi.string().custom(customValidations.objectId).required(),
  }),
  body: Joi.object().keys({
    designFrontUrl: Joi.string().allow(null, ''),
    designBackUrl: Joi.string().allow(null, ''),
    mockupFrontUrl: Joi.string().allow(null, ''),
    mockupBackUrl: Joi.string().allow(null, ''),
    note: Joi.string().allow(null, ''),
    designStatus: Joi.string().valid(...Object.values(DESIGN_STATUS)).empty(''),
    ...customValidations.updateEntityValidation,
  }),
};

const importExcel = {
  body: Joi.object().keys({
    fileName: Joi.string().required(),
    organizationId: Joi.string().custom(customValidations.objectId).required(),
    shopId: Joi.string().custom(customValidations.objectId).required(),
    ...customValidations.createEntityValidation,
  }),
};

const exportExcel = {
  query: Joi.object().keys({
    fileName: Joi.string().required(),
    orderIds: Joi.string().required(),
  }),
};

const getSummary = {
  query: Joi.object().keys({
    targetId: Joi.string().custom(customValidations.objectId).empty(''),
    shopId: Joi.string().custom(customValidations.objectId).empty(''),
    startAt: Joi.string().custom(customValidations.validateDate).empty(''),
  }),
};

export const orderValidation = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  updateItem,
  importExcel,
  exportExcel,
  getSummary,
};
