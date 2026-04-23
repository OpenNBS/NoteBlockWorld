/**
 * E2E tests hit the Next app (default http://localhost:3000).
 * Start the frontend before `cy:open` / `cy:run`. Many routes also need the API
 * (see apps/frontend/.env.local.example: NEXT_PUBLIC_API_URL).
 *
 * Docker deps (Mongo, MinIO, MailDev): from repo root run `bun run docker:reset`
 * before backend/tests when you need a clean stack; use `docker:reset:fresh` to
 * wipe volumes as well.
 *
 * Browser time in specs can align with backend seed caps via `@nbw/config`
 * (`DEFAULT_SEED_DATA_TIME_CAP`, `SEED_E2E_BROWSER_CLOCK_MS`).
 */
import { defineConfig } from 'cypress';

const baseUrl =
  process.env.CYPRESS_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

export default defineConfig({
  e2e: {
    baseUrl,
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false,
    screenshotOnRunFailure: true,
  },
});
