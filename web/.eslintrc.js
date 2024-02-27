module.exports = {
  extends: ['next', 'next/core-web-vitals', '../.eslintrc.js'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: {
    React: 'readonly', // Taken from the JSON file
  },
};
