import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';

export default tseslint.config(
  // Global ignores (no changes here)
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.ts',
      '**/generated/**',
      '.eslintrc.js',
    ],
  },
  
  // Base recommended configurations (no changes here)
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Main configuration object
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.es2021, ...globals.bun },
    },
    plugins: {
      'import': importPlugin,
    },
    settings: {
        'import/resolver': {
            typescript: {
                project: ['apps/*/tsconfig.json', 'packages/*/tsconfig.json', './tsconfig.json'],
            },
            node: true,
        },
        'import/core-modules': ['bun:test', 'bun:sqlite', 'bun'],
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      
      // Core and TypeScript rules (keep these)
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      'lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: true }], // 👈 ADD THIS RULE

      // Import rules (keep these)
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'unknown'],
        'pathGroups': [{ pattern: '@/**', group: 'internal' }],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      }],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  },

  // React specific configuration (no changes here)
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
    },
    rules: {
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': ['error', { ignore: ['custom-prop', 'cmdk-input-wrapper', 'cmdk-group-heading'] }]
    },
    settings: {
      react: { version: 'detect' },
    },
  },
);