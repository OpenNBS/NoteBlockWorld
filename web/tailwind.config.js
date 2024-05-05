/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@shrutibalasa/tailwind-grid-auto-fit'),
    require('tailwindcss-animate'),
  ],
};
