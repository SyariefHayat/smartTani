import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartTani - API Gateway API',
      version: '1.0.0',
      description: 'API documentation for API Gateway',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.ts', 
    './src/index.ts',
    '../auth-service/src/routes/*.ts',
    '../marketplace-service/src/routes/*.ts',
    '../order-service/src/routes/*.ts',
    '../investment-service/src/routes/*.ts',
    '../logistics-service/src/routes/*.ts',
    '../notification-service/src/routes/*.ts',
    '../analytics-service/src/routes/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
