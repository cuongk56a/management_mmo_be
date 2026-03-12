import express, { Request, Response } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import routes from './routes/v1';
import fileUpload from 'express-fileupload';
import { rateLimit } from 'express-rate-limit';
import { requestContext } from './requestContext';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
const app = express();
// app.set('trust proxy', 1);
var bodyParser = require('body-parser');

app.use(express.static('public'));
// import http from 'http';

// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';
// import swaggerDef from './docs/swaggerDef';
import { appConfigs } from './config/config';
import ApiError from './utils/core/ApiError';
import { errorConverter, errorHandler } from './middlewares/error';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.',
  skipSuccessfulRequests: true,
  keyGenerator: (req: Request) => {
    const cfIp = req.headers['cf-connecting-ip'];
    if (cfIp) return cfIp as string;

    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      return typeof forwardedFor === 'string' ? forwardedFor.split(',')[0].trim() : forwardedFor[0];
    }

    return req.ip || 'unknown-ip';
  },
});
// app.use(limiter);

import { morganHandler } from './config/morgan';
if (appConfigs.env !== 'test') {
  app.use(morganHandler.successHandler);
  app.use(morganHandler.errorHandler);
}

// parse json request body
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Serving static files
// app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser() as any);
app.use(fileUpload() as any);

// enable cors
// app.use(cors());
// app.options('*', cors());
app.use(cors({
  origin: true, // Sẽ tự động lấy origin của FE gọi tới để map vào Allow-Origin (hoặc bạn có thể truyền array ['http://localhost:5173', 'https://domain-fe.com'])
  credentials: true, // BẮT BUỘC: Cho phép FE đính kèm cookie/header xác thực
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-forwarded-for', 'cf-connecting-ip']
}));
app.options('*', cors({
  origin: true,
  credentials: true
}));

// // jwt authentication
import passport from 'passport';
import { jwtStrategy, googleStrategy } from './config/passport';
import path from 'path';
app.use(passport.initialize() as any);
passport.use('jwt', jwtStrategy);
passport.use('google', googleStrategy);

//Domain
app.use((req, res, next) => {
  const domain = `${req.protocol}://${req.get('host')}`;

  requestContext.run({ domain }, () => {
    next();
  });
});

app.use("/uploads", express.static("uploads"));

import { RegisterRoutes } from './tsoaRoutes/routes';
app.use('/v1', routes);
RegisterRoutes(app);

import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';

try {
  app.use('/docs',
    (req, res, next) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      next();
    },
    swaggerUi.serve as any,
    (req, res) => {
      try {
        const swaggerPath = path.join(__dirname, '../public/swagger.json');
        const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
        swaggerDocument.servers = [
          {
            url: "/v1",
            description: "Current Server"
          }
        ];

        const html = swaggerUi.generateHTML(swaggerDocument);
        const noCacheHtml = html.replace('swagger-ui-init.js', `swagger-ui-init.js?v=${Date.now()}`);
        res.send(noCacheHtml);
      } catch (error) {
        res.status(500).send('Swagger file not generated yet...');
      }
    }
  );
} catch (error) {
  console.log('Swagger file not generated yet, skip serving /docs');
}

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
