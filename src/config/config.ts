import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),

    REDIS_HOST: Joi.string().default('127.0.0.1'),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_PASSWORD: Joi.string().allow('', null),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    TABLE_PREFIX: Joi.string().required(),

    TIMEZONE: Joi.string().required(),
    VALIDATION_FORMAT_DATE: Joi.string().required(),
    VALIDATION_FORMAT_DATETIME: Joi.string().required(),

    APP_QUEUENAME_PREFIX: Joi.string().required(),

    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(5)
      .description('minutes after which verify email token expires'),
    JWT_SET_IMAGE_DAY: Joi.number()
      .default(1)
      .description('day after set image'),
    EMAIL: Joi.string().email().required(),
    PASS: Joi.string().required(),
    SERVICE_FILE_URI: Joi.string().required(),
    GOOGLE_CLIENT_ID: Joi.string().required().description('Google OAuth Client ID'),
    GOOGLE_CLIENT_SECRET: Joi.string().required().description('Google OAuth Client Secret'),
    GOOGLE_CALLBACK_URL: Joi.string().required().description('Google OAuth Callback URL'),
    FRONTEND_URL: Joi.string().required().description('Frontend URL'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const appConfigs = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  redis: `redis://:${!!envVars.REDIS_PASSWORD ? envVars.REDIS_PASSWORD + '@' : ''}@${envVars.REDIS_HOST}:${envVars.REDIS_PORT
    }`,
  redisHost: envVars.REDIS_HOST,
  redisPort: envVars.REDIS_PORT,
  redisPassword: envVars.REDIS_PASSWORD,
  token_secret: envVars.JWT_TOKEN_SECRET,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  database: {
    tablePrefix: envVars.TABLE_PREFIX,
  },
  queueNamePrefix: envVars.APP_QUEUENAME_PREFIX,
  timeZone: envVars.TIMEZONE,
  validation: {
    formatDate: envVars.VALIDATION_FORMAT_DATE,
    formatDateTime: envVars.VALIDATION_FORMAT_DATETIME,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    accessExpirationSeconds: envVars.JWT_ACCESS_EXPIRATION_MINUTES * 60,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    dayAfterSetImage: envVars.JWT_SET_IMAGE_DAY,
  },
  google: {
    email: envVars.EMAIL,
    pass: envVars.PASS,
    clientId: envVars.GOOGLE_CLIENT_ID,
    clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    callbackUrl: envVars.GOOGLE_CALLBACK_URL,
  },
  services: {
    svFile: envVars.SERVICE_FILE_URI,
    frontendUrl: envVars.FRONTEND_URL,
  },
};
