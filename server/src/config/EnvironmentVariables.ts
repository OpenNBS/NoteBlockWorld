import { plainToInstance } from 'class-transformer';
import { IsEnum, IsOptional, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV?: Environment;

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

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_REFRESH_EXPIRES_IN: string;

  @IsString()
  MONGO_URL: string;

  @IsString()
  SERVER_URL: string;

  @IsString()
  FRONTEND_URL: string;

  @IsString()
  @IsOptional()
  APP_DOMAIN?: string;

  @IsString()
  RECAPTCHA_KEY: string;

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

  @IsString()
  DISCORD_WEBHOOK_URL: string;

  @IsString()
  COOKIE_EXPIRES_IN: string;
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
