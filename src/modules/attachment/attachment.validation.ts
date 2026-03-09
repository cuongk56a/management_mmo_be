import Joi from 'joi';

const createOrUpdateMany = {
  body: Joi.object().keys({
    images: Joi.array().items(Joi.string())
  }),
};

const getOne = {
  params: Joi.object().keys({
    fileName: Joi.string().required(),
  }),
};


const getAll = {
  query: Joi.object().keys({
    fileName: Joi.string().empty(''),
  }),
};

const createExcel = {
  body: Joi.object().keys({
    excel: Joi.any().meta({ swaggerType: 'file' }),
  }),
};

const getOneExcel = {
  params: Joi.object().keys({
    fileName: Joi.string().required(),
  }),
};

export const attachmentValidation = {
  createOrUpdateMany,
  getOne,
  createExcel,
  getOneExcel,
  getAll,
};
