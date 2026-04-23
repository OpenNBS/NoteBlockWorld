import { DEFAULT_E2E_SEED_USER_EMAIL, E2E_AUTH_HEADER } from '@nbw/config';

Cypress.Commands.add(
  'sessionViaApi',
  (overrides?: { email?: string; userId?: string }) => {
    const apiRoot = (Cypress.env('API_URL') as string | undefined)?.replace(
      /\/$/,
      '',
    );
    if (!apiRoot) {
      throw new Error(
        'Cypress env API_URL is missing (e.g. http://localhost:4000/v1)',
      );
    }
    const secret = Cypress.env('E2E_AUTH_SECRET') as string | undefined;
    if (!secret) {
      throw new Error(
        'Cypress env E2E_AUTH_SECRET is required for sessionViaApi (must match backend E2E_AUTH_SECRET)',
      );
    }

    const email = overrides?.email?.trim();
    const userId = overrides?.userId?.trim();
    if (email && userId) {
      throw new Error('sessionViaApi: pass at most one of email or userId');
    }

    const body = email
      ? { email }
      : userId
      ? { userId }
      : { email: DEFAULT_E2E_SEED_USER_EMAIL };

    cy.request({
      method: 'POST',
      url: `${apiRoot}/auth/e2e/session`,
      headers: { [E2E_AUTH_HEADER]: secret },
      body,
      failOnStatusCode: true,
    }).then((res) => {
      const { access_token, refresh_token } = res.body as {
        access_token: string;
        refresh_token: string;
      };
      cy.setCookie('token', access_token, { path: '/' });
      cy.setCookie('refresh_token', refresh_token, { path: '/' });
    });
  },
);
