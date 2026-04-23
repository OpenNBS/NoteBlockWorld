/** Default Faker PRNG seed: same empty DB + same seed produces the same dataset. */
export const DEFAULT_SEED_FAKER = 42_424_242;

/**
 * Upper bound for random `createdAt` values so seed runs are reproducible
 * (avoid `new Date()` which moves every run).
 */
export const DEFAULT_SEED_DATA_TIME_CAP = new Date('2025-06-15T12:00:00.000Z');

export const SEED_USER_COUNT_MIN = 1;
export const SEED_USER_COUNT_MAX = 500;

/**
 * Same empty DB + same options ⇒ same Faker-driven fields, NBS payloads, and timestamps
 * (emails are stable `nbw-seed-NNNN@…`). Mongo `_id` and song `publicId` (nanoid) still vary per run.
 */
export type SeedDevOptions = {
  /** Faker PRNG seed (default {@link DEFAULT_SEED_FAKER}). */
  fakerSeed?: number;
  /** Inclusive upper bound for random `createdAt` on users and songs. */
  createdAtUpper?: Date;
  /** How many users to create (clamped to 1–500, default 100). */
  userCount?: number;
};
