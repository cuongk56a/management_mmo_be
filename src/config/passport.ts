import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { appConfigs } from './config';
import { userService } from '../modules/user/user.service';
var jwt = require('jsonwebtoken');

const jwtOptions = {
  secretOrKey: appConfigs.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: any, done: any) => {
  try {
    done(null, payload);
  } catch (error: any) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export const googleStrategy = new GoogleStrategy(
  {
    clientID: appConfigs.google.clientId,
    clientSecret: appConfigs.google.clientSecret,
    callbackURL: appConfigs.google.callbackUrl,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) return done(null, false);

      // Tìm user theo email, nếu chưa có thì tạo mới
      let user = await userService.getOne({ email });
      if (!user) {
        user = await userService.createOne({
          email,
          fullName: profile.displayName,
          avatar: profile.photos?.[0]?.value,
          googleId: profile.id,
        });
      }
      return done(null, user as any);
    } catch (error) {
      return done(error, false);
    }
  }
);

export const getNewToken = (payload: any) => {
  const expiresIn = appConfigs.jwt.accessExpirationSeconds;
  return jwt.sign(payload, appConfigs.jwt.secret, { expiresIn: `${expiresIn}s` });
};

export const getNewRefreshToken = (payload: any) => {
  const expiresIn = appConfigs.jwt.refreshExpirationDays;
  return jwt.sign(payload, appConfigs.jwt.secret, { expiresIn: `${expiresIn}d` });
};