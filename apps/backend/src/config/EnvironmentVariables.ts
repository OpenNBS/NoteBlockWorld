import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  registerDecorator,
  validateSync,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import ms from 'ms';

// Validate if the value is a valid duration string from the 'ms' library
function IsDuration(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isDuration',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          return typeof ms(value as ms.StringValue) === 'number';
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid duration string (e.g., "1h", "30m", "7d")`;
        },
      },
    });
  };
}

enum Environment {
  Development = 'development',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV?: Environment;

  // OAuth providers
  @IsString()
  GITHUB_CLIENT_ID: string;

  @IsString()
  GITHUB_CLIENT_SECRET: string;

  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  DISCORD_CLIENT_ID: string;

  @IsString()
  DISCORD_CLIENT_SECRET: string;

  // Email magic link auth
  @IsString()
  MAGIC_LINK_SECRET: string;

  // jwt auth
  @IsString()
  JWT_SECRET: string;

  @IsDuration()
  JWT_EXPIRES_IN: ms.StringValue;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsDuration()
  JWT_REFRESH_EXPIRES_IN: ms.StringValue;

  // database
  @IsString()
  MONGO_URL: string;

  @IsString()
  SERVER_URL: string;

  @IsString()
  FRONTEND_URL: string;

  @IsString()
  @IsOptional()
  APP_DOMAIN: string = 'localhost';

  @IsString()
  RECAPTCHA_KEY: string;

  // s3
  @IsString()
  S3_ENDPOINT: string;

  @IsString()
  S3_BUCKET_SONGS: string;

  @IsString()
  S3_BUCKET_THUMBS: string;

  @IsString()
  S3_KEY: string;

  @IsString()
  S3_SECRET: string;

  @IsString()
  S3_REGION: string;

  @IsString()
  @IsOptional()
  WHITELISTED_USERS?: string;

  // discord webhook
  @IsString()
  DISCORD_WEBHOOK_URL: string;

  @IsDuration()
  COOKIE_EXPIRES_IN: ms.StringValue;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
