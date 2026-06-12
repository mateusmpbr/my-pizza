import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@interface/swagger/swagger.config';
import { apiRouter } from '@interface/http/routes';
import { errorMiddleware } from '@interface/http/middlewares/error.middleware';
import { notFoundMiddleware } from '@interface/http/middlewares/notFound.middleware';

export function createApp(): express.Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json());
  app.use(morgan('combined'));

  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/v1', apiRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
