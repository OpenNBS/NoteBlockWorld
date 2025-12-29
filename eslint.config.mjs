// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/generated/**',
      '**/*.spec.ts',
      '**/*.test.ts',
    ],
  },

  // Base recommended configurations
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Main configuration object
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.es2021, ...globals.bun },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
      'better-tailwindcss': betterTailwindcss,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [
            'apps/*/tsconfig.json',
            'packages/*/tsconfig.json',
            './tsconfig.json',
          ],
        },
        node: true,
      },
      'import/core-modules': ['bun:test', 'bun:sqlite', 'bun'],
      'better-tailwindcss': {
        tailwindConfig: './apps/frontend/tailwind.config.js',
      },
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      ...betterTailwindcss.configs.recommended.rules,

      // Core and TypeScript rules
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-unused-vars': 'off', // Handled by unused-imports plugin
      'lines-between-class-members': [
        'warn',
        'always',
        { exceptAfterSingleLine: true },
      ],

      // Import rules
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'unknown',
          ],
          pathGroups: [
            { pattern: '@/**', group: 'internal' },
            { pattern: '@nbw/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'none', // Allow unused error variables in catch blocks
        },
      ],
    },
  },

  // Browser-specific configuration for public files
  {
    files: ['**/public/**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2021 },
    },
  },

  // React specific configuration
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
    },
    rules: {
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': [
        'error',
        { ignore: ['custom-prop', 'cmdk-input-wrapper', 'cmdk-group-heading'] },
      ],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
);
