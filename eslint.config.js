import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

export default tseslint.config(
  // Global ignores.
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
  
  // Apply base recommended configurations.
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // A single, unified object for all custom rules and plugin configurations.
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021, // A modern equivalent of the 'es6' env
      },
    },
    plugins: {
      'import': importPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    settings: {
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
        'import/core-modules': ['bun:test', 'bun:sqlite', 'bun'],
    },
    rules: {
      // Manually include rules from the import plugin's recommended configs.
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      
      // Your custom rules from the original file.
      'no-console': 'warn',
      'max-len': ['error', {
        code: 1024,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      'key-spacing': ['error', {
        align: {
          beforeColon: false,
          afterColon: true,
          on: 'colon',
        },
      }],
      '@typescript-eslint/no-unused-vars': 'off', // Disabled to allow unused-imports plugin to handle it.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'import/order': ['error', {
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
        'pathGroups': [{
          pattern: '@/**',
          group: 'internal',
        }],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      }],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // Spacing rules for consistency
      'space-infix-ops': 'error', // Enforces spaces around operators like +, =, etc.
      'keyword-spacing': ['error', { 'before': true, 'after': true }], // Enforces spaces around keywords like if, else.
      'arrow-spacing': ['error', { 'before': true, 'after': true }], // Enforces spaces around arrow in arrow functions.
      'space-before-blocks': 'error', // Enforces a space before opening curly braces.
      'object-curly-spacing': ['error', 'always'], // Enforces spaces inside curly braces: { foo } not {foo}.
      'comma-spacing': ['error', { 'before': false, 'after': true }], // Enforces space after a comma, not before.
      'space-before-function-paren': ['error', { 'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always' }], // Controls space before function parentheses.
      'comma-dangle': ['error', 'never'], // Disallows trailing commas
    },
  },
);