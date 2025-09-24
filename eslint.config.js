import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import stylistic from '@stylistic/eslint-plugin';

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
      '@stylistic': stylistic,
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
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-unused-vars': [
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
      '@stylistic/indent': ['error', 4], // Set default indentation to 4 spaces.
      '@stylistic/space-infix-ops': 'error', // Enforces spaces around operators like +, =, etc.
      '@stylistic/keyword-spacing': ['error', { 'before': true, 'after': true }], // Enforces spaces around keywords like if, else.
      '@stylistic/arrow-spacing': ['error', { 'before': true, 'after': true }], // Enforces spaces around arrow in arrow functions.
      '@stylistic/space-before-blocks': 'error', // Enforces a space before opening curly braces.
      '@stylistic/object-curly-spacing': ['error', 'always'], // Enforces spaces inside curly braces: { foo } not {foo}.
      '@stylistic/comma-spacing': ['error', { 'before': false, 'after': true }], // Enforces space after a comma, not before.
      '@stylistic/space-before-function-paren': ['error', { 'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always' }], // Controls space before function parentheses.
      '@stylistic/comma-dangle': ['error', 'never'], // Disallows trailing commas
      '@stylistic/key-spacing': ['error', {
        align: {
          beforeColon: false,
          afterColon: true,
          on: 'colon',
        },
      }],
    },
  },
  // Override for JSX files
  {
    files: ['**/*.jsx', '**/*.tsx'],
    rules: {
        '@stylistic/indent': ['error', 2], // Set indentation to 2 spaces for JSX files.
    },
  },
);

