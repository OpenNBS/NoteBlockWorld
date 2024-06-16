import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as express from 'express';

import { AppModule } from './app.module';
import { ParseTokenPipe } from './song/parseToken';

const logger: Logger = new Logger('main.ts');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use('/public', express.static('public'));

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

  const config = new DocumentBuilder()
    .setTitle('NoteBlockWorld API Backend')
    .setDescription('Backend application for NoteBlockWorld')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // enable cors
  app.enableCors({
    allowedHeaders: ['content-type', 'authorization'],
    exposedHeaders: ['Content-Disposition'],
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);

  const swaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  SwaggerModule.setup('api/doc', app, document, swaggerOptions);

  const port = process.env.PORT || 4000;

  logger.log('Open NoteBlockWorld API Backend🎶🌎🌍🌏 ');

  await app.listen(port);

  return port;
}

bootstrap()
  .then((port) => {
    logger.warn(`Application is running on: http://localhost:${port}`);
    logger.warn(`See the documentation on: http://localhost:${port}/api/doc`);
  })
  .catch((error) => {
    logger.error(`Error: ${error}`);
  });
