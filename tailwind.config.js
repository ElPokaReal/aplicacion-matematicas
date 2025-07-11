/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sky': {
          200: '#bae6fd',
        },
        'mint': {
          200: '#a7f3d0',
        },
        'yellow': {
          100: '#fef3c7',
        }
      },
      fontFamily: {
        'fredoka': ['Fredoka', 'sans-serif'],
      },
    },
  },
  plugins: [],
};