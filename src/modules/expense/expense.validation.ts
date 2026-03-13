import Joi from 'joi';

const createOne = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    amount: Joi.number().min(1).required(),
    currency: Joi.string().valid('USD', 'VND').default('USD'),
    source: Joi.string().required(),
  }),
};

const getList = {
  query: Joi.object().keys({}),
};

export const expenseValidation = {
  createOne,
  getList,
};
