import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { WalletService } from './wallet.service';
import { sendCreated, sendOk } from '../../utils/core/response';

const getWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await WalletService.getWallet(req.userId as string);
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const createDeposit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await WalletService.createDeposit(req.body, req.userId as string);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendCreated(res, data, 'Created');
  } catch (error: any) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
  }
});

const getDepositHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await WalletService.getDepositHistory(req.userId as string);
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const createWithdraw = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await WalletService.createWithdraw(req.body, req.userId as string);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendCreated(res, data, 'Created');
  } catch (error: any) {
    return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
  }
});

const getWithdrawHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await WalletService.getWithdrawHistory(req.userId as string);
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const walletController = {
  getWallet,
  createDeposit,
  getDepositHistory,
  createWithdraw,
  getWithdrawHistory,
};
