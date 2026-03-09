import Joi from 'joi';
import moment from 'moment'; // require
import {appConfigs} from '../../../src/config/config';

const objectId = (value: any, helpers: any) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value: any, helpers: any) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

// const fullName = (name: string, helpers: any) => {
//   if (name.length < 2) {
//     return helpers.message('name invalid');
//   }
//   if (
//     !name.match(
//       /[^a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/u,
//     )
//   ) {
//     return helpers.message('name invalid');
//   }
//   return name;
// };

const phone = (phone: string, helpers: any) => {
  if (phone.length < 10) {
    return helpers.message('phone invalid');
  }
  if (!phone.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)) {
    return helpers.message('phone invalid');
  }
  return phone;
};

const paginateValidation = {
  sort: Joi.string().empty(''),
  limit: Joi.number().integer(),
  page: Joi.number().integer(),
};

const createEntityValidation = {
  createdById: Joi.string().custom(objectId).required(),
};

const updateEntityValidation = {
  updatedById: Joi.string().custom(objectId).required(),
};

const createEntityValidationWhenFind = {
  createdById: Joi.string().custom(objectId),
};

const deleteEntityValidation = {
  deletedById: Joi.string().custom(objectId).required(),
  deletedAt: Joi.date().required(),
};

const validateDate = (value: any, helpers: any) => {
  if (!moment(value, appConfigs.validation.formatDate).isValid()) {
    return helpers.message(`"{{#label}}" must be a valid Date (${appConfigs.validation.formatDate}) `);
  }
  return value;
};

const validateDateTime = (value: any, helpers: any) => {
  if (!moment(value, appConfigs.validation.formatDateTime).isValid()) {
    return helpers.message(`"{{#label}}" must be a valid DateTime (${appConfigs.validation.formatDateTime}) `);
  }
  return value;
};

const email = (email: string, helpers: any) => {
  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
  ) {
    return helpers.message('email invalid');
  }
  return email;
};

const friendKey = (value: string, helpers: any) => {
  const ids = value.split('-');
  if (
    ids.length == 2 &&
    ids[0] < ids[1] &&
    ids.map((str: string) => str.match(/^[0-9a-fA-F]{24}$/)).filter((a: any) => !a).length == 0
  ) {
    return value;
  } else {
    return helpers.message('"{{#label}}" must be a valid friendKey');
  }
};

const validateCost = (value: any, helpers: any) => {
  if (typeof value === 'number' && value >= 0) {
    return value;
  }
  return helpers.message('"{{#label}}" must be a >= 0');
};

export const customValidations = {
  friendKey,
  objectId,
  password,
  paginateValidation,
  createEntityValidation,
  createEntityValidationWhenFind,
  deleteEntityValidation,
  updateEntityValidation,
  validateDate,
  validateDateTime,
  // fullName,
  phone,
  email,
  validateCost,
};
