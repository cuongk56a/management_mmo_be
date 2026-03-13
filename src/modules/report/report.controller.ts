import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import { ReportService } from './report.service';
import { sendOk } from '../../utils/core/response';

const getMonthlyReport = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { month } = pick(req.query, ['month']);
  try {
    await ReportService.generateMonthlyReport(month as string | undefined);
    const query = month ? { month } : {};
    const reports = await ReportService.getMonthlyReports(query);
    return sendOk(res, { report: reports[0] }, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await ReportService.getMonthlyReports({});
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const reportController = {
  getMonthlyReport,
  getList,
};
