/**
 * Full-page screenshots for public routes (committed under cypress/baseline/).
 *
 * Prerequisites: frontend (and usually API) running; regenerate after UI changes:
 *   cd apps/e2e && bun run cy:baseline
 *
 * Dynamic routes (/song/:id, /blog/:id, …) use CYPRESS_* env vars when set; otherwise skipped.
 */
import { SEED_E2E_BROWSER_CLOCK_MS } from '@nbw/config';

const VIEWPORT = { width: 1280, height: 720 } as const;

type PageTarget = { path: string; file: string };

const STATIC_PAGES: PageTarget[] = [
  { path: '/', file: 'page-home' },
  { path: '/about', file: 'page-about' },
  { path: '/contact', file: 'page-contact' },
  { path: '/search', file: 'page-search' },
  { path: '/upload', file: 'page-upload' },
  { path: '/my-songs', file: 'page-my-songs' },
  { path: '/help', file: 'page-help' },
  { path: '/blog', file: 'page-blog' },
  { path: '/login', file: 'page-login' },
  { path: '/login/email', file: 'page-login-email' },
  { path: '/logout', file: 'page-logout' },
  { path: '/privacy', file: 'page-privacy' },
  { path: '/terms', file: 'page-terms' },
  { path: '/guidelines', file: 'page-guidelines' },
  {
    path: '/__cypress_unknown_route__/nbw',
    file: 'page-not-found',
  },
];

function optionalPage(
  envName: string,
  pathSuffix: string,
  file: string,
): PageTarget | null {
  const id = Cypress.env(envName) as string | undefined;
  if (!id || typeof id !== 'string') {
    return null;
  }
  return { path: `${pathSuffix}/${id}`, file };
}

describe('Page baseline snapshots', () => {
  beforeEach(() => {
    cy.viewport(VIEWPORT.width, VIEWPORT.height);
    cy.clock(SEED_E2E_BROWSER_CLOCK_MS, ['Date']);
  });

  for (const { path, file } of STATIC_PAGES) {
    it(file, () => {
      cy.visit(path, { failOnStatusCode: false });
      cy.get('body', { timeout: 45_000 }).should('be.visible');
      cy.wait(800);
      cy.screenshot(file, { capture: 'fullPage', overwrite: true });
    });
  }

  const dynamicPages: PageTarget[] = [
    optionalPage('SNAPSHOT_SONG_ID', '/song', 'page-song-detail'),
    optionalPage('SNAPSHOT_BLOG_ID', '/blog', 'page-blog-detail'),
    optionalPage('SNAPSHOT_HELP_ID', '/help', 'page-help-detail'),
  ].filter((p): p is PageTarget => p !== null);

  for (const { path, file } of dynamicPages) {
    it(file, () => {
      cy.visit(path, { failOnStatusCode: false });
      cy.get('body', { timeout: 45_000 }).should('be.visible');
      cy.wait(800);
      cy.screenshot(file, { capture: 'fullPage', overwrite: true });
    });
  }
});
