import { SEED_E2E_BROWSER_CLOCK_MS } from '@nbw/config';

describe('smoke', () => {
  it('loads the home page', () => {
    cy.clock(SEED_E2E_BROWSER_CLOCK_MS, ['Date']);
    cy.visit('/');
    cy.get('body').should('be.visible');
  });
});
