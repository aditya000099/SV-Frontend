/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#663399', // Royal matte purple
          600: '#5b2d8d',
          700: '#4c2680',
          800: '#3d1f73',
          900: '#2e1866',
        }
      }
    }
  },
  plugins: [],
}

