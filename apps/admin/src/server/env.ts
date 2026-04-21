import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  ADMIN_APP_HOST: z.string().default('0.0.0.0'),
  ADMIN_APP_PORT: z.coerce.number().int().positive().default(4010),
  MONGO_URL: z.string().min(1),
  S3_ENDPOINT: z.string().min(1),
  S3_BUCKET_SONGS: z.string().min(1),
  S3_BUCKET_THUMBS: z.string().min(1),
  S3_KEY: z.string().min(1),
  S3_SECRET: z.string().min(1),
  S3_REGION: z.string().min(1),
});

export type AdminEnvironment = z.output<typeof envSchema>;

export function parseEnvironment(source: Record<string, string | undefined>) {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const messages = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Admin environment validation failed:\n${messages}`);
  }

  return result.data;
}
