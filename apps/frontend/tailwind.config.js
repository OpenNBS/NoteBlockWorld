/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      transitionTimingFunction: {
        'out-back': 'cubic-bezier(0.34, 1.56, 0.51, 1.2)',
      },
    },
  },
  plugins: [require('@shrutibalasa/tailwind-grid-auto-fit')],
};
