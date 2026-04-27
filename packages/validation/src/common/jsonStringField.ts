import { z } from 'zod';

/**
 * Multipart / form fields often arrive as JSON strings. Parses the string and
 * validates with `schema`. Invalid JSON becomes a Zod issue (e.g. HTTP 400 via
 * `ZodValidationPipe`) instead of a raw `SyntaxError` from `JSON.parse`.
 */
export function jsonStringField<T>(schema: z.ZodType<T>) {
  return z
    .string()
    .transform((val, ctx) => {
      try {
        return JSON.parse(val) as unknown;
      } catch {
        ctx.addIssue({
          code: 'custom',
          message: 'Invalid JSON string',
          input: val,
        });
        return z.NEVER;
      }
    })
    .pipe(schema);
}
