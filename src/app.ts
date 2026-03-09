import express, {Request, Response} from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import routes from './routes/v1';
import {rateLimit} from 'express-rate-limit';
const app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'));
// import http from 'http';

// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import swaggerDef from './docs/swaggerDef';
import {appConfigs} from './config/config';
import ApiError from './utils/core/ApiError';
import {errorConverter, errorHandler} from './middlewares/error';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 50, // giới hạn mỗi IP chỉ được 100 yêu cầu trong 15 phút
  message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.',
  skipSuccessfulRequests: true,
  keyGenerator: (req: any, res: any) => {
    return req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
  },
});
// app.use(limiter);

import {morganHandler} from './config/morgan';
if (appConfigs.env !== 'test') {
  app.use(morganHandler.successHandler);
  app.use(morganHandler.errorHandler);
}

// parse json request body
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

// Serving static files
// app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
// app.use(helmet());

// parse urlencoded request body
app.use(express.urlencoded({extended: true, limit: '50mb'}));

// enable cors
app.use(cors());
app.options('*', cors());

// // jwt authentication
import passport from 'passport';
import {jwtStrategy} from './config/passport';
import path from 'path';
// import helmet from 'helmet';
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use('/v1', routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
