import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  // Base JavaScript configuration
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Global ignore patterns
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

  // Universal TypeScript configuration for the entire monorepo
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        // Don't use project-based parsing to avoid config issues
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Universal globals that work everywhere
        ...globals.node,
        ...globals.jest,
        ...globals.bun,
        ...globals.browser,
        ...globals.es2021,
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    plugins: {
      'import/resolver': {
        typescript: {
          // Point to all tsconfig.json files in your workspaces
          project: [
            'apps/*/tsconfig.json',
            'packages/*/tsconfig.json',
            './tsconfig.json', // Also include the root tsconfig as a fallback
          ],
        },
        node: true,
      },
      // Allow Bun built-in modules
      'import/core-modules': ['bun:test', 'bun'],
    },
    rules: {
      // Turn off rules that conflict with TypeScript
      'no-undef': 'off', // TypeScript handles this
      'no-unused-vars': 'off', // Use TypeScript version instead
      'no-redeclare': 'off', // TypeScript handles this better

      // Turn off rules that don't exist or cause issues
      'react-hooks/exhaustive-deps': 'off',
      '@next/next/no-sync-scripts': 'off',
      'no-shadow-restricted-names': 'off',

      // TypeScript specific rules - simplified and lenient
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',

      // Prettier integration
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
          trailingComma: 'all',
        },
      ],

      // Relaxed rules for monorepo compatibility
      'no-console': 'off',
      'prefer-const': 'warn',
      'no-constant-condition': 'warn',
      'no-constant-binary-expression': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Prettier config (must be last to override conflicting rules)
  prettierConfig,
];
