import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { appConfigs } from './config';
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

export const getNewToken = (payload: any) => {
  const expiresIn = appConfigs.jwt.accessExpirationSeconds;
  return jwt.sign(payload, appConfigs.jwt.secret, { expiresIn: `${expiresIn}s` });
};

export const getNewRefreshToken = (payload: any) => {
  const expiresIn = appConfigs.jwt.refreshExpirationDays;
  return jwt.sign(payload, appConfigs.jwt.secret, { expiresIn: `${expiresIn}d` });
};