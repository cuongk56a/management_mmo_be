import express, { Request, Response } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import routes from './routes/v1';
import fileUpload from 'express-fileupload';
import { rateLimit } from 'express-rate-limit';
import { requestContext } from './requestContext';
const app = express();
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
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // giới hạn mỗi IP chỉ được 100 yêu cầu trong 15 phút
  message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.',
  skipSuccessfulRequests: true,
  keyGenerator: (req: any, res: any) => {
    return req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
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
// app.use(helmet());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(fileUpload() as any);
// enable cors
app.use(cors());
app.options('*', cors());

// // jwt authentication
import passport from 'passport';
import { jwtStrategy } from './config/passport';
import path from 'path';
// import helmet from 'helmet';
app.use(passport.initialize() as any);
passport.use('jwt', jwtStrategy);

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
  const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/swagger.json'), 'utf8'));
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
