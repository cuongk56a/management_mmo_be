import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { userService } from '../user/user.service';
import nodemailer from 'nodemailer';
import { getRedisCode, setRedisCode } from '../../redis/redisCode';
import { appConfigs } from '../../config/config';
import { checkPassword, hashPassword } from '../../utils/hashUtil';
import { getNewRefreshToken, getNewToken } from '../../config/passport';
import { IUserDoc } from '../user/user.type';
import { genCode } from '../../utils/core/genCode';

const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, confirmPassword, fullName, phone, code } = req.body;
  try {
    const confirmCode = await getRedisCode(email);
    const user: IUserDoc | null = await userService.getOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (!!user) {
      return res.send({ code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Email or phone number already exists!' });
    } if (password !== confirmPassword) {
      return res.send({ code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Password and confirm password do not match!' });
    } else if (confirmCode !== code) {
      return res.send({ code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Code is not correct!' });
    } else {
      const hashedPassword = await hashPassword(password);
      const data: IUserDoc | null = await userService.createOne({
        fullName,
        email,
        phone,
        hashedPassword,
      });
      if (!data) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
      }
      return res.send({ code: httpStatus.OK, status: 'Success', message: 'Register successfully!' });
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user: IUserDoc | null = await userService.getOne({ email });
    if (!user) {
      res.send({ code: httpStatus.NOT_FOUND, status: 'Error', message: 'Not Found User!' });
    } else {
      const check = await checkPassword(password, user?.hashedPassword);
      if (check) {
        const token = getNewToken({ userId: user.id });
        const refreshToken = getNewRefreshToken({ userId: user.id });
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: appConfigs.env === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: appConfigs.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000,
        });
        res.send({ code: httpStatus.OK, status: 'Success', message: 'Login successfully!', data: user, token: token });
      } else {
        res.send({ code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Email Or Password Not Incorrect!' });
      }
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const refresh = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.cookies['refresh_token'];
  try {
    const user: IUserDoc | null = await userService.getOne({ refreshToken });
    if (!user) {
      res.send({ code: httpStatus.NOT_FOUND, status: 'Error', message: 'Not Found User!' });
    } else {
      const token = getNewToken({ userId: user.id });
      const refreshToken = getNewRefreshToken({ userId: user.id });
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: appConfigs.env === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: appConfigs.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000,
      });
      res.send({ code: httpStatus.OK, status: 'Success', message: 'Token refreshed successfully!', data: user, token: token });
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { password, newPassword, cfNewPassword, updatedById, ...body } = req.body;
  try {
    if (newPassword !== cfNewPassword) {
      res.send({ code: httpStatus.BAD_REQUEST, status: 'Error', message: 'New password and confirm password do not match!' });
    }
    const [user, hashedPassword] = await Promise.all([userService.getOne({ _id: updatedById }), hashPassword(newPassword)]);
    if (!user) {
      res.send({ code: httpStatus.NOT_FOUND, status: 'Error', message: 'User not found!' });
    } else {
      const check = await checkPassword(password, user?.hashedPassword);

      if (check) {
        await userService.updateOne(
          {
            _id: updatedById,
          },
          {
            hashedPassword,
            updatedById,
            ...body,
          },
          {
            new: true,
          },
        );
        res.send({ code: httpStatus.OK, status: 'Success', message: 'Change password success!' });
      } else {
        res.send({ code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Password is not correct!' });
      }
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, code } = req.body;
  try {
    const [confirmCode, newPassword] = await Promise.all([getRedisCode(email), genCode(4)]);
    if (confirmCode !== code) {
      res.send({ code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Mã xác thực không đúng!' });
    } else {
      const hashedPassword = await hashPassword(newPassword);
      await userService.updateOne(
        {
          email,
        },
        {
          hashedPassword,
        },
        {
          new: true,
        },
      );
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: appConfigs.google.email,
          pass: appConfigs.google.pass,
        },
      });
      const received = {
        from: appConfigs.google.email,
        to: email,
        subject: 'Cấp Mật Khẩu Mới',
        html: `<p>- Mật khẩu mới đã được khởi tạo.</p><p>- Mật khẩu của bạn: <span style="font-weight: bold">${newPassword}</span></p><p>- Vui lòng đổi lại mật khẩu mới để bảo mật tài khoản!</p>`,
      };
      await transporter.sendMail(received, (error: any, info: any) => {
        if (error) {
          console.log(error);
          throw new ApiError(httpStatus.BAD_REQUEST, 'Send Email Error!')
        } else {
          console.log('Send Email Success! ' + info.response);
          return res.send({ code: httpStatus.OK, status: 'Success', message: 'Password has been sent to your email!' });
        }
      });
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const sendMail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    const confirmCode = await getRedisCode(email);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: appConfigs.google.email,
        pass: appConfigs.google.pass,
      },
    });
    const received = {
      from: appConfigs.google.email,
      to: email,
      subject: 'Mã Xác Thực',
      html: `<p>- Chào mừng bạn đã đến với hệ thống.</p><p>- Mã xác nhận của bạn: <span style="font-weight: bold">${confirmCode}</span></p><p>- Mã xác thực chỉ tồn tại trong vòng ${appConfigs.jwt.verifyEmailExpirationMinutes} phút!</p>`,
    };
    await transporter.sendMail(received, (error: any, info: any) => {
      if (error) {
        console.log(error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'Send Email Error!')
      } else {
        console.log('Send Email Success! ' + info.response);
        return res.send({ code: httpStatus.OK, status: 'Success', message: 'Send Email Success!' });
      }
    });
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const authController = {
  register,
  login,
  refresh,
  changePassword,
  forgotPassword,
  sendMail,
};
