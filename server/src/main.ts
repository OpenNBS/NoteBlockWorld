import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';

import { AppModule } from './app.module';
import { initializeSwagger } from './initializeSwagger';
import { ParseTokenPipe } from './parseToken';

const logger: Logger = new Logger('main.ts');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const parseTokenPipe = app.get<ParseTokenPipe>(ParseTokenPipe);

  app.useGlobalGuards(parseTokenPipe);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  if (process.env.NODE_ENV === 'development') {
    initializeSwagger(app);
  }

  // enable cors
  app.enableCors({
    allowedHeaders: ['content-type', 'authorization'],
    exposedHeaders: ['Content-Disposition'],
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  app.use('/api/v1', express.static('public'));

  const port = process.env.PORT || '4000';

  logger.log('Note Block World API Backend 🎶🌎🌍🌏 ');

  await app.listen(port);

  return port;
}

bootstrap()
  .then((port) => {
    logger.warn(`Application is running on: http://localhost:${port}`);

    if (process.env.NODE_ENV === 'development') {
      logger.warn(`Swagger is running on: http://localhost:${port}/api/doc`);
    }
  })
  .catch((error) => {
    logger.error(`Error: ${error}`);
  });
