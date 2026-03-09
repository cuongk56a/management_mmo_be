import httpStatus from 'http-status';
import ApiError from '../utils/core/ApiError';
import { appConfigs } from '../config/config';
import logger from '../config/logger';

export const errorConverter = (err: any, req: any, res: any, next: any) => {
  const myStatus: any = httpStatus
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof Error ? error.statusCode : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || myStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err: any, req: any, res: any, next: any) => {
  const { statusCode, message } = err;
  // if (appConfigs.env === 'production' && !err.isOperational) {
  //   statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  //   message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  // }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(appConfigs.env === 'development' && { stack: err.stack }),
  };

  if (appConfigs.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
