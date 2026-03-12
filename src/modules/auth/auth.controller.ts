import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import { catchAsync } from '../../utils/core/catchAsync';
import { userService } from '../user/user.service';
import nodemailer from 'nodemailer';
import { getRedisCode, deleteRedisCode, setRedisCode } from '../../redis/redisCode';
import { appConfigs } from '../../config/config';
import { checkPassword, hashPassword } from '../../utils/hashUtil';
import { getNewRefreshToken, getNewToken } from '../../config/passport';
import { IUserDoc } from '../user/user.type';
import { genCode } from '../../utils/core/genCode';
import console from 'console';
import { RedisService } from '../../redis/RedisService';
var jwt = require('jsonwebtoken');

const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, confirmPassword, fullName, phone, code } = req.body;
  try {
    let confirmCode = await getRedisCode(email);
    if (!confirmCode) {
      return res.send({ code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Code is not correct!' });
    }
    const user: IUserDoc | null = await userService.getOne({ email: email });
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
        const timeExpire = appConfigs.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000;
        await Promise.all([RedisService.removeCachedRefreshToken(`refreshToken:${user.id}`), RedisService.setCachedRefreshToken(refreshToken, `refreshToken:${user.id}`, timeExpire)])
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          // secure: appConfigs.env === 'production',
          secure: true,
          sameSite: 'none',
          path: '/',
          maxAge: timeExpire,
        });
        res.send({ code: httpStatus.OK, status: 'Success', message: 'Login successfully!', data: { user, token } });
      } else {
        res.send({ code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Email Or Password Not Incorrect!' });
      }
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const refresh = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      return res.send({ code: httpStatus.UNAUTHORIZED, status: 'Error', message: 'No refresh token provided!' });
    }
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, appConfigs.jwt.secret);
    } catch (err: any) {
      return res.send({ code: httpStatus.UNAUTHORIZED, status: 'Error', message: 'Refresh token is not correct!' });
    }
    const refreshTokenCache = await RedisService.getCachedRefreshToken(`refreshToken:${decoded.userId}`);
    if (refreshTokenCache !== refreshToken) {
      return res.send({ code: httpStatus.UNAUTHORIZED, status: 'Error', message: 'Refresh token is not correct!' });
    }
    const user: IUserDoc | null = await userService.getOne({ _id: decoded.userId });

    if (!user) {
      return res.send({ code: httpStatus.NOT_FOUND, status: 'Error', message: 'Not found user!' });
    }

    const token = getNewToken({ userId: user.id });
    const newRefreshToken = getNewRefreshToken({ userId: user.id });
    const timeExpire = appConfigs.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000;
    await RedisService.removeCachedRefreshToken(`refreshToken:${user.id}`);
    await RedisService.setCachedRefreshToken(newRefreshToken, `refreshToken:${user.id}`, timeExpire);
    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      // secure: appConfigs.env === 'production',
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: timeExpire,
    });

    return res.send({
      code: httpStatus.OK,
      status: 'Success',
      message: 'Token refreshed successfully!',
      data: { user, token }
    });

  } catch (error: any) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
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
    const [confirmCode, newPassword] = await Promise.all([getRedisCode(email), genCode(3)]);
    if (!confirmCode) {
      return res.send({ code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Code is not correct!' });
    }
    if (confirmCode !== code) {
      return res.send({ code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Code is not correct!' });
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
          deleteRedisCode(email);
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
  try {
    const { email } = req.body;
    const existingCode = await getRedisCode(email);
    if (existingCode) {
      return res.send({ code: httpStatus.BAD_REQUEST, status: 'Error', message: 'Email has been sent!' });
    }
    const newCode = await setRedisCode(email);
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
      html: `<p>- Chào mừng bạn đã đến với hệ thống.</p><p>- Mã xác nhận của bạn: <span style="font-weight: bold">${newCode}</span></p><p>- Mã xác thực chỉ tồn tại trong vòng ${appConfigs.jwt.verifyEmailExpirationMinutes} phút!</p>`,
    };
    await transporter.sendMail(received, (error: any, info: any) => {
      if (error) {
        console.log(error);
        deleteRedisCode(email);
        throw new ApiError(httpStatus.BAD_REQUEST, 'Send Email Error!')
      } else {
        deleteRedisCode(email)
        console.log('Send Email Success! ' + info.response);
        return res.send({ code: httpStatus.OK, status: 'Success', message: 'Send Email Success!' });
      }
    });
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

// Bước 1: Chuyển hướng đến trang đăng nhập Google
const loginGoogle = (req: Request, res: Response, next: NextFunction) => {
  const passport = require('passport');
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res, next);
};

// Bước 2: Google callback — nhận profile, tạo token, redirect về frontend
const loginGoogleCallback = (req: Request, res: Response, next: NextFunction) => {
  const passport = require('passport');
  passport.authenticate('google', { session: false }, async (err: any, user: IUserDoc) => {
    try {
      if (err || !user) {
        return res.redirect(`${appConfigs.services.frontendUrl}/login?error=google_auth_failed`);
      }
      const token = getNewToken({ userId: user.id });
      const refreshToken = getNewRefreshToken({ userId: user.id });
      const timeExpire = appConfigs.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000;

      await RedisService.removeCachedRefreshToken(`refreshToken:${user.id}`);
      await RedisService.setCachedRefreshToken(refreshToken, `refreshToken:${user.id}`, timeExpire);

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: appConfigs.env === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: timeExpire,
      });

      // Redirect về frontend kèm token (frontend lưu vào localStorage)
      return res.redirect(`${appConfigs.services.frontendUrl}/login?token=${token}`);
    } catch (error: any) {
      return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    }
  })(req, res, next);
};

export const authController = {
  register,
  login,
  refresh,
  changePassword,
  forgotPassword,
  sendMail,
  loginGoogle,
  loginGoogleCallback,
};
