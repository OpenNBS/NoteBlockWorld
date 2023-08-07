import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import express = require('express');
import { Logger } from '@nestjs/common';

const logger: Logger = new Logger('main.ts');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.use('/public', express.static('public'));

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const config = new DocumentBuilder()
    .setTitle('NoteBlockWorld API Backend')
    .setDescription('Backend application for NoteBlockWorld')
    .setVersion('1.0')
    .addTag('main')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  SwaggerModule.setup('api/doc', app, document, swaggerOptions);

  const port = process.env.PORT || 4000;

  await app.listen(port);

  return port;
}

bootstrap()
  .then((port) => {
    logger.log(
      `Application is running on: http://localhost:${port}, see the documentation on: http://localhost:${port}/api/doc`,
    );
  })
  .catch((error) => {
    logger.log(`Error: ${error}`);
  });
