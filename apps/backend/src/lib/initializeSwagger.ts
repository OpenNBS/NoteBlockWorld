import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  type OpenAPIObject,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';

/** nestjs-zod internal; must not sit on OpenAPI *parameter* objects (only in schemas). */
const ZOD_UNWRAP_ROOT = 'x-nestjs_zod-unwrap-root' as const;

function stripInvalidZodMarkersFromParameters(doc: OpenAPIObject) {
  // `cleanupOpenApiDoc` keeps this zod marker valid inside schema objects, but when it leaks
  // into operation parameters Swagger UI/OpenAPI validators flag the document as invalid.
  // We remove it here so generated docs remain standards-compliant and render reliably.
  const paths = doc.paths;
  if (!paths) return;
  for (const pathItem of Object.values(paths)) {
    if (!pathItem || typeof pathItem !== 'object') continue;
    for (const methodObject of Object.values(pathItem)) {
      if (!methodObject || typeof methodObject !== 'object') continue;
      const parameters = (methodObject as { parameters?: unknown[] })
        .parameters;
      if (!Array.isArray(parameters)) continue;
      for (const param of parameters) {
        if (param && typeof param === 'object' && ZOD_UNWRAP_ROOT in param) {
          delete (param as Record<string, unknown>)[ZOD_UNWRAP_ROOT];
        }
      }
    }
  }
}

export function initializeSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('NoteBlockWorld API Backend')
    .setDescription('Backend application for NoteBlockWorld')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const raw = SwaggerModule.createDocument(app, config);
  stripInvalidZodMarkersFromParameters(raw);
  const document = cleanupOpenApiDoc(raw);

  const swaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  SwaggerModule.setup('docs', app, document, swaggerOptions);
}
