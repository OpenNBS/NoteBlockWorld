/**
 * `createZodDto(userIndexQuerySchema)` is invalid: the schema output is a union,
 * which nestjs-zod cannot turn into a class instance type (TS2509).
 * Validation is applied in UserController via `ZodValidationPipe(userIndexQuerySchema)`.
 */
export type { UserIndexQuery as UserIndexQueryDto } from '@nbw/validation';
export { userIndexQuerySchema } from '@nbw/validation';
