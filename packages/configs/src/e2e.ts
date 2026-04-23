/**
 * Request header for `POST /v1/auth/e2e/session` (Nest, development only).
 * Value must match backend env `E2E_AUTH_SECRET`.
 */
export const E2E_AUTH_HEADER = 'x-nbw-e2e-auth';

/** First deterministic seed user (`deterministicSeedEmail(0)` in seed service). */
export const DEFAULT_E2E_SEED_USER_EMAIL =
  'nbw-seed-0000@seed.noteblockworld.test';
