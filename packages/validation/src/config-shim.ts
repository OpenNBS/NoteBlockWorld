/**
 * Re-export @nbw/config via relative path so Bun can resolve nested imports from
 * validation dist when tests/apps load @nbw/validation.
 */
export * from '../../configs/dist/index.js';
