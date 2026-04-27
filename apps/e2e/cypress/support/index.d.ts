export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * `POST /v1/auth/e2e/session` then sets `token` and `refresh_token` cookies
       * on the spec origin (`baseUrl`). Requires backend `NODE_ENV=development`,
       * non-empty `E2E_AUTH_SECRET`, and Cypress env `E2E_AUTH_SECRET` + `API_URL`.
       * Defaults to the first seeded user email when no overrides are passed.
       */
      sessionViaApi(overrides?: {
        email?: string;
        userId?: string;
      }): Chainable<void>;
    }
  }
}
