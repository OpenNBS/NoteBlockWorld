module.exports = {
  extends: [
    'plugin:mdx/recommended',
    'next',
    'next/core-web-vitals',
    '../../.eslintrc.js',
  ],
  settings: {
    'mdx/code-blocks': true,
  },
  overrides: [
    {
      files: '*.mdx',
      parser: 'eslint-mdx',
    },
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: {
    React: 'readonly', // Taken from the JSON file
  },
};
