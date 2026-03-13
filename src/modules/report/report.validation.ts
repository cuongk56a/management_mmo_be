import Joi from 'joi';

const getMonthlyReport = {
  query: Joi.object().keys({
    month: Joi.string().pattern(/^\d{4}-\d{2}$/).empty(''), // format YYYY-MM
  }),
};

const getList = {
  query: Joi.object().keys({}),
};

export const reportValidation = {
  getMonthlyReport,
  getList,
};
