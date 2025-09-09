import baseConfig from './eslint.config.js';
import globals from 'globals';

export default [
  ...baseConfig,

  // Backend-specific configuration
  {
    files: ['apps/backend/**/*.ts', 'packages/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Backend can be more relaxed about some rules
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
