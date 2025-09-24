import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule
} from '@nestjs/swagger';

export function initializeSwagger(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('NoteBlockWorld API Backend')
    .setDescription('Backend application for NoteBlockWorld')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const swaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true
    }
  };

  SwaggerModule.setup('docs', app, document, swaggerOptions);
}
