import {version} from '../../package.json';
import {appConfigs} from '../config/config';

const swaggerDef = {
  openapi: '3.0.0',
  security: [ { bearerAuth: [] } ],
  info: {
    title: 'LogRocket Express API with Swagger',
    version: version,
    description: 'This is a simple CRUD API application made with Express and documented with Swagger',
    license: {
      name: 'MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    // contact: {
    //   name: 'LogRocket',
    //   url: 'https://logrocket.com',
    //   email: 'info@email.com',
    // },
  },
  servers: [
    {
      url: `http://localhost:${appConfigs.port}/v1`,
    },
  ],
};

export default swaggerDef;
