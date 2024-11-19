import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { initializeSwagger } from './initializeSwagger';

jest.mock('@nestjs/swagger', () => ({
  DocumentBuilder: jest.fn().mockImplementation(() => ({
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addBearerAuth: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({}),
  })),
  SwaggerModule: {
    createDocument: jest.fn().mockReturnValue({}),
    setup: jest.fn(),
  },
}));

describe('initializeSwagger', () => {
  let app: INestApplication;
  let documentBuilder: DocumentBuilder;

  beforeEach(() => {
    app = {} as INestApplication;
    documentBuilder = new DocumentBuilder();
  });

  it('should initialize Swagger with the correct configuration', () => {
    initializeSwagger(app);

    expect(SwaggerModule.createDocument).toHaveBeenCalledWith(
      app,
      expect.any(Object),
    );

    expect(SwaggerModule.setup).toHaveBeenCalledWith(
      'api/doc',
      app,
      expect.any(Object),
      {
        swaggerOptions: {
          persistAuthorization: true,
        },
      },
    );
  });
});
