import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { pick } from '../../utils/core/pick';
import { userService } from './user.service';
import { genCode } from '../../utils/core/genCode';
import nodemailer from 'nodemailer';
import { appConfigs } from '../../config/config';
import { hashPassword } from '../../utils/hashUtil';
import { sendCreated, sendNoContent, sendOk } from '../../utils/core/response';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  let user;

  try {
    const newPassword = await genCode(3);
    const password = await hashPassword(newPassword);

    user = await userService.createOne(
      { ...req.body, hashedPassword: password }
    );
    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Create User Failed!');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: appConfigs.google.email,
        pass: appConfigs.google.pass,
      },
    });

    const received = {
      from: appConfigs.google.email,
      to: user.email,
      subject: 'Cấp Mật Khẩu Mới',
      html: `
        <p>- Mật khẩu mới đã được khởi tạo.</p>
        <p>- Mật khẩu của bạn: <b>${newPassword}</b></p>
        <p>- Vui lòng đổi lại mật khẩu để bảo mật tài khoản!</p>
      `,
    };

    // nodemailer dùng promise
    await transporter.sendMail(received);
    return sendCreated(res, undefined, 'Password has been sent to your email!');

  } catch (error: any) {
    if (user) {
      await userService.deleteOne({ _id: user._id });
    }
    return next(new ApiError(httpStatus.BAD_REQUEST, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    if (req.userId != userId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Not Have Authorized!');
    }
    const data = await userService.updateOne({ _id: userId }, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const data = await userService.deleteOne({ _id: userId });
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendNoContent(res);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  // console.log("🚀 ~ getOne ~ userId:", getNewToken({userId: userId}))
  const options = pick(req.query, ['hasAddress', 'hasRole', 'hasOrganization']);
  try {
    const [data, user] = await Promise.all([
      userService.getOne({ _id: userId }, options),
      userService.getOne({ _id: req.userId })
    ]);
    if (userId != req.userId || !user?.isAdmin) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Not Have Authorized!');
    }
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['search', 'phone', 'email', 'isAdmin']);
  const options = pick(req.query, ['hasAddress', 'hasOrganization', 'hasRole']);
  const queryOptions = pick(req.query, ['sort', 'limit', 'page']);
  try {
    const data = await userService.getList(filter, { ...queryOptions, options });
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['organizationIds', 'search', 'phone', 'email', 'isAdmin']);
  const options = pick(req.query, ['hasAddress', 'hasOrganization', 'hasRole']);
  try {
    const data = await userService.getAll(filter, options);
    return sendOk(res, data, 'OK');
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const userController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
};
