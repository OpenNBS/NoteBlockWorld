import baseConfig from './eslint.config.js';
import tsparser from '@typescript-eslint/parser';
import mdx from 'eslint-plugin-mdx';

export default [
  ...baseConfig,

  // Frontend TypeScript/TSX configuration
  {
    files: ['apps/frontend/**/*.ts', 'apps/frontend/**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './apps/frontend/tsconfig.json',
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      mdx: mdx,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: './apps/frontend/tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', 'apps/frontend/src/'],
        },
      },
    },
    rules: {
      // Next.js specific rules would go here
      // For now, inherit from base config
    },
  },

  // MDX files configuration
  {
    files: ['apps/frontend/**/*.mdx'],
    ...mdx.configs.recommended,
    settings: {
      'mdx/code-blocks': true,
    },
  },
];
