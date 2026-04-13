import ms from 'ms';
import { z } from 'zod';

const durationString = z
  .string()
  .refine((v) => typeof ms(v as ms.StringValue) === 'number', {
    message: 'must be a valid duration string (e.g., "1h", "30m", "7d")',
  });

export const environmentVariablesSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).optional(),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),

  MAGIC_LINK_SECRET: z.string(),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: durationString,
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: durationString,

  MONGO_URL: z.string(),
  SERVER_URL: z.string(),
  FRONTEND_URL: z.string(),
  APP_DOMAIN: z.string().optional().default('localhost'),
  RECAPTCHA_KEY: z.string(),

  S3_ENDPOINT: z.string(),
  S3_BUCKET_SONGS: z.string(),
  S3_BUCKET_THUMBS: z.string(),
  S3_KEY: z.string(),
  S3_SECRET: z.string(),
  S3_REGION: z.string(),
  WHITELISTED_USERS: z.string().optional(),

  DISCORD_WEBHOOK_URL: z.string(),
  COOKIE_EXPIRES_IN: durationString,
});

export type EnvironmentVariables = z.output<typeof environmentVariablesSchema>;

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const result = environmentVariablesSchema.safeParse(config);
  if (!result.success) {
    const messages = result.error.issues
      .map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
        return `  - ${path}: ${issue.message}`;
      })
      .join('\n');
    throw new Error(`Environment validation failed:\n${messages}`);
  }
  return result.data;
}
